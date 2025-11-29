import { Skill } from '../../skills/entities/skill.entity';
import { Employee } from '../entities/employee.entity';

export interface EmployeeDto extends Employee {
  Skills: Skill[];
}
