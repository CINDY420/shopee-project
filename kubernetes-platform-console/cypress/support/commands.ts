import { login, LoginFn } from './commandLib/account'
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/interface-name-prefix
    interface Chainable {
      login: LoginFn
    }
  }
}

// login command
Cypress.Commands.add('login', login)
