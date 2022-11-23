import { ISetRequestCookieProps, IValidateResponseProps } from './types/commonTypes'

import { deepValidateTypes } from './helpers/validate'
import { setCookie } from './helpers/setCookie'

export type setRequestCookieFn = (user?: ISetRequestCookieProps) => void
export type validateResponseFn = (props: IValidateResponseProps) => void

// Set cookie for user, the user is infra sre by default
export const setRequestCookie: setRequestCookieFn = (user) => {
  if (!user) {
    cy.fixture('cookies.json').then((account) => {
      const user = account.sre
      setCookie(user)
    })
  } else {
    setCookie(user)
  }
}

export const validateResponse: validateResponseFn = (props) => {
  const { response, expectedStatus, expectedTypes, shouldValidateResponseType = false } = props
  const { status, body } = response

  // Test status
  expect(status).to.equal(expectedStatus)
  // Test types
  shouldValidateResponseType && deepValidateTypes({ result: body, expectedResultTypes: expectedTypes })
}
