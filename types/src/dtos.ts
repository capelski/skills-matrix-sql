import { Employee, Skill } from './entities';

export interface EmployeeDto extends Employee {
  Skills: Skill[];
}

export interface SkillDto extends Skill {
  Employees: Employee[];
}
