import { Module } from '@nestjs/common';
import { EmployeeSkillRelationsModule } from '../employee-skill-relations/employee-skill-relations.module';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

@Module({
  imports: [EmployeeSkillRelationsModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
