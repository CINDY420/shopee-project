export interface ISetRequestCookieProps {
  sessionKey: string
  sessionValue: string
}

export interface IValidateResponseProps {
  response: any
  expectedStatus: number
  expectedTypes: any
  shouldValidateResponseType: boolean
}
