import { AfterAll, BeforeAll } from '@cucumber/cucumber';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { styleText } from 'util';
import { AppModule } from '../app.module';
import { SqlException } from '../sql-exception.filter';
import { TablesService } from '../tables/tables.service';

let app: INestApplicationContext;

export const getNestApp = () => {
  return app;
};

BeforeAll(async () => {
  app = await NestFactory.createApplicationContext(AppModule);
  const tablesService = app.get(TablesService);
  try {
    await tablesService.dropTables();
    await tablesService.createTables();
    await tablesService.deleteData();
    await tablesService.populateTables();
  } catch (error) {
    if (error instanceof SqlException) {
      console.error(styleText('red', `Setup failure. ${error.message}`));
    }
    throw error;
  }
});

AfterAll(async () => {
  if (app) {
    await app.close();
  }
});
