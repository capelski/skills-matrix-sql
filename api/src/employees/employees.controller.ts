import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { sqlOperationHandler } from '../sql-operation-handler';
import { EmployeeDto } from './dto/employee.dto';
import { EmployeesService } from './employees.service';

@Controller('api/employees')
export class EmployeesController {
  constructor(protected readonly employeesService: EmployeesService) {}

  @Get()
  findAll(
    @Query('keywords') keywords?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return sqlOperationHandler(
      () => this.employeesService.findAll({ keywords, page, pageSize }),
      'getManyEmployeesSql / countAllEmployeesSql',
    );
  }

  @Get('/getMostSkilled')
  getMostSkilled() {
    return sqlOperationHandler(
      () => this.employeesService.getMostSkilled(),
      'getMostSkilledEmployeesSql',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return sqlOperationHandler(() => this.employeesService.findOne(+id), 'getOneEmployeeSql');
  }

  @Post()
  create(@Body() employeeDto: EmployeeDto) {
    return sqlOperationHandler(
      () => this.employeesService.create(employeeDto),
      'insertEmployeeSql',
    );
  }

  @Put()
  update(@Body() employeeDto: EmployeeDto) {
    return sqlOperationHandler(
      () => this.employeesService.update(employeeDto),
      'updateEmployeeSql',
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return sqlOperationHandler(() => this.employeesService.remove(+id), 'deleteEmployeeSql');
  }
}
