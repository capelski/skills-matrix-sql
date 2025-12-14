import { Employee, Skill } from './entities';

/** Employees **/
export interface CreateEmployeeDto extends Omit<Employee, 'Id'> {
  SkillIds: number[];
}

export interface EmployeeDto extends Employee {
  Skills: Skill[];
}

export interface SkilledEmployee extends Employee {
  SkillsCount: number;
}

export interface UpdateEmployeeDto extends Employee {
  SkillIds: number[];
}

/** Skills **/

export interface CreateSkillDto extends Omit<Skill, 'Id'> {
  EmployeeIds: number[];
}

export interface RareSkill extends Skill {
  EmployeesCount: number;
}

export interface SkillDto extends Skill {
  Employees: Employee[];
}

export interface UpdateSkillDto extends Skill {
  EmployeeIds: number[];
}

/** Others **/

export interface PopulateTablesResult {
  employeeIds: number[];
  skillIds: number[];
}
