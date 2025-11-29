import { Employee } from '../../employees/entities/employee.entity';
import { Skill } from '../entities/skill.entity';

export interface SkillDto extends Skill {
  Employees: Employee[];
}
