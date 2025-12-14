import { Body, Controller, Param, Query } from '@nestjs/common';
import {
  CreateEmployeeDto,
  EmployeeEndpoints,
  PaginatedListParameters,
  UpdateEmployeeDto,
} from '@skills-matrix/types';
import { HttpMethod, ServerEndpoints } from '@typed-web-api/nestjs';
import { EmployeesService } from './employees.service';

@Controller()
export class EmployeesController implements ServerEndpoints<EmployeeEndpoints> {
  constructor(protected readonly employeesService: EmployeesService) {}

  @HttpMethod()
  '/employees_get'(@Query() params: PaginatedListParameters) {
    return this.employeesService.findAll(params);
  }

  @HttpMethod()
  '/employees/getMostSkilled_get'() {
    return this.employeesService.getMostSkilled();
  }

  @HttpMethod()
  '/employees/:id_get'(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @HttpMethod()
  '/employees_post'(@Body() employeeDto: CreateEmployeeDto) {
    return this.employeesService.create(employeeDto);
  }

  @HttpMethod()
  '/employees_put'(@Body() employeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(employeeDto);
  }

  @HttpMethod()
  '/employees/:id_delete'(@Param('id') id: string) {
    return this.employeesService.delete(+id);
  }
}
