import { Controller } from '@nestjs/common';
import { TableEndpoints } from '@skills-matrix/types';
import { HttpMethod, ServerEndpoints } from '@typed-web-api/nestjs';
import { sqlOperationHandler } from '../sql-operation-handler';
import { TablesService } from './tables.service';

@Controller()
export class TablesController implements ServerEndpoints<TableEndpoints> {
  constructor(protected readonly tablesService: TablesService) {}

  @HttpMethod()
  '/tables/create_post'() {
    return sqlOperationHandler(() => this.tablesService.createTables(), 'Error creating tables');
  }

  @HttpMethod()
  '/tables/populate_post'() {
    return sqlOperationHandler(() => this.tablesService.populateTables(), 'Error creating data');
  }

  @HttpMethod()
  '/tables/delete_post'() {
    return sqlOperationHandler(() => this.tablesService.deleteData(), 'Error deleting data');
  }

  @HttpMethod()
  '/tables/drop_post'() {
    return sqlOperationHandler(() => this.tablesService.dropTables(), 'Error dropping tables');
  }
}
