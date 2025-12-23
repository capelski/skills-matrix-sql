export interface Employee {
  Id: number;
  Name: string;
  Surname?: string | null;
}

export interface EmployeeSkillRelation {
  employeeId: number;
  skillId: number;
}

export interface Skill {
  Description?: string | null;
  Id: number;
  Name: string;
}
