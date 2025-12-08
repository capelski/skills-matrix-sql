import { Injectable } from '@nestjs/common';
import {
  Employee,
  PaginatedList,
  PaginatedListParameters,
  RareSkill,
  Skill,
  SkillDto,
} from '@skills-matrix/types';
import { ResultSetHeader } from 'mysql2';
import { DatabaseService } from '../database/database.service';
import { EmployeeSkillRelationsService } from '../employee-skill-relations/employee-skill-relations.service';
import {
  countAllSkillsSql,
  deleteSkillByIdSql,
  getManySkillsSql,
  getRarestSkillsSql,
  getSkillByIdSql,
  insertSkillSql,
  updateSkillByIdSql,
} from '../sql-commands';

@Injectable()
export class SkillsService {
  constructor(
    protected readonly databaseService: DatabaseService,
    protected readonly employeeSkillRelationsService: EmployeeSkillRelationsService,
  ) {}

  async create(skillDto: SkillDto): Promise<SkillDto> {
    const result: ResultSetHeader = await this.databaseService.execute(insertSkillSql, {
      name: skillDto.Name,
    });

    await this.insertRelations(result.insertId, skillDto.Employees);

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
    const skills: Skill[] = await this.databaseService.execute(getManySkillsSql, {
      name: currentKeywords,
      limit: String(currentPageSize),
      offset: String(currentPage * currentPageSize),
    });
    const [{ Total }]: [{ Total: number }] = await this.databaseService.execute(countAllSkillsSql, {
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
    const [skill]: [Skill] = await this.databaseService.execute(getSkillByIdSql, {
      id: String(id),
    });

    const employees = await this.employeeSkillRelationsService.findEmployeesBySkill(id);

    return { ...skill, Employees: employees };
  }

  getRarest(): Promise<RareSkill> {
    return this.databaseService.execute(getRarestSkillsSql);
  }

  protected async insertRelations(skillId: number, employees: Employee[]): Promise<void> {
    for (const employee of employees) {
      await this.employeeSkillRelationsService.create(employee.Id, skillId);
    }
  }

  async update(skillDto: SkillDto): Promise<SkillDto> {
    await this.databaseService.execute(updateSkillByIdSql, {
      name: skillDto.Name,
      id: String(skillDto.Id),
    });

    await this.employeeSkillRelationsService.removeBySkillId(skillDto.Id);

    await this.insertRelations(skillDto.Id, skillDto.Employees);

    return this.findOne(skillDto.Id);
  }

  async remove(id: number): Promise<void> {
    await this.databaseService.execute(deleteSkillByIdSql, { id: String(id) });
  }
}
