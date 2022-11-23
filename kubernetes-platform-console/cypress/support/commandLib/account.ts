const storageKey = '__session'
const sessionKey = 'skesession'

export type LoginFn = (localStorageFilePath?: string, sessionFilePath?: string) => void

export const login: LoginFn = (
  localStorageFilePath = 'account/localStorage.manager.txt',
  sessionFilePath = 'account/session.manager.txt'
) => {
  // Set localStorage to bypass Google login
  cy.fixture(localStorageFilePath).then(localStorageValue => {
    cy.window().then(window => window.localStorage.setItem(storageKey, localStorageValue))
  })

  // Set cookie to bypass jwt
  cy.fixture(sessionFilePath).then(sessionValue => {
    Cypress.Cookies.debug(true)
    cy.clearCookie(sessionKey)
    cy.setCookie(sessionKey, sessionValue, {
      domain: Cypress.env('apiDomain')
    })
  })
}
