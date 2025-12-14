import { Injectable } from '@nestjs/common';
import { PopulateTablesResult } from '@skills-matrix/types';
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
    await this.databaseService.execute('createEmployeesTableSql', createEmployeesTableSql);
    await this.databaseService.execute('createSkillsTableSql', createSkillsTableSql);
    await this.databaseService.execute(
      'createEmployeeSkillRelationsTableSql',
      createEmployeeSkillRelationsTableSql,
    );
  }

  async deleteData() {
    await this.databaseService.execute('deleteEmployeesTableSql', deleteEmployeesTableSql);
    await this.databaseService.execute('deleteSkillsTableSql', deleteSkillsTableSql);
  }

  async dropTables() {
    await this.databaseService.execute(
      'dropEmployeeSkillRelationsTableSql',
      dropEmployeeSkillRelationsTableSql,
    );
    await this.databaseService.execute('dropEmployeesTableSql', dropEmployeesTableSql);
    await this.databaseService.execute('dropSkillsTableSql', dropSkillsTableSql);
  }

  async populateTables(): Promise<PopulateTablesResult> {
    const employeeIds: number[] = [];
    for (const employee of sampleEmployees) {
      const result: ResultSetHeader = await this.databaseService.execute(
        'insertEmployeeSql',
        insertEmployeeSql,
        {
          name: employee.name,
          surname: employee.surname,
        },
      );
      employeeIds.push(result.insertId);
    }

    const skillIds: number[] = [];
    for (const skill of sampleSkills) {
      const result: ResultSetHeader = await this.databaseService.execute(
        'insertSkillSql',
        insertSkillSql,
        {
          description: '',
          name: skill.name,
        },
      );
      skillIds.push(result.insertId);
    }

    const numberOfSkilledEmployees = 5;
    const numberOfSkills = 5;
    for (let employeeIndex = 0; employeeIndex < numberOfSkilledEmployees; employeeIndex++) {
      for (let skillIndex = employeeIndex; skillIndex < numberOfSkills; skillIndex++) {
        await this.databaseService.execute(
          'insertEmployeeSkillRelationSql',
          insertEmployeeSkillRelationSql,
          {
            employeeId: String(employeeIds[employeeIndex]),
            skillId: String(skillIds[skillIndex - employeeIndex]),
          },
        );
      }
    }

    return { employeeIds, skillIds };
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
