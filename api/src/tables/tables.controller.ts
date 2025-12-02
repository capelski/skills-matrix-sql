import { Controller, Post } from '@nestjs/common';
import { sqlOperationHandler } from '../sql-operation-handler';
import { TablesService } from './tables.service';

@Controller('api/tables')
export class TablesController {
  constructor(protected readonly tablesService: TablesService) {}

  @Post('/create')
  createTables() {
    return sqlOperationHandler(() => this.tablesService.createTables(), 'Error creating tables');
  }

  @Post('/populate')
  populateTables() {
    return sqlOperationHandler(() => this.tablesService.populateTables(), 'Error creating data');
  }

  @Post('/delete')
  deleteData() {
    return sqlOperationHandler(() => this.tablesService.deleteData(), 'Error deleting data');
  }

  @Post('/drop')
  dropTables() {
    return sqlOperationHandler(() => this.tablesService.dropTables(), 'Error dropping tables');
  }
}
