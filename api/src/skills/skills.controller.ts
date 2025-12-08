import { Body, Controller, Param, Query } from '@nestjs/common';
import { PaginatedListParameters, SkillDto, SkillEndpoints } from '@skills-matrix/types';
import { HttpMethod, ServerEndpoints } from '@typed-web-api/nestjs';
import { sqlOperationHandler } from '../sql-operation-handler';
import { SkillsService } from './skills.service';

@Controller()
export class SkillsController implements ServerEndpoints<SkillEndpoints> {
  constructor(protected readonly skillsService: SkillsService) {}

  @HttpMethod()
  '/skills_get'(@Query() params: PaginatedListParameters) {
    return sqlOperationHandler(
      () => this.skillsService.findAll(params),
      'getManySkillsSql / countAllSkillsSql',
    );
  }

  @HttpMethod()
  '/skills/getRarest_get'() {
    return sqlOperationHandler(() => this.skillsService.getRarest(), 'getRarestSkillsSql');
  }

  @HttpMethod()
  '/skills/:id_get'(@Param('id') id: string) {
    return sqlOperationHandler(() => this.skillsService.findOne(+id), 'getOneSkillSql');
  }

  @HttpMethod()
  '/skills_post'(@Body() createSkillDto: SkillDto) {
    return sqlOperationHandler(() => this.skillsService.create(createSkillDto), 'insertSkillSql');
  }

  @HttpMethod()
  '/skills_put'(@Body() skillDto: SkillDto) {
    return sqlOperationHandler(() => this.skillsService.update(skillDto), 'updateSkillSql');
  }

  @HttpMethod()
  '/skills/:id_delete'(@Param('id') id: string) {
    return sqlOperationHandler(() => this.skillsService.remove(+id), 'deleteSkillSql');
  }
}
