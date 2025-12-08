import { Body, Controller, Param, Query } from '@nestjs/common';
import { EmployeeDto, EmployeeEndpoints, PaginatedListParameters } from '@skills-matrix/types';
import { HttpMethod, ServerEndpoints } from '@typed-web-api/nestjs';
import { sqlOperationHandler } from '../sql-operation-handler';
import { EmployeesService } from './employees.service';

@Controller()
export class EmployeesController implements ServerEndpoints<EmployeeEndpoints> {
  constructor(protected readonly employeesService: EmployeesService) {}

  @HttpMethod()
  '/employees_get'(@Query() params: PaginatedListParameters) {
    return sqlOperationHandler(
      () => this.employeesService.findAll(params),
      'getManyEmployeesSql / countAllEmployeesSql',
    );
  }

  @HttpMethod()
  '/employees/getMostSkilled_get'() {
    return sqlOperationHandler(
      () => this.employeesService.getMostSkilled(),
      'getMostSkilledEmployeesSql',
    );
  }

  @HttpMethod()
  '/employees/:id_get'(@Param('id') id: string) {
    return sqlOperationHandler(() => this.employeesService.findOne(+id), 'getOneEmployeeSql');
  }

  @HttpMethod()
  '/employees_post'(@Body() employeeDto: EmployeeDto) {
    return sqlOperationHandler(
      () => this.employeesService.create(employeeDto),
      'insertEmployeeSql',
    );
  }

  @HttpMethod()
  '/employees_put'(@Body() employeeDto: EmployeeDto) {
    return sqlOperationHandler(
      () => this.employeesService.update(employeeDto),
      'updateEmployeeSql',
    );
  }

  @HttpMethod()
  '/employees/:id_delete'(@Param('id') id: string) {
    return sqlOperationHandler(() => this.employeesService.remove(+id), 'deleteEmployeeSql');
  }
}
