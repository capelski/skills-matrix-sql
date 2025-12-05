export interface Employee {
  Id: number;
  Name: string;
}

export interface EmployeeSkillRelation {
  employeeId: number;
  skillId: number;
}

export interface Skill {
  Id: number;
  Name: string;
}
