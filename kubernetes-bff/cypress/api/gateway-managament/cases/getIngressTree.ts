import { ITestCasesType } from 'cypress/api/caseTypes'

export const getIngressTree: ITestCasesType = {
  method: 'GET',
  expectedResponseType: 'string[]',
  p1: [
    {
      description: 'should get an ingress list',
      expectedStatusCode: 200,
      shouldValidateResponseType: true
    }
  ],
  p2: [],
  p3: []
}
