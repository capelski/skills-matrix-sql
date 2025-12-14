import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import { styleText } from 'node:util';
import { SqlException } from '../sql-exception.filter';

const logger = new Logger('DatabaseService');

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: mysql.Pool;

  async onModuleInit() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USERNAME || 'appuser',
      password: process.env.DB_PASSWORD || 'apppassword',
      database: process.env.DB_DATABASE || 'skills_matrix',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      namedPlaceholders: true,
    });
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
    }
  }

  async execute(commandName: string, sql: string, params?: Record<string, string>): Promise<any> {
    try {
      const [result] = await this.pool.execute(sql, params);
      return result;
    } catch (error: any) {
      const errorMessage = `Error executing ${commandName}: ${error.message}`;
      logger.error(styleText('red', errorMessage));
      throw new SqlException(errorMessage);
    }
  }
}
