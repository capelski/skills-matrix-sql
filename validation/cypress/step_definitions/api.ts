type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const apiUrl = 'http://localhost:3000/api';

/**
 * Sends a request to the web API, yielding the error message if the request errors out
 */
export const sendRequest = (method: HttpMethod, url: string): Cypress.Chainable<string> => {
  return cy
    .request({ method, url: `${apiUrl}${url}`, failOnStatusCode: false, log: false })
    .then((response) =>
      cy.wrap<string>(response.status >= 400 ? response.body?.message : undefined, { log: false }),
    );
};

let interceptsCount = 0;

/**
 * Spies on the web API requests sent by the frontend from now on, returning the alias to wait for
 * them. Using a new alias for each action prevents waiting for previous requests (e.g. the frontend
 * sends the requests twice on page load in development mode)
 */
export const interceptApi = (method: HttpMethod, pathname: string | RegExp) => {
  const alias = `api${++interceptsCount}`;
  cy.intercept({ method, pathname }, (request) => {
    // Prevent cached (i.e. empty) 304 responses
    delete request.headers['if-none-match'];
    delete request.headers['if-modified-since'];
  }).as(alias);
  return alias;
};

/**
 * Waits for the next web API request with the given alias, failing the test if it errors out
 */
export const waitForApi = <T>(alias: string): Cypress.Chainable<T> => {
  return cy.wait(`@${alias}`, { log: false }).then(({ response }) => {
    if (response!.statusCode >= 400) {
      throw new Error(response!.body?.message || `${alias} failed (${response!.statusCode})`);
    }
    // Wrapping the body so that undefined values (e.g. missing entities) are yielded as well
    return cy.wrap(response!.body === '' ? undefined : response!.body, { log: false });
  }) as Cypress.Chainable<T>;
};
