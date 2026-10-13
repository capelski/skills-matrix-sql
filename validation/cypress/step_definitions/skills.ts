import { Before, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { interceptApi, waitForApi } from './api';
import { exactText, fillIn, removeAll, waitForPage } from './ui';

type NewSkill = { Name: string; Description?: string; EmployeeNames: string[] };

let newSkill: NewSkill;
let isEditing: boolean;
let creationErrorMessage: string;

Before(() => {
  newSkill = undefined!;
  isEditing = false;
  creationErrorMessage = undefined!;
});

const skillsPath = '/api/skills';
const skillPath = /^\/api\/skills\/\d+$/;

const skillsListItems = () => cy.get('.skills .list-group-item a');

const rarestSkillsItems = () =>
  cy.contains('h2', 'Rarest skills').closest('.col-sm-6').find('.list-group-item a');

const skillEmployeesItems = () => cy.get('.employees-section > .list-group > li > a');

const waitForSkillsPage = (alias: string) => {
  waitForApi(alias);
  waitForPage();
};

const expectSkillsTotal = (expectedTotal: number) => {
  if (expectedTotal) {
    cy.get('.skills .list-summary').should('contain.text', `of ${expectedTotal} skill`);
  } else {
    // The total is only displayed when there are skills
    cy.get('.skills .list-summary').should('not.exist');
  }
};

const visitSkillsList = () => {
  const alias = interceptApi('GET', skillsPath);
  cy.visit('/skills');
  waitForSkillsPage(alias);
};

const updateSkillsList = (action: () => void) => {
  const alias = interceptApi('GET', skillsPath);
  action();
  waitForSkillsPage(alias);
};

const searchSkills = (keywords: string) => {
  visitSkillsList();
  updateSkillsList(() => {
    fillIn('input[placeholder="Search skills..."]', keywords);
    cy.contains('button', 'Search').click();
  });
};

const loadSkill = (action: () => void) => {
  const alias = interceptApi('GET', skillPath);
  action();
  waitForApi(alias);
  waitForPage();
};

const visitSkill = (skillId: number) => {
  loadSkill(() => cy.visit(`/skills/${skillId}`));
};

const editSkill = () => {
  if (!isEditing) {
    cy.contains('button', 'Edit').click();
    isEditing = true;
  }
};

const addSkillEmployee = (employeeName: string) => {
  fillIn('input[placeholder="Search employees to add..."]', employeeName);
  cy.contains('.add-employee', exactText(employeeName)).click();
};

const newSkillWith = (name: string, description?: string) => {
  newSkill = {
    Name: name,
    Description: description,
    EmployeeNames: [],
  };
};

Given('a new skill with Name {string}', (name: string) => newSkillWith(name));
Given('a new skill with Name {string} and Description {string}', newSkillWith);

Given('an association between the new skill and the employee {string}', (employeeName: string) => {
  newSkill.EmployeeNames.push(employeeName);
});

When('creating the new skill', () => {
  cy.visit('/skills/new');
  waitForPage();
  fillIn('#skill-name', newSkill.Name);
  fillIn('#skill-description', newSkill.Description || '');
  newSkill.EmployeeNames.forEach(addSkillEmployee);
  const createAlias = interceptApi('POST', skillsPath);
  const fetchAlias = interceptApi('GET', skillPath);
  cy.contains('button', 'Save').click();
  cy.wait(`@${createAlias}`).then(({ response }) => {
    if (response!.statusCode >= 400) {
      creationErrorMessage = response!.body?.message;
    } else {
      // The frontend navigates to the created skill page
      waitForApi(fetchAlias);
      waitForPage();
    }
  });
});

When('deleting the skill with Id {int}', (skillId: number) => {
  visitSkill(skillId);
  const alias = interceptApi('DELETE', skillPath);
  cy.contains('button', 'Delete').click();
  cy.get('.modal-content').contains('button', 'Delete').click();
  waitForApi(alias);
});

When('fetching many skills', visitSkillsList);
When('fetching many skills matching the text {string}', searchSkills);

When('fetching many skills at page {int}', (page: number) => {
  visitSkillsList();
  updateSkillsList(() => {
    cy.contains('.pagination button', exactText(String(page + 1))).click();
  });
});

When('fetching many skills with page size {int}', (pageSize: number) => {
  visitSkillsList();
  updateSkillsList(() => {
    cy.get('#pageSize').select(String(pageSize));
  });
});

When('fetching the skills count', visitSkillsList);
When('fetching the skills count matching the text {string}', searchSkills);

Given('the skill with Id {int}', visitSkill);
When('fetching the skill with Id {int}', visitSkill);

When('fetching the rarest skills', () => {
  const alias = interceptApi('GET', '/api/skills/getRarest');
  cy.visit('/');
  waitForApi(alias);
  waitForPage();
});

When('setting the skill Name to {string}', (name: string) => {
  editSkill();
  fillIn('#skill-name', name);
});

When('setting the skill Description to {string}', (description: string) => {
  editSkill();
  fillIn('#skill-description', description);
});

When('clearing all the skill employees', () => {
  editSkill();
  removeAll('.remove-employee');
});

When(
  'adding an association between the skill and the employee {string}',
  (employeeName: string) => {
    editSkill();
    addSkillEmployee(employeeName);
  },
);

When('updating the skill', () => {
  const alias = interceptApi('PUT', skillsPath);
  cy.contains('button', 'Save').click();
  waitForApi(alias);
  // Reloading the page so the skill data is fetched again
  loadSkill(() => cy.reload());
});

Then('the skills total is {int}', expectSkillsTotal);

Then('the current skills page is {int}', (expectedPage: number) => {
  cy.get('.skills').then(($skills) => {
    // The pagination is only displayed when there are multiple pages
    if ($skills.find('.pagination').length) {
      cy.get('.pagination li.active').should('have.text', String(expectedPage + 1));
    } else {
      expect(expectedPage).to.equal(0);
    }
  });
});

Then('the current skills page contains {int} items', (expectedItems: number) => {
  skillsListItems().should('have.length', expectedItems);
});

Then('the skills count is {int}', expectSkillsTotal);

Then("the fetched skill doesn't exist", () => {
  cy.contains('.alert', 'Skill not found').should('be.visible');
});

Then('the skill creation errors out with message {string}', (expectedMessage: string) => {
  cy.then(() => {
    if (!creationErrorMessage) {
      throw new Error('The skill was created without errors');
    }
  });
  cy.get('.alert').should('contain.text', expectedMessage);
});

const expectSkillLoaded = () => {
  cy.then(() => {
    if (creationErrorMessage) {
      throw new Error(creationErrorMessage);
    }
  });
  cy.location('pathname').should('match', /^\/skills\/\d+$/);
};

const expectSkillName = (expectedName: string) => {
  expectSkillLoaded();
  cy.get('#skill-name').should('have.value', expectedName);
};

Then('the created skill has Name {string}', expectSkillName);
Then('the fetched skill has Name {string}', expectSkillName);
Then('the updated skill has Name {string}', expectSkillName);

const expectSkillDescription = (expectedDescription: string) => {
  expectSkillLoaded();
  cy.get('#skill-description').should('have.value', expectedDescription);
};

Then('the created skill has Description {string}', expectSkillDescription);
Then('the fetched skill has Description {string}', expectSkillDescription);
Then('the updated skill has Description {string}', expectSkillDescription);

Then('the created skill has no Description', () => expectSkillDescription(''));

const expectEmployeesCount = (expectedEmployeesCount: number) => {
  expectSkillLoaded();
  skillEmployeesItems().should('have.length', expectedEmployeesCount);
};

Then('the created skill has {int} employee\\(s)', expectEmployeesCount);
Then('the fetched skill has {int} employee\\(s)', expectEmployeesCount);
Then('the updated skill has {int} employee\\(s)', expectEmployeesCount);

Then('the first skill in the page has Name {string}', (expectedName: string) => {
  skillsListItems().first().should('have.text', expectedName);
});

Then(
  'the rare skill at position {int} has Id {int} and employees count {int}',
  (position: number, expectedId: number, expectedEmployeesCount: number) => {
    rarestSkillsItems()
      .eq(position - 1)
      .should('have.attr', 'href', `/skills/${expectedId}`)
      .find('.badge')
      .should('have.text', String(expectedEmployeesCount));
  },
);

Then('{int} rare skills are returned', (expectedCount: number) => {
  rarestSkillsItems().should('have.length', expectedCount);
});
