import { Given, Then, When } from '@cucumber/cucumber';
import {
  CreateSkillDto,
  PaginatedList,
  PaginatedListParameters,
  Skill,
  SkillDto,
  UpdateSkillDto,
} from '@skills-matrix/types';
import { expect } from 'chai';
import { SkillsService } from '../skills/skills.service';
import { getNestApp } from './setup.cucumber';

let skillsCount: number;
let createSkill: CreateSkillDto;
let updateSkill: UpdateSkillDto;
let skill: SkillDto | undefined;
let skillsPage: PaginatedList<Skill>;

const initializeUpdateSkill = () => {
  if (!updateSkill) {
    updateSkill = {
      Description: skill!.Description,
      EmployeeIds: skill!.Employees.map((employee) => employee.Id),
      Id: skill!.Id,
      Name: skill!.Name,
    };
  }
};

Given(
  'a new skill with Name {string} and Description {string}',
  (name: string, description: string) => {
    createSkill = {
      Description: description,
      EmployeeIds: [],
      Name: name,
    };
  },
);

Given(
  'an association between the new skill and the employee with Id {int}',
  (employeeId: number) => {
    createSkill.EmployeeIds.push(employeeId);
  },
);

When('creating the new skill', async () => {
  const app = getNestApp();
  const skillsService = app.get(SkillsService);
  skill = await skillsService.create(createSkill);
});

When('deleting the skill with Id {int}', async (skillId: number) => {
  const app = getNestApp();
  const skillsService = app.get(SkillsService);
  await skillsService.delete(skillId);
});

const fetchManySkills = async (params: PaginatedListParameters = {}) => {
  const app = getNestApp();
  const skillsService = app.get(SkillsService);
  skillsPage = await skillsService.findAll(params);
};

When('fetching many skills', () => fetchManySkills());
When('fetching many skills matching the text {string}', (keywords: string) =>
  fetchManySkills({ keywords }),
);
When('fetching many skills at page {int}', (page: number) =>
  fetchManySkills({ page: String(page) }),
);
When('fetching many skills with page size {int}', (pageSize: number) =>
  fetchManySkills({ pageSize: String(pageSize) }),
);

const countSkills = async (keywords?: string) => {
  const app = getNestApp();
  const skillsService = app.get(SkillsService);
  skillsCount = await skillsService.count(keywords);
};

When('fetching the skills count', () => countSkills());
When('fetching the skills count matching the text {string}', countSkills);

const fetchFirstSkill = async (skillId: number) => {
  const app = getNestApp();
  const skillsService = app.get(SkillsService);
  skill = await skillsService.findOne(skillId);
};

Given('the skill with Id {int}', fetchFirstSkill);
When('fetching the skill with Id {int}', fetchFirstSkill);

When('setting the skill Name to {string}', (name: string) => {
  initializeUpdateSkill();
  updateSkill.Name = name;
});

When('setting the skill Description to {string}', (description: string) => {
  initializeUpdateSkill();
  updateSkill.Description = description;
});

When('clearing all the skill employees', () => {
  initializeUpdateSkill();
  updateSkill.EmployeeIds = [];
});

When(
  'adding an association between the skill and the employee with Id {int}',
  (employeeId: number) => {
    initializeUpdateSkill();
    if (!updateSkill.EmployeeIds.includes(employeeId)) {
      updateSkill.EmployeeIds.push(employeeId);
    }
  },
);

When('updating the skill', async () => {
  const app = getNestApp();
  const skillsService = app.get(SkillsService);
  skill = await skillsService.update(updateSkill);
});

Then('the skills total is {int}', (expectedTotal: number) => {
  expect(skillsPage.TotalItems).to.equal(expectedTotal);
});

Then('the current skills page is {int}', (expectedPage: number) => {
  expect(skillsPage.CurrentPage).to.equal(expectedPage);
});

Then('the current skills page contains {int} items', (expectedItems: number) => {
  expect(skillsPage.Items.length).to.equal(expectedItems);
});

Then('the skills count is {int}', (expectedCount: number) => {
  expect(skillsCount).to.equal(expectedCount);
});

Then("the fetched skill doesn't exist", () => {
  expect(skill).to.be.undefined;
});

const expectSkillName = (expectedName: string) => {
  expect(skill?.Name).to.equal(expectedName);
};

Then('the created skill has Name {string}', expectSkillName);
Then('the fetched skill has Name {string}', expectSkillName);
Then('the updated skill has Name {string}', expectSkillName);

const expectSkillDescription = (expectedDescription: string) => {
  expect(skill?.Description).to.equal(expectedDescription);
};

Then('the created skill has Description {string}', expectSkillDescription);
Then('the fetched skill has Description {string}', expectSkillDescription);
Then('the updated skill has Description {string}', expectSkillDescription);

const expectEmployeesCount = (expectedEmployeesCount: number) => {
  expect(skill?.Employees.length).to.equal(expectedEmployeesCount);
};

Then('the created skill has {int} employee\\(s)', expectEmployeesCount);
Then('the fetched skill has {int} employee\\(s)', expectEmployeesCount);
Then('the updated skill has {int} employee\\(s)', expectEmployeesCount);

Then('the first skill in the page has Name {string}', (expectedName: string) => {
  expect(skillsPage.Items[0].Name).to.equal(expectedName);
});
