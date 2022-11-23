import { ITestCasesType } from 'cypress/api/caseTypes'
import { expectedNodeType } from './types'

export const getNodeDetailCase: ITestCasesType = {
  method: 'GET',
  expectedResponseType: expectedNodeType,
  p1: [
    {
      description: 'should get a node detail',
      expectedStatusCode: 200,
      shouldValidateResponseType: true
    }
  ],
  p2: [],
  p3: []
}
