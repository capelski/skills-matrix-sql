import { Employee, Skill } from './entities';

export interface EmployeeDto extends Employee {
  Skills: Skill[];
}

export interface SkilledEmployee extends Employee {
  SkillsCount: number;
}

export interface SkillDto extends Skill {
  Employees: Employee[];
}

export interface RareSkill extends Skill {
  EmployeesCount: number;
}
