import { Body, Controller, Param, Query } from '@nestjs/common';
import {
  CreateSkillDto,
  PaginatedListParameters,
  SkillEndpoints,
  UpdateSkillDto,
} from '@skills-matrix/types';
import { HttpMethod, ServerEndpoints } from '@typed-web-api/nestjs';
import { SkillsService } from './skills.service';

@Controller()
export class SkillsController implements ServerEndpoints<SkillEndpoints> {
  constructor(protected readonly skillsService: SkillsService) {}

  @HttpMethod()
  '/skills_get'(@Query() params: PaginatedListParameters) {
    return this.skillsService.findAll(params);
  }

  @HttpMethod()
  '/skills/getRarest_get'() {
    return this.skillsService.getRarest();
  }

  @HttpMethod()
  '/skills/:id_get'(@Param('id') id: string) {
    return this.skillsService.findOne(+id);
  }

  @HttpMethod()
  '/skills_post'(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @HttpMethod()
  '/skills_put'(@Body() skillDto: UpdateSkillDto) {
    return this.skillsService.update(skillDto);
  }

  @HttpMethod()
  '/skills/:id_delete'(@Param('id') id: string) {
    return this.skillsService.delete(+id);
  }
}
