import { AfterAll, BeforeAll } from '@cucumber/cucumber';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TablesService } from '../tables/tables.service';

let app: INestApplicationContext;

export const getNestApp = () => {
  return app;
};

BeforeAll(async () => {
  app = await NestFactory.createApplicationContext(AppModule);
  const tablesService = app.get(TablesService);
  await tablesService.dropTables();
  await tablesService.createTables();
  await tablesService.deleteData();
  await tablesService.populateTables();
});

AfterAll(async () => {
  if (app) {
    await app.close();
  }
});
