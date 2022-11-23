import { ITestCasesType } from 'cypress/api/caseTypes'

const expectedUncordonNodesType = {
  success: 'array',
  fail: 'array'
}

const { nodes } = Cypress.env('cluster')

export const uncordonNodesCase: ITestCasesType = {
  method: 'PUT',
  expectedResponseType: expectedUncordonNodesType,
  p1: [
    {
      description: 'should uncordon serval nodes',
      payload: {
        nodes: [nodes[1]]
      },
      expectedStatusCode: 200,
      shouldValidateResponseType: true
    }
  ],
  p2: [],
  p3: []
}
