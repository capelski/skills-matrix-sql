import { Injectable } from '@nestjs/common';
import { ResultSetHeader } from 'mysql2';
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
  insertEmployeeSkillRelationSql,
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
    const employeeIds: number[] = [];
    for (const employee of sampleEmployees) {
      const result: ResultSetHeader = await this.databaseService.execute(insertEmployeeSql, {
        name: employee.name,
        surname: employee.surname,
      });
      employeeIds.push(result.insertId);
    }

    const skillIds: number[] = [];
    for (const skill of sampleSkills) {
      const result: ResultSetHeader = await this.databaseService.execute(insertSkillSql, {
        description: '',
        name: skill.name,
      });
      skillIds.push(result.insertId);
    }

    for (const employeeId of employeeIds) {
      // Each employee gets between 1 and 5 skills
      const numberOfSkills = Math.floor(Math.random() * 5) + 1;
      const shuffledSkillIds = skillIds.sort(() => 0.5 - Math.random());
      const selectedSkillIds = shuffledSkillIds.slice(0, numberOfSkills);

      for (const skillId of selectedSkillIds) {
        await this.databaseService.execute(insertEmployeeSkillRelationSql, {
          employeeId: String(employeeId),
          skillId: String(skillId),
        });
      }
    }
  }
}

const sampleEmployees = [
  { name: 'Adele', surname: 'Adkins' },
  { name: 'Laura', surname: 'Marling' },
  { name: 'Zayn', surname: 'Malik' },
  { name: 'Emily', surname: 'Maguire' },
  { name: 'Amy', surname: 'Macdonald' },
  { name: 'Kirsty', surname: 'MacColl' },
  { name: 'Ewan', surname: 'MacColl' },
  { name: 'Nick', surname: 'Lowe' },
  { name: 'Jez', surname: 'Lowe' },
  { name: 'Cher', surname: 'Lloyd' },
  { name: 'Dua', surname: 'Lipa' },
  { name: 'Leona', surname: 'Lewis' },
  { name: 'Al', surname: 'Lewis' },
  { name: 'Adam', surname: 'Leonardo' },
  { name: 'John', surname: 'Lennon' },
  { name: 'Charlie', surname: 'Landsborough' },
  { name: 'Steve', surname: 'Knightley' },
  { name: 'Beverley', surname: 'Knight' },
  { name: 'Hani', surname: 'King' },
  { name: 'Nik', surname: 'Kershaw' },
  { name: 'Martyn', surname: 'Joseph' },
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
