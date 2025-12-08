import { EndpointDefinition, JsonBody, QueryString, UrlParams } from '@typed-web-api/common';
import { EmployeeDto, RareSkill, SkillDto, SkilledEmployee } from './dtos';
import { Employee, Skill } from './entities';
import { PaginatedList, PaginatedListParameters } from './pagination';

export type EmployeeEndpoints = {
  '/employees_get': EndpointDefinition<
    PaginatedList<Employee>,
    QueryString<PaginatedListParameters>
  >;
  '/employees/getMostSkilled_get': EndpointDefinition<SkilledEmployee[]>;
  '/employees/:id_get': EndpointDefinition<EmployeeDto, UrlParams<{ id: string }>>;
  '/employees_post': EndpointDefinition<EmployeeDto, JsonBody<EmployeeDto>>;
  '/employees_put': EndpointDefinition<EmployeeDto, JsonBody<EmployeeDto>>;
  '/employees/:id_delete': EndpointDefinition<void, UrlParams<{ id: string }>>;
};

export type SkillEndpoints = {
  '/skills_get': EndpointDefinition<PaginatedList<Skill>, QueryString<PaginatedListParameters>>;
  '/skills/getRarest_get': EndpointDefinition<RareSkill[]>;
  '/skills/:id_get': EndpointDefinition<SkillDto, UrlParams<{ id: string }>>;
  '/skills_post': EndpointDefinition<SkillDto, JsonBody<SkillDto>>;
  '/skills_put': EndpointDefinition<SkillDto, JsonBody<SkillDto>>;
  '/skills/:id_delete': EndpointDefinition<void, UrlParams<{ id: string }>>;
};

export type TableEndpoints = {
  '/tables/create_post': EndpointDefinition<void>;
  '/tables/populate_post': EndpointDefinition<void>;
  '/tables/delete_post': EndpointDefinition<void>;
  '/tables/drop_post': EndpointDefinition<void>;
};

export type WebApiEndpoints = EmployeeEndpoints & SkillEndpoints & TableEndpoints;
