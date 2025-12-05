import { Injectable } from '@nestjs/common';
import {
  Employee,
  EmployeeDto,
  PaginatedList,
  PaginatedListParameters,
  Skill,
} from '@skills-matrix/types';
import { DatabaseService } from '../database/database.service';
import { EmployeeSkillRelationsService } from '../employee-skill-relations/employee-skill-relations.service';
import {
  countAllEmployeesSql,
  deleteEmployeeByIdSql,
  getEmployeeByIdSql,
  getManyEmployeesSql,
  getMostSkilledEmployeesSql,
  insertEmployeeSql,
  updateEmployeeByIdSql,
} from '../sql-commands';

@Injectable()
export class EmployeesService {
  constructor(
    protected readonly databaseService: DatabaseService,
    protected readonly employeeSkillRelationsService: EmployeeSkillRelationsService,
  ) {}

  async create(employeeDto: EmployeeDto): Promise<EmployeeDto> {
    const [result] = await this.databaseService.execute(insertEmployeeSql, {
      name: employeeDto.Name,
    });

    await this.insertRelations(employeeDto, employeeDto.Skills);

    return this.findOne(result.insertId);
  }

  async findAll({
    keywords,
    page,
    pageSize,
  }: PaginatedListParameters): Promise<PaginatedList<Employee>> {
    const currentKeywords = `%${keywords || ''}%`;
    const currentPage = Number(page) || 0;
    const currentPageSize = Number(pageSize) || 10;
    const employeesPage = await this.databaseService.execute(getManyEmployeesSql, {
      name: currentKeywords,
      limit: String(currentPageSize),
      offset: String(currentPage * currentPageSize),
    });
    const [{ Total }] = await this.databaseService.execute(countAllEmployeesSql, {
      name: currentKeywords,
    });

    return {
      CurrentPage: currentPage,
      Items: employeesPage,
      TotalPages: Math.ceil(Total / currentPageSize),
      TotalItems: Total,
    };
  }

  async findOne(id: number): Promise<EmployeeDto> {
    const [employee] = await this.databaseService.execute(getEmployeeByIdSql, { id: String(id) });

    const skills = await this.employeeSkillRelationsService.findSkillsByEmployee(id);

    return { ...employee, Skills: skills };
  }

  async getMostSkilled(): Promise<Employee[]> {
    const employees = await this.databaseService.execute(getMostSkilledEmployeesSql);

    return employees.map((employee) => {
      return {
        Id: employee.Id,
        Name: employee.Name,
        Skills: {
          length: employee.SkillCount || 0,
        },
      };
    });
  }

  protected async insertRelations(employee: Employee, skills: Skill[]): Promise<void> {
    for (const skill of skills) {
      await this.employeeSkillRelationsService.create(employee.Id, skill.Id);
    }
  }

  async update(employeeDto: EmployeeDto): Promise<EmployeeDto> {
    await this.databaseService.execute(updateEmployeeByIdSql, {
      name: employeeDto.Name,
      id: String(employeeDto.Id),
    });

    await this.employeeSkillRelationsService.removeByEmployeeId(employeeDto.Id);

    await this.insertRelations(employeeDto, employeeDto.Skills);

    return this.findOne(employeeDto.Id);
  }

  async remove(id: number): Promise<void> {
    await this.databaseService.execute(deleteEmployeeByIdSql, { id: String(id) });
  }
}
