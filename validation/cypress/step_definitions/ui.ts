/**
 * Matches elements whose whole text is the given text (e.g. "Modula-2" doesn't match "Modula")
 */
export const exactText = (text: string) => {
  return new RegExp(`^\\s*${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`);
};

/**
 * Replaces the value of the given input
 */
export const fillIn = (selector: string, value: string) => {
  cy.get(selector).clear();
  if (value) {
    cy.get(selector).type(value);
  }
};

/**
 * Waits for the page to finish loading, failing the test if an error is displayed
 */
export const waitForPage = () => {
  cy.get('.loader').should('not.exist');
  cy.get('body').then(($body) => {
    // The web API error messages start with "Error executing..."
    const errorAlert = $body.find('.alert-danger:contains("Error")');
    if (errorAlert.length) {
      throw new Error(errorAlert.text());
    }
  });
};

/**
 * Removes all the items of an association list (e.g. the skills of an employee)
 */
export const removeAll = (selector: string) => {
  cy.get('body').then(($body) => {
    for (let i = $body.find(selector).length; i > 0; i--) {
      cy.get(selector).first().click();
    }
  });
  cy.get(selector).should('not.exist');
};
