import { ITestCasesType } from 'cypress/api/caseTypes'

const expectedDrainNodesType = {
  success: 'array',
  fail: 'array'
}

const { nodes } = Cypress.env('cluster')

export const drainNodesCase: ITestCasesType = {
  method: 'PUT',
  expectedResponseType: expectedDrainNodesType,
  p1: [
    {
      description: 'should drain serval nodes',
      payload: {
        nodes: [nodes[1], nodes[2]]
      },
      expectedStatusCode: 200,
      shouldValidateResponseType: true
    }
  ],
  p2: [],
  p3: []
}
