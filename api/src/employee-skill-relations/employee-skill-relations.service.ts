import { Injectable } from '@nestjs/common';
import { Employee, Skill } from '@skills-matrix/types';
import { DatabaseService } from '../database/database.service';
import {
  deleteEmployeeSkillRelationByEmployeeIdSql,
  deleteEmployeeSkillRelationBySkillIdSql,
  getEmployeesBySkillSql,
  getSkillsByEmployeeSql,
  insertEmployeeSkillRelationSql,
} from '../sql-commands';

@Injectable()
export class EmployeeSkillRelationsService {
  constructor(protected readonly databaseService: DatabaseService) {}

  create(employeeId: number, skillId: number) {
    return this.databaseService.execute(insertEmployeeSkillRelationSql, {
      employeeId: String(employeeId),
      skillId: String(skillId),
    });
  }

  findEmployeesBySkill(skillId: number): Promise<Employee[]> {
    return this.databaseService.execute(getEmployeesBySkillSql, { skillId: String(skillId) });
  }

  findSkillsByEmployee(employeeId: number): Promise<Skill[]> {
    return this.databaseService.execute(getSkillsByEmployeeSql, { employeeId: String(employeeId) });
  }

  removeByEmployeeId(employeeId: number): Promise<Employee[]> {
    return this.databaseService.execute(deleteEmployeeSkillRelationByEmployeeIdSql, {
      employeeId: String(employeeId),
    });
  }

  removeBySkillId(skillId: number): Promise<Skill[]> {
    return this.databaseService.execute(deleteEmployeeSkillRelationBySkillIdSql, {
      skillId: String(skillId),
    });
  }
}
