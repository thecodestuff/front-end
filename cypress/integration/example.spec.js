import { networkErrorMessages } from '../../common/constants/messages';

const SubmitButtonID = 'Submit Step Button';

const firstStepName = 'Professional Details';

describe('example', () => {
  beforeEach(() => {
    cy.server();
    cy.login();
    cy.visitAndWaitFor('/profile/update');
    cy.get('h1').should('have.text', 'Update Profile');
    cy.get('h3').should('have.text', firstStepName);
  });

  it('should render an uncaught server error', () => {
    const ErrorAPICall = 'PATCH_USER_FAIL_UNCAUGHT';

    cy.route({
      method: 'PATCH',
      url: 'auth/profile/',
      status: 500,
      response: {},
    }).as(ErrorAPICall);

    cy.findByTestId(SubmitButtonID).click();
    cy.wait(`@${ErrorAPICall}`);

    cy.queryByRole('alert').should('have.text', networkErrorMessages.serverDown);
  });

  it('should render a caught server error', () => {
    const ErrorAPICall = 'PATCH_USER_FAIL_CAUGHT';

    const error = 'You dun goofed.';

    cy.route({
      method: 'PATCH',
      url: 'auth/profile/',
      status: 500,
      response: {
        data: {
          error,
        },
      },
    }).as(ErrorAPICall);

    cy.findByTestId(SubmitButtonID).click();
    cy.wait(`@${ErrorAPICall}`);

    cy.queryByRole('alert').should('have.text', error);
  });
});
