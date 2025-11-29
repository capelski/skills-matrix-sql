import { Module } from '@nestjs/common';
import { EmployeeSkillRelationsModule } from '../employee-skill-relations/employee-skill-relations.module';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';

@Module({
  imports: [EmployeeSkillRelationsModule],
  controllers: [SkillsController],
  providers: [SkillsService],
})
export class SkillsModule {}
