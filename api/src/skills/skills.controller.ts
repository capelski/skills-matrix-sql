import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { sqlOperationHandler } from '../sql-operation-handler';
import { SkillDto } from './dto/skill.dto';
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
      'Error fetching skills',
    );
  }

  @Get('getRarest')
  getRarest() {
    return sqlOperationHandler(
      () => this.skillsService.getRarest(),
      'Error fetching rarest skills',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return sqlOperationHandler(() => this.skillsService.findOne(+id), 'Error fetching skill');
  }

  @Post()
  create(@Body() createSkillDto: SkillDto) {
    return sqlOperationHandler(
      () => this.skillsService.create(createSkillDto),
      'Error creating skill',
    );
  }

  @Put()
  update(@Body() skillDto: SkillDto) {
    return sqlOperationHandler(() => this.skillsService.update(skillDto), 'Error updating skill');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return sqlOperationHandler(() => this.skillsService.remove(+id), 'Error deleting skill');
  }
}
