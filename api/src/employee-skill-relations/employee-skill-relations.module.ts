import { Module } from '@nestjs/common';
import { EmployeeSkillRelationsService } from './employee-skill-relations.service';

@Module({
  providers: [EmployeeSkillRelationsService],
  exports: [EmployeeSkillRelationsService],
})
export class EmployeeSkillRelationsModule {}
