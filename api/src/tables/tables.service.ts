import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  createEmployeeSkillRelationsTableSql,
  createEmployeesTableSql,
  createSkillsTableSql,
} from '../sql-commands';

@Injectable()
export class TablesService {
  constructor(protected readonly databaseService: DatabaseService) {}

  async createTables() {
    await this.createEmployeesTable();
    await this.createSkillsTable();
    await this.createEmployeeSkillRelationsTable();
  }

  createEmployeesTable() {
    return this.databaseService.execute(createEmployeesTableSql);
  }

  createSkillsTable() {
    return this.databaseService.execute(createSkillsTableSql);
  }

  createEmployeeSkillRelationsTable() {
    return this.databaseService.execute(createEmployeeSkillRelationsTableSql);
  }
}
