import { Given, Then, When } from '@cucumber/cucumber';
import {
  CreateEmployeeDto,
  Employee,
  EmployeeDto,
  PaginatedList,
  PaginatedListParameters,
  SkilledEmployee,
  UpdateEmployeeDto,
} from '@skills-matrix/types';
import { expect } from 'chai';
import { EmployeesService } from '../employees/employees.service';
import { getNestApp } from './setup.cucumber';

let employeesCount: number;
let createEmployee: CreateEmployeeDto;
let updateEmployee: UpdateEmployeeDto;
let employee: EmployeeDto | undefined;
let employeesPage: PaginatedList<Employee>;
let skilledEmployees: SkilledEmployee[];

const initializeUpdateEmployee = () => {
  if (!updateEmployee) {
    updateEmployee = {
      Id: employee!.Id,
      Name: employee!.Name,
      Surname: employee!.Surname,
      SkillIds: employee!.Skills.map((skill) => skill.Id),
    };
  }
};

Given('a new employee with Name {string} and Surname {string}', (name: string, surname: string) => {
  createEmployee = {
    Name: name,
    Surname: surname,
    SkillIds: [],
  };
});

Given('an association between the new employee and the skill with Id {int}', (skillId: number) => {
  createEmployee.SkillIds.push(skillId);
});

When('creating the new employee', async () => {
  const app = getNestApp();
  const employeesService = app.get(EmployeesService);
  employee = await employeesService.create(createEmployee);
});

When('deleting the employee with Id {int}', async (employeeId: number) => {
  const app = getNestApp();
  const employeesService = app.get(EmployeesService);
  await employeesService.delete(employeeId);
});

const fetchManyEmployees = async (params: PaginatedListParameters = {}) => {
  const app = getNestApp();
  const employeesService = app.get(EmployeesService);
  employeesPage = await employeesService.findAll(params);
};

When('fetching many employees', () => fetchManyEmployees());
When('fetching many employees matching the text {string}', (keywords: string) =>
  fetchManyEmployees({ keywords }),
);
When('fetching many employees at page {int}', (page: number) =>
  fetchManyEmployees({ page: String(page) }),
);
When('fetching many employees with page size {int}', (pageSize: number) =>
  fetchManyEmployees({ pageSize: String(pageSize) }),
);

const countEmployees = async (keywords?: string) => {
  const app = getNestApp();
  const employeesService = app.get(EmployeesService);
  employeesCount = await employeesService.count(keywords);
};

When('fetching the employees count', () => countEmployees());
When('fetching the employees count matching the text {string}', countEmployees);

const fetchFirstEmployee = async (employeeId: number) => {
  const app = getNestApp();
  const employeesService = app.get(EmployeesService);
  employee = await employeesService.findOne(employeeId);
};

Given('the employee with Id {int}', fetchFirstEmployee);
When('fetching the employee with Id {int}', fetchFirstEmployee);

When('fetching the most skilled employees', async () => {
  const app = getNestApp();
  const employeesService = app.get(EmployeesService);
  skilledEmployees = await employeesService.getMostSkilled();
});

When('setting the employee Name to {string}', (name: string) => {
  initializeUpdateEmployee();
  updateEmployee.Name = name;
});

When('setting the employee Surname to {string}', (surname: string) => {
  initializeUpdateEmployee();
  updateEmployee.Surname = surname;
});

When('clearing all the employee skills', () => {
  initializeUpdateEmployee();
  updateEmployee.SkillIds = [];
});

When(
  'adding an association between the employee and the skill with Id {int}',
  (skillId: number) => {
    initializeUpdateEmployee();
    if (!updateEmployee.SkillIds.includes(skillId)) {
      updateEmployee.SkillIds.push(skillId);
    }
  },
);

When('updating the employee', async () => {
  const app = getNestApp();
  const employeesService = app.get(EmployeesService);
  employee = await employeesService.update(updateEmployee);
});

Then('the employees total is {int}', (expectedTotal: number) => {
  expect(employeesPage.TotalItems).to.equal(expectedTotal);
});

Then('the current employees page is {int}', (expectedPage: number) => {
  expect(employeesPage.CurrentPage).to.equal(expectedPage);
});

Then('the current employees page contains {int} items', (expectedItems: number) => {
  expect(employeesPage.Items.length).to.equal(expectedItems);
});

Then('the employees count is {int}', (expectedCount: number) => {
  expect(employeesCount).to.equal(expectedCount);
});

Then("the fetched employee doesn't exist", () => {
  expect(employee).to.be.undefined;
});

const expectEmployeeName = (expectedName: string) => {
  expect(employee?.Name).to.equal(expectedName);
};

Then('the created employee has Name {string}', expectEmployeeName);
Then('the fetched employee has Name {string}', expectEmployeeName);
Then('the updated employee has Name {string}', expectEmployeeName);

const expectEmployeeSurname = (expectedSurname: string) => {
  expect(employee?.Surname).to.equal(expectedSurname);
};

Then('the created employee has Surname {string}', expectEmployeeSurname);
Then('the fetched employee has Surname {string}', expectEmployeeSurname);
Then('the updated employee has Surname {string}', expectEmployeeSurname);

const expectSkillsCount = (expectedSkillsCount: number) => {
  expect(employee?.Skills.length).to.equal(expectedSkillsCount);
};

Then('the created employee has {int} skill\\(s)', expectSkillsCount);
Then('the fetched employee has {int} skill\\(s)', expectSkillsCount);
Then('the updated employee has {int} skill\\(s)', expectSkillsCount);

Then('the first employee in the page has Name {string}', (expectedName: string) => {
  expect(employeesPage.Items[0].Name).to.equal(expectedName);
});

Then(
  'the skilled employee at position {int} has Id {int} and skills count {int}',
  (position: number, expectedId: number, expectedSkillsCount: number) => {
    const skilledEmployee = skilledEmployees[position - 1];
    expect(skilledEmployee.Id).to.equal(expectedId);
    expect(skilledEmployee.SkillsCount).to.equal(expectedSkillsCount);
  },
);

Then('{int} skilled employees are returned', (expectedCount: number) => {
  expect(skilledEmployees.length).to.equal(expectedCount);
});
