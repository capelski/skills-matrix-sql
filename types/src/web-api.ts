import { EndpointDefinition, JsonBody, QueryString, UrlParams } from '@typed-web-api/common';
import {
  CreateEmployeeDto,
  CreateSkillDto,
  EmployeeDto,
  PopulateTablesResult,
  RareSkill,
  SkillDto,
  SkilledEmployee,
  UpdateEmployeeDto,
  UpdateSkillDto,
} from './dtos';
import { Employee, Skill } from './entities';
import { PaginatedList, PaginatedListParameters } from './pagination';

export type IdPayload = { id: string };

export type EmployeeEndpoints = {
  '/employees_get': EndpointDefinition<
    PaginatedList<Employee>,
    QueryString<PaginatedListParameters>
  >;
  '/employees/getMostSkilled_get': EndpointDefinition<SkilledEmployee[]>;
  '/employees/:id_get': EndpointDefinition<EmployeeDto, UrlParams<IdPayload>>;
  '/employees_post': EndpointDefinition<EmployeeDto, JsonBody<CreateEmployeeDto>>;
  '/employees_put': EndpointDefinition<EmployeeDto, JsonBody<UpdateEmployeeDto>>;
  '/employees/:id_delete': EndpointDefinition<void, UrlParams<IdPayload>>;
};

export type SkillEndpoints = {
  '/skills_get': EndpointDefinition<PaginatedList<Skill>, QueryString<PaginatedListParameters>>;
  '/skills/getRarest_get': EndpointDefinition<RareSkill[]>;
  '/skills/:id_get': EndpointDefinition<SkillDto, UrlParams<IdPayload>>;
  '/skills_post': EndpointDefinition<SkillDto, JsonBody<CreateSkillDto>>;
  '/skills_put': EndpointDefinition<SkillDto, JsonBody<UpdateSkillDto>>;
  '/skills/:id_delete': EndpointDefinition<void, UrlParams<IdPayload>>;
};

export type TableEndpoints = {
  '/tables/create_post': EndpointDefinition<void>;
  '/tables/populate_post': EndpointDefinition<PopulateTablesResult>;
  '/tables/delete_post': EndpointDefinition<void>;
  '/tables/drop_post': EndpointDefinition<void>;
};

export type WebApiEndpoints = EmployeeEndpoints & SkillEndpoints & TableEndpoints;
