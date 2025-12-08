import {
  Employee,
  EmployeeDto,
  PaginatedList,
  PaginatedListParameters,
  RareSkill,
  Skill,
  SkillDto,
  SkilledEmployee,
} from '@skills-matrix/types';
import { TypedResponse } from '@typed-web-api/client';
import { typedFetch } from '../typed-fetch';

class ApiService {
  private async handleResponse<T>(response: TypedResponse<T>): Promise<T> {
    if (!response.ok) {
      throw await response.json();
    }

    try {
      const data: T = await response.json();
      return data;
    } catch (error) {
      return undefined as T;
    }
  }

  // Employees
  async getEmployees(params: PaginatedListParameters = {}): Promise<PaginatedList<Employee>> {
    const response = await typedFetch('/employees_get', { queryString: params });
    return this.handleResponse(response);
  }

  async getEmployee(id: number): Promise<EmployeeDto> {
    const response = await typedFetch('/employees/:id_get', { urlParams: { id: String(id) } });
    return this.handleResponse(response);
  }

  async createEmployee(employee: EmployeeDto): Promise<EmployeeDto> {
    const response = await typedFetch('/employees_post', { jsonBody: employee });
    return this.handleResponse(response);
  }

  async updateEmployee(employee: EmployeeDto): Promise<EmployeeDto> {
    const response = await typedFetch('/employees_put', { jsonBody: employee });
    return this.handleResponse(response);
  }

  async deleteEmployee(id: number) {
    const response = await typedFetch('/employees/:id_delete', { urlParams: { id: String(id) } });
    return this.handleResponse(response);
  }

  async getMostSkilledEmployees(): Promise<SkilledEmployee[]> {
    const response = await typedFetch('/employees/getMostSkilled_get');
    return this.handleResponse(response);
  }

  // Skills
  async getSkills(params: PaginatedListParameters = {}): Promise<PaginatedList<Skill>> {
    const response = await typedFetch('/skills_get', { queryString: params });
    return this.handleResponse(response);
  }

  async getSkill(id: number): Promise<SkillDto> {
    const response = await typedFetch('/skills/:id_get', { urlParams: { id: String(id) } });
    return this.handleResponse(response);
  }

  async createSkill(skill: SkillDto): Promise<SkillDto> {
    const response = await typedFetch('/skills_post', { jsonBody: skill });
    return this.handleResponse(response);
  }

  async updateSkill(skill: SkillDto): Promise<SkillDto> {
    const response = await typedFetch('/skills_put', { jsonBody: skill });
    return this.handleResponse(response);
  }

  async deleteSkill(id: number) {
    const response = await typedFetch('/skills/:id_delete', { urlParams: { id: String(id) } });
    return this.handleResponse(response);
  }

  async getRarestSkills(): Promise<RareSkill[]> {
    const response = await typedFetch('/skills/getRarest_get');
    return this.handleResponse(response);
  }

  // Table operations
  async createTables(): Promise<void> {
    const response = await typedFetch('/tables/create_post');
    return this.handleResponse(response);
  }

  async populateTables(): Promise<void> {
    const response = await typedFetch('/tables/populate_post');
    return this.handleResponse(response);
  }

  async deleteTables(): Promise<void> {
    const response = await typedFetch('/tables/delete_post');
    return this.handleResponse(response);
  }

  async dropTables(): Promise<void> {
    const response = await typedFetch('/tables/drop_post');
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
