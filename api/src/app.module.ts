import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { EmployeeSkillRelationsModule } from './employee-skill-relations/employee-skill-relations.module';
import { EmployeesModule } from './employees/employees.module';
import { SkillsModule } from './skills/skills.module';
import { TablesModule } from './tables/tables.module';

@Module({
  imports: [
    DatabaseModule,
    EmployeesModule,
    EmployeeSkillRelationsModule,
    SkillsModule,
    TablesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
