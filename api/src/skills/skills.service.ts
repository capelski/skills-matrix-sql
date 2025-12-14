import { Injectable } from '@nestjs/common';
import {
  CreateSkillDto,
  PaginatedList,
  PaginatedListParameters,
  RareSkill,
  Skill,
  SkillDto,
  UpdateSkillDto,
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

  async count(keywords?: string): Promise<number> {
    const currentKeywords = `%${keywords || ''}%`;
    const [{ Total }]: [{ Total: number }] = await this.databaseService.execute(
      'countAllSkillsSql',
      countAllSkillsSql,
      {
        name: currentKeywords,
      },
    );
    return Total;
  }

  async create(skillDto: CreateSkillDto): Promise<SkillDto> {
    const result: ResultSetHeader = await this.databaseService.execute(
      'insertSkillSql',
      insertSkillSql,
      {
        description: skillDto.Description,
        name: skillDto.Name,
      },
    );

    await this.insertRelations(result.insertId, skillDto.EmployeeIds);

    return this.findOne(result.insertId);
  }

  async findAll({ keywords, page, pageSize }: PaginatedListParameters = {}): Promise<
    PaginatedList<Skill>
  > {
    const currentKeywords = `%${keywords || ''}%`;
    const currentPage = Number(page) || 0;
    const currentPageSize = Number(pageSize) || 10;
    const skills: Skill[] = await this.databaseService.execute(
      'getManySkillsSql',
      getManySkillsSql,
      {
        name: currentKeywords,
        limit: String(currentPageSize),
        offset: String(currentPage * currentPageSize),
      },
    );
    const Total = await this.count(keywords);

    return {
      CurrentPage: currentPage,
      Items: skills,
      TotalPages: Math.ceil(Total / currentPageSize),
      TotalItems: Total,
    };
  }

  async findOne(id: number): Promise<SkillDto> {
    const [skill]: [Skill] = await this.databaseService.execute(
      'getSkillByIdSql',
      getSkillByIdSql,
      {
        id: String(id),
      },
    );

    if (!skill) {
      return undefined;
    }

    const employees = await this.employeeSkillRelationsService.findEmployeesBySkill(id);

    return { ...skill, Employees: employees };
  }

  getRarest(): Promise<RareSkill[]> {
    return this.databaseService.execute('getRarestSkillsSql', getRarestSkillsSql);
  }

  protected async insertRelations(skillId: number, employeeIds: number[]): Promise<void> {
    for (const employeeId of employeeIds) {
      await this.employeeSkillRelationsService.create(employeeId, skillId);
    }
  }

  async update(skillDto: UpdateSkillDto): Promise<SkillDto> {
    const result: ResultSetHeader = await this.databaseService.execute(
      'updateSkillByIdSql',
      updateSkillByIdSql,
      {
        description: skillDto.Description,
        id: String(skillDto.Id),
        name: skillDto.Name,
      },
    );

    if (!result.affectedRows) {
      return undefined;
    }

    await this.employeeSkillRelationsService.removeBySkillId(skillDto.Id);

    await this.insertRelations(skillDto.Id, skillDto.EmployeeIds);

    return this.findOne(skillDto.Id);
  }

  async delete(id: number): Promise<void> {
    await this.databaseService.execute('deleteSkillByIdSql', deleteSkillByIdSql, {
      id: String(id),
    });
  }
}
