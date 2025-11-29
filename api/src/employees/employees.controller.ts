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
      'Error fetching employees',
    );
  }

  @Get('/getMostSkilled')
  getMostSkilled() {
    return sqlOperationHandler(
      () => this.employeesService.getMostSkilled(),
      'Error fetching most skilled employees',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return sqlOperationHandler(() => this.employeesService.findOne(+id), 'Error fetching employee');
  }

  @Post()
  create(@Body() employeeDto: EmployeeDto) {
    return sqlOperationHandler(
      () => this.employeesService.create(employeeDto),
      'Error creating employee',
    );
  }

  @Put()
  update(@Body() employeeDto: EmployeeDto) {
    return sqlOperationHandler(
      () => this.employeesService.update(employeeDto),
      'Error updating employee',
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return sqlOperationHandler(() => this.employeesService.remove(+id), 'Error deleting employee');
  }
}
