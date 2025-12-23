import { Injectable } from '@nestjs/common';
import {
  CreateEmployeeDto,
  Employee,
  EmployeeDto,
  PaginatedList,
  PaginatedListParameters,
  SkilledEmployee,
  UpdateEmployeeDto,
} from '@skills-matrix/types';
import { ResultSetHeader } from 'mysql2';
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

const trimDefaultEmployeeFields = (employee: CreateEmployeeDto | UpdateEmployeeDto) => {
  return {
    name: employee.Name?.trim() || null,
    surname: employee.Surname?.trim() || null,
  };
};

@Injectable()
export class EmployeesService {
  constructor(
    protected readonly databaseService: DatabaseService,
    protected readonly employeeSkillRelationsService: EmployeeSkillRelationsService,
  ) {}

  async count(keywords?: string): Promise<number> {
    const currentKeywords = `%${keywords || ''}%`;
    const [{ Total }]: [{ Total: number }] = await this.databaseService.execute(
      'countAllEmployeesSql',
      countAllEmployeesSql,
      {
        name: currentKeywords,
      },
    );
    return Total;
  }

  async create(employeeDto: CreateEmployeeDto): Promise<EmployeeDto> {
    const result: ResultSetHeader = await this.databaseService.execute(
      'insertEmployeeSql',
      insertEmployeeSql,
      trimDefaultEmployeeFields(employeeDto),
    );

    await this.insertRelations(result.insertId, employeeDto.SkillIds);

    return this.findOne(result.insertId);
  }

  async findAll({ keywords, page, pageSize }: PaginatedListParameters = {}): Promise<
    PaginatedList<Employee>
  > {
    const currentKeywords = `%${keywords || ''}%`;
    const currentPage = Number(page) || 0;
    const currentPageSize = Number(pageSize) || 10;
    const employeesPage: Employee[] = await this.databaseService.execute(
      'getManyEmployeesSql',
      getManyEmployeesSql,
      {
        name: currentKeywords,
        limit: String(currentPageSize),
        offset: String(currentPage * currentPageSize),
      },
    );
    const Total = await this.count(keywords);

    return {
      CurrentPage: currentPage,
      Items: employeesPage,
      TotalPages: Math.ceil(Total / currentPageSize),
      TotalItems: Total,
    };
  }

  async findOne(id: number): Promise<EmployeeDto> {
    const [employee] = await this.databaseService.execute(
      'getEmployeeByIdSql',
      getEmployeeByIdSql,
      { id: String(id) },
    );

    if (!employee) {
      return undefined;
    }

    const skills = await this.employeeSkillRelationsService.findSkillsByEmployee(id);

    return { ...employee, Skills: skills };
  }

  async getMostSkilled(): Promise<SkilledEmployee[]> {
    return this.databaseService.execute('getMostSkilledEmployeesSql', getMostSkilledEmployeesSql);
  }

  protected async insertRelations(employeeId: number, skillIds: number[]): Promise<void> {
    for (const skillId of skillIds) {
      await this.employeeSkillRelationsService.create(employeeId, skillId);
    }
  }

  async update(employeeDto: UpdateEmployeeDto): Promise<EmployeeDto> {
    const result: ResultSetHeader = await this.databaseService.execute(
      'updateEmployeeByIdSql',
      updateEmployeeByIdSql,
      {
        id: String(employeeDto.Id),
        ...trimDefaultEmployeeFields(employeeDto),
      },
    );

    if (!result.affectedRows) {
      return undefined;
    }

    await this.employeeSkillRelationsService.removeByEmployeeId(employeeDto.Id);

    await this.insertRelations(employeeDto.Id, employeeDto.SkillIds);

    return this.findOne(employeeDto.Id);
  }

  async delete(id: number): Promise<void> {
    await this.databaseService.execute('deleteEmployeeByIdSql', deleteEmployeeByIdSql, {
      id: String(id),
    });
  }
}
