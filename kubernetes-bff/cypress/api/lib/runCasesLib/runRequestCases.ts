import { ITestCasesType } from 'cypress/api/caseTypes'

interface IParams {
  [key: string]: any
}

interface ITransformParamsToStringProps {
  params: IParams | undefined
}

export enum CaseLevel {
  P1,
  P2,
  P3,
  P4
}

interface IRunRequestProps {
  url?: string
  requestCases: ITestCasesType
  level: CaseLevel
}

type transformParamsToStringFn = (props: ITransformParamsToStringProps) => void
type runRequestCasesFn = (props: IRunRequestProps) => void

// transform params object to url string
const transformParamsToString: transformParamsToStringFn = (params) => {
  const queryArray = []

  if (params) {
    Object.entries(params)
      .filter(([key, value]) => typeof value !== 'undefined' && value !== null)
      .forEach(([key, value]) => {
        queryArray.push(`${key}=${value}`)
      })
  }

  return queryArray.length === 0 ? '' : `?${queryArray.join('&')}`
}

const levelKeys = {
  [CaseLevel.P1]: 'p1',
  [CaseLevel.P2]: 'p2',
  [CaseLevel.P3]: 'p3',
  [CaseLevel.P4]: 'p4'
}

// Run cases command
export const runRequestCases: runRequestCasesFn = ({ url: casesUrl, requestCases, level }) => {
  const { method, expectedResponseType, before, after } = requestCases
  const levelKey = levelKeys[level]
  const cases = requestCases[levelKey]

  cases.forEach((currentCase) => {
    const {
      description,
      headers,
      params,
      payload,
      expectedStatusCode,
      shouldValidateResponseType,
      url: caseUrl
    } = currentCase
    const url = caseUrl || casesUrl
    const transformedUrl = url + transformParamsToString(params)

    it(description, () => {
      if (typeof before === 'function') {
        before(cy)
      }

      cy.request({
        url: transformedUrl,
        headers,
        method,
        body: payload,
        failOnStatusCode: false
      }).then((response) => {
        // Validate response
        cy.validateResponse({
          response,
          expectedStatus: expectedStatusCode,
          expectedTypes: expectedResponseType,
          shouldValidateResponseType
        })
      })

      if (typeof after === 'function') {
        after(cy)
      }
    })
  })
}
