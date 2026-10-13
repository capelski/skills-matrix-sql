import { Before, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { interceptApi, waitForApi } from './api';
import { exactText, fillIn, removeAll, waitForPage } from './ui';

type NewEmployee = { Name: string; Surname?: string; SkillNames: string[] };

let newEmployee: NewEmployee;
let isEditing: boolean;
let creationErrorMessage: string;

Before(() => {
  newEmployee = undefined!;
  isEditing = false;
  creationErrorMessage = undefined!;
});

const employeesPath = '/api/employees';
const employeePath = /^\/api\/employees\/\d+$/;

const employeesListItems = () => cy.get('.employees .list-group-item a');

const mostSkilledEmployeesItems = () =>
  cy.contains('h2', 'Most skilled employees').closest('.col-sm-6').find('.list-group-item a');

const employeeSkillsItems = () => cy.get('.skills-section > .list-group > li > a');

const waitForEmployeesPage = (alias: string) => {
  waitForApi(alias);
  waitForPage();
};

const expectEmployeesTotal = (expectedTotal: number) => {
  if (expectedTotal) {
    cy.get('.employees .list-summary').should('contain.text', `of ${expectedTotal} employee`);
  } else {
    // The total is only displayed when there are employees
    cy.get('.employees .list-summary').should('not.exist');
  }
};

const visitEmployeesList = () => {
  const alias = interceptApi('GET', employeesPath);
  cy.visit('/employees');
  waitForEmployeesPage(alias);
};

const updateEmployeesList = (action: () => void) => {
  const alias = interceptApi('GET', employeesPath);
  action();
  waitForEmployeesPage(alias);
};

const searchEmployees = (keywords: string) => {
  visitEmployeesList();
  updateEmployeesList(() => {
    fillIn('input[placeholder="Search employees..."]', keywords);
    cy.contains('button', 'Search').click();
  });
};

const loadEmployee = (action: () => void) => {
  const alias = interceptApi('GET', employeePath);
  action();
  waitForApi(alias);
  waitForPage();
};

const visitEmployee = (employeeId: number) => {
  loadEmployee(() => cy.visit(`/employees/${employeeId}`));
};

const editEmployee = () => {
  if (!isEditing) {
    cy.contains('button', 'Edit').click();
    isEditing = true;
  }
};

const addEmployeeSkill = (skillName: string) => {
  fillIn('input[placeholder="Search skills to add..."]', skillName);
  cy.contains('.add-skill', exactText(skillName)).click();
};

const newEmployeeWith = (name: string, surname?: string) => {
  newEmployee = {
    Name: name,
    Surname: surname,
    SkillNames: [],
  };
};

Given('a new employee with Name {string}', (name: string) => newEmployeeWith(name));
Given('a new employee with Name {string} and Surname {string}', newEmployeeWith);

Given('an association between the new employee and the skill {string}', (skillName: string) => {
  newEmployee.SkillNames.push(skillName);
});

When('creating the new employee', () => {
  cy.visit('/employees/new');
  waitForPage();
  fillIn('#employee-name', newEmployee.Name);
  fillIn('#employee-surname', newEmployee.Surname || '');
  newEmployee.SkillNames.forEach(addEmployeeSkill);
  const createAlias = interceptApi('POST', employeesPath);
  const fetchAlias = interceptApi('GET', employeePath);
  cy.contains('button', 'Save').click();
  cy.wait(`@${createAlias}`).then(({ response }) => {
    if (response!.statusCode >= 400) {
      creationErrorMessage = response!.body?.message;
    } else {
      // The frontend navigates to the created employee page
      waitForApi(fetchAlias);
      waitForPage();
    }
  });
});

When('deleting the employee with Id {int}', (employeeId: number) => {
  visitEmployee(employeeId);
  const alias = interceptApi('DELETE', employeePath);
  cy.contains('button', 'Delete').click();
  cy.get('.modal-content').contains('button', 'Delete').click();
  waitForApi(alias);
});

When('fetching many employees', visitEmployeesList);
When('fetching many employees matching the text {string}', searchEmployees);

When('fetching many employees at page {int}', (page: number) => {
  visitEmployeesList();
  updateEmployeesList(() => {
    cy.contains('.pagination button', exactText(String(page + 1))).click();
  });
});

When('fetching many employees with page size {int}', (pageSize: number) => {
  visitEmployeesList();
  updateEmployeesList(() => {
    cy.get('#pageSize').select(String(pageSize));
  });
});

When('fetching the employees count', visitEmployeesList);
When('fetching the employees count matching the text {string}', searchEmployees);

Given('the employee with Id {int}', visitEmployee);
When('fetching the employee with Id {int}', visitEmployee);

When('fetching the most skilled employees', () => {
  const alias = interceptApi('GET', '/api/employees/getMostSkilled');
  cy.visit('/');
  waitForApi(alias);
  waitForPage();
});

When('setting the employee Name to {string}', (name: string) => {
  editEmployee();
  fillIn('#employee-name', name);
});

When('setting the employee Surname to {string}', (surname: string) => {
  editEmployee();
  fillIn('#employee-surname', surname);
});

When('clearing all the employee skills', () => {
  editEmployee();
  removeAll('.remove-skill');
});

When('adding an association between the employee and the skill {string}', (skillName: string) => {
  editEmployee();
  addEmployeeSkill(skillName);
});

When('updating the employee', () => {
  const alias = interceptApi('PUT', employeesPath);
  cy.contains('button', 'Save').click();
  waitForApi(alias);
  // Reloading the page so the employee data is fetched again
  loadEmployee(() => cy.reload());
});

Then('the employees total is {int}', expectEmployeesTotal);

Then('the current employees page is {int}', (expectedPage: number) => {
  cy.get('.employees').then(($employees) => {
    // The pagination is only displayed when there are multiple pages
    if ($employees.find('.pagination').length) {
      cy.get('.pagination li.active').should('have.text', String(expectedPage + 1));
    } else {
      expect(expectedPage).to.equal(0);
    }
  });
});

Then('the current employees page contains {int} items', (expectedItems: number) => {
  employeesListItems().should('have.length', expectedItems);
});

Then('the employees count is {int}', expectEmployeesTotal);

Then("the fetched employee doesn't exist", () => {
  cy.contains('.alert', 'Employee not found').should('be.visible');
});

Then('the employee creation errors out with message {string}', (expectedMessage: string) => {
  cy.then(() => {
    if (!creationErrorMessage) {
      throw new Error('The employee was created without errors');
    }
  });
  cy.get('.alert').should('contain.text', expectedMessage);
});

const expectEmployeeLoaded = () => {
  cy.then(() => {
    if (creationErrorMessage) {
      throw new Error(creationErrorMessage);
    }
  });
  cy.location('pathname').should('match', /^\/employees\/\d+$/);
};

const expectEmployeeName = (expectedName: string) => {
  expectEmployeeLoaded();
  cy.get('#employee-name').should('have.value', expectedName);
};

Then('the created employee has Name {string}', expectEmployeeName);
Then('the fetched employee has Name {string}', expectEmployeeName);
Then('the updated employee has Name {string}', expectEmployeeName);

const expectEmployeeSurname = (expectedSurname: string) => {
  expectEmployeeLoaded();
  cy.get('#employee-surname').should('have.value', expectedSurname);
};

Then('the created employee has Surname {string}', expectEmployeeSurname);
Then('the fetched employee has Surname {string}', expectEmployeeSurname);
Then('the updated employee has Surname {string}', expectEmployeeSurname);

Then('the created employee has no Surname', () => expectEmployeeSurname(''));

const expectSkillsCount = (expectedSkillsCount: number) => {
  expectEmployeeLoaded();
  employeeSkillsItems().should('have.length', expectedSkillsCount);
};

Then('the created employee has {int} skill\\(s)', expectSkillsCount);
Then('the fetched employee has {int} skill\\(s)', expectSkillsCount);
Then('the updated employee has {int} skill\\(s)', expectSkillsCount);

Then('the first employee in the page has Name {string}', (expectedName: string) => {
  employeesListItems().first().should('have.text', expectedName);
});

Then(
  'the skilled employee at position {int} has Id {int} and skills count {int}',
  (position: number, expectedId: number, expectedSkillsCount: number) => {
    mostSkilledEmployeesItems()
      .eq(position - 1)
      .should('have.attr', 'href', `/employees/${expectedId}`)
      .find('.badge')
      .should('have.text', String(expectedSkillsCount));
  },
);

Then('{int} skilled employees are returned', (expectedCount: number) => {
  mostSkilledEmployeesItems().should('have.length', expectedCount);
});
