import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { EmployeeSkillRelationsService } from '../employee-skill-relations/employee-skill-relations.service';
import { Employee } from '../employees/entities/employee.entity';
import { PaginatedList, PaginatedListParameters } from '../paginated-list';
import {
  countAllSkillsSql,
  deleteSkillByIdSql,
  getManySkillsSql,
  getRarestSkillsSql,
  getSkillByIdSql,
  insertSkillSql,
  updateSkillByIdSql,
} from '../sql-commands';
import { SkillDto } from './dto/skill.dto';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    protected readonly databaseService: DatabaseService,
    protected readonly employeeSkillRelationsService: EmployeeSkillRelationsService,
  ) {}

  async create(skillDto: SkillDto): Promise<SkillDto> {
    const [result] = await this.databaseService.execute(insertSkillSql, { name: skillDto.Name });

    await this.insertRelations(skillDto, skillDto.Employees);

    return this.findOne(result.insertId);
  }

  async findAll({
    keywords,
    page,
    pageSize,
  }: PaginatedListParameters): Promise<PaginatedList<Skill>> {
    const currentKeywords = `%${keywords || ''}%`;
    const currentPage = Number(page) || 0;
    const currentPageSize = Number(pageSize) || 10;
    const skills = await this.databaseService.execute(getManySkillsSql, {
      name: currentKeywords,
      limit: String(currentPageSize),
      offset: String(currentPage * currentPageSize),
    });
    const [{ Total }] = await this.databaseService.execute(countAllSkillsSql, {
      name: currentKeywords,
    });

    return {
      CurrentPage: currentPage,
      Items: skills,
      TotalPages: Math.ceil(Total / currentPageSize),
      TotalItems: Total,
    };
  }

  async findOne(id: number): Promise<SkillDto> {
    const [skill] = await this.databaseService.execute(getSkillByIdSql, { id: String(id) });

    const employees = await this.employeeSkillRelationsService.findEmployeesBySkill(id);

    return { ...skill, Employees: employees };
  }

  async getRarest(): Promise<Skill> {
    const skills = await this.databaseService.execute(getRarestSkillsSql);

    return skills.map((skill) => {
      return {
        Id: skill.Id,
        Name: skill.Name,
        Employees: {
          length: skill.EmployeeCount || 0,
        },
      };
    });
  }

  protected async insertRelations(skill: Skill, employees: Employee[]): Promise<void> {
    for (const employee of employees) {
      await this.employeeSkillRelationsService.create(employee.Id, skill.Id);
    }
  }

  async update(skillDto: SkillDto): Promise<SkillDto> {
    await this.databaseService.execute(updateSkillByIdSql, {
      name: skillDto.Name,
      id: String(skillDto.Id),
    });

    await this.employeeSkillRelationsService.removeBySkillId(skillDto.Id);

    await this.insertRelations(skillDto, skillDto.Employees);

    return this.findOne(skillDto.Id);
  }

  async remove(id: number): Promise<void> {
    await this.databaseService.execute(deleteSkillByIdSql, { id: String(id) });
  }
}
