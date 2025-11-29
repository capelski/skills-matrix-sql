import { Controller, HttpException, Post } from '@nestjs/common';
import { TablesService } from './tables.service';

@Controller('api/tables')
export class TablesController {
  constructor(protected readonly tablesService: TablesService) {}

  @Post('/create')
  async createTables() {
    try {
      await this.tablesService.createTables();
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          title: 'Error creating tables',
        },
        500,
      );
    }
  }
}
