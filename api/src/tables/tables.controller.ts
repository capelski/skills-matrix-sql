import { Controller } from '@nestjs/common';
import { TableEndpoints } from '@skills-matrix/types';
import { HttpMethod, ServerEndpoints } from '@typed-web-api/nestjs';
import { TablesService } from './tables.service';

@Controller()
export class TablesController implements ServerEndpoints<TableEndpoints> {
  constructor(protected readonly tablesService: TablesService) {}

  @HttpMethod()
  '/tables/create_post'() {
    return this.tablesService.createTables();
  }

  @HttpMethod()
  '/tables/populate_post'() {
    return this.tablesService.populateTables();
  }

  @HttpMethod()
  '/tables/delete_post'() {
    return this.tablesService.deleteData();
  }

  @HttpMethod()
  '/tables/drop_post'() {
    return this.tablesService.dropTables();
  }
}
