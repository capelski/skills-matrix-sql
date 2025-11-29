import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    SkillsModule,
    TablesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
