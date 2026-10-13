import { BeforeAll } from '@badeball/cypress-cucumber-preprocessor';
import { sendRequest } from './api';

const setupOperations = ['drop', 'create', 'delete', 'populate'];

BeforeAll(() => {
  setupOperations.forEach((operation) => {
    sendRequest('POST', `/tables/${operation}`).then((errorMessage) => {
      if (errorMessage) {
        throw new Error(`Setup failure. ${errorMessage}`);
      }
    });
  });
});
