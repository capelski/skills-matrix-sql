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

const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

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
    const queryParams = new URLSearchParams();
    if (params.keywords) queryParams.append('keywords', params.keywords);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const query = queryParams.toString();
    return this.request<PaginatedList<Employee>>(`/employees${query ? `?${query}` : ''}`);
  }

  async getEmployee(id: number): Promise<EmployeeDto> {
    return this.request<EmployeeDto>(`/employees/${id}`);
  }

  async createEmployee(employee: EmployeeDto): Promise<EmployeeDto> {
    return this.request<EmployeeDto>('/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  }

  async updateEmployee(employee: EmployeeDto): Promise<EmployeeDto> {
    return this.request<EmployeeDto>('/employees', {
      method: 'PUT',
      body: JSON.stringify(employee),
    });
  }

  async deleteEmployee(id: number): Promise<void> {
    await this.request(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  async getMostSkilledEmployees(): Promise<SkilledEmployee[]> {
    return this.request<SkilledEmployee[]>('/employees/getMostSkilled');
  }

  // Skills
  async getSkills(params: PaginatedListParameters = {}): Promise<PaginatedList<Skill>> {
    const queryParams = new URLSearchParams();
    if (params.keywords) queryParams.append('keywords', params.keywords);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const query = queryParams.toString();
    return this.request<PaginatedList<Skill>>(`/skills${query ? `?${query}` : ''}`);
  }

  async getSkill(id: number): Promise<SkillDto> {
    return this.request<SkillDto>(`/skills/${id}`);
  }

  async createSkill(skill: SkillDto): Promise<SkillDto> {
    return this.request<SkillDto>('/skills', {
      method: 'POST',
      body: JSON.stringify(skill),
    });
  }

  async updateSkill(skill: SkillDto): Promise<SkillDto> {
    return this.request<SkillDto>('/skills', {
      method: 'PUT',
      body: JSON.stringify(skill),
    });
  }

  async deleteSkill(id: number): Promise<void> {
    await this.request(`/skills/${id}`, {
      method: 'DELETE',
    });
  }

  async getRarestSkills(): Promise<RareSkill[]> {
    return this.request<RareSkill[]>('/skills/getRarest');
  }

  // Table operations
  async createTables(): Promise<void> {
    await this.request('/tables/create', {
      method: 'POST',
    });
  }

  async populateTables(): Promise<void> {
    await this.request('/tables/populate', {
      method: 'POST',
    });
  }

  async deleteTables(): Promise<void> {
    await this.request('/tables/delete', {
      method: 'POST',
    });
  }

  async dropTables(): Promise<void> {
    await this.request('/tables/drop', {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();
