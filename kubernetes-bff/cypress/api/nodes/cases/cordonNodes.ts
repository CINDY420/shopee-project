import { ITestCasesType } from 'cypress/api/caseTypes'

const expectedCordonNodesType = {
  success: 'array',
  fail: 'array'
}

const { nodes } = Cypress.env('cluster')

export const cordonNodesCase: ITestCasesType = {
  method: 'PUT',
  expectedResponseType: expectedCordonNodesType,
  p1: [
    {
      description: 'should cordon serval nodes',
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
