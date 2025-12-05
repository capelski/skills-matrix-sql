import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { SkillDto } from '@skills-matrix/types';
import { sqlOperationHandler } from '../sql-operation-handler';
import { SkillsService } from './skills.service';

@Controller('api/skills')
export class SkillsController {
  constructor(protected readonly skillsService: SkillsService) {}

  @Get()
  findAll(
    @Query('keywords') keywords?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return sqlOperationHandler(
      () => this.skillsService.findAll({ keywords, page, pageSize }),
      'getManySkillsSql / countAllSkillsSql',
    );
  }

  @Get('getRarest')
  getRarest() {
    return sqlOperationHandler(() => this.skillsService.getRarest(), 'getRarestSkillsSql');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return sqlOperationHandler(() => this.skillsService.findOne(+id), 'getOneSkillSql');
  }

  @Post()
  create(@Body() createSkillDto: SkillDto) {
    return sqlOperationHandler(() => this.skillsService.create(createSkillDto), 'insertSkillSql');
  }

  @Put()
  update(@Body() skillDto: SkillDto) {
    return sqlOperationHandler(() => this.skillsService.update(skillDto), 'updateSkillSql');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return sqlOperationHandler(() => this.skillsService.remove(+id), 'deleteSkillSql');
  }
}
