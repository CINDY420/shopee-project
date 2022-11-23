import { ISetRequestCookieProps } from '../types/commonTypes'

type setCookieFn = (props: ISetRequestCookieProps) => void

export const setCookie: setCookieFn = (user) => {
  const { sessionKey, sessionValue } = user
  Cypress.Cookies.debug(true)
  cy.clearCookie(sessionKey)
  // Set cookie to bypass jwt
  cy.setCookie(sessionKey, sessionValue)
}
