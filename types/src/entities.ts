export interface Employee {
  Id: number;
  Name: string;
  Surname?: string;
}

export interface EmployeeSkillRelation {
  employeeId: number;
  skillId: number;
}

export interface Skill {
  Description?: string;
  Id: number;
  Name: string;
}
