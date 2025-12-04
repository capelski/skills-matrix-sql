import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  createEmployeeSkillRelationsTableSql,
  createEmployeesTableSql,
  createSkillsTableSql,
  deleteEmployeesTableSql,
  deleteSkillsTableSql,
  dropEmployeeSkillRelationsTableSql,
  dropEmployeesTableSql,
  dropSkillsTableSql,
  insertEmployeeSql,
  insertSkillSql,
} from '../sql-commands';

@Injectable()
export class TablesService {
  constructor(protected readonly databaseService: DatabaseService) {}

  async createTables() {
    await this.databaseService.execute(createEmployeesTableSql);
    await this.databaseService.execute(createSkillsTableSql);
    await this.databaseService.execute(createEmployeeSkillRelationsTableSql);
  }

  async deleteData() {
    await this.databaseService.execute(deleteEmployeesTableSql);
    await this.databaseService.execute(deleteSkillsTableSql);
  }

  async dropTables() {
    await this.databaseService.execute(dropEmployeeSkillRelationsTableSql);
    await this.databaseService.execute(dropEmployeesTableSql);
    await this.databaseService.execute(dropSkillsTableSql);
  }

  async populateTables() {
    for (const employee of sampleEmployees) {
      await this.databaseService.execute(insertEmployeeSql, {
        name: employee.name,
      });
    }

    for (const skill of sampleSkills) {
      await this.databaseService.execute(insertSkillSql, {
        name: skill.name,
      });
    }
  }
}

const sampleEmployees = [
  { name: 'Adele' },
  { name: 'Laura Marling' },
  { name: 'Zayn Malik' },
  { name: 'Emily Maguire' },
  { name: 'Amy Macdonald' },
  { name: 'Kirsty MacColl' },
  { name: 'Ewan MacColl' },
  { name: 'Nick Lowe' },
  { name: 'Jez Lowe' },
  { name: 'Cher Lloyd' },
  { name: 'Dua Lipa' },
  { name: 'Leona Lewis' },
  { name: 'Al Lewis' },
  { name: 'Adam Leonardo' },
  { name: 'John Lennon' },
  { name: 'Charlie Landsborough' },
  { name: 'Steve Knightley' },
  { name: 'Beverley Knight' },
  { name: 'Hani King' },
  { name: 'Nik Kershaw' },
  { name: 'Martyn Joseph' },
];

const sampleSkills = [
  { name: 'Object Rexx' },
  { name: 'Oberon' },
  { name: 'NXT-G' },
  { name: 'NSIS' },
  { name: 'NQC' },
  { name: 'Nemerle' },
  { name: 'NATURAL' },
  { name: 'MUMPS' },
  { name: 'MS-DOS batch' },
  { name: 'Moto' },
  { name: 'MOO' },
  { name: 'Monkey' },
  { name: 'Modula-3' },
  { name: 'Modula-2' },
  { name: 'Miva' },
  { name: 'Mercury' },
  { name: 'MEL' },
  { name: 'MDX' },
  { name: 'Max/MSP' },
  { name: 'MATLAB' },
  { name: 'Occam' },
];
