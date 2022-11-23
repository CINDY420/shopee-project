import { ITestCasesType } from 'cypress/api/caseTypes'

const expectedTaintNodesType = {
  success: 'array',
  fail: 'array'
}

const { nodes } = Cypress.env('cluster')

export const taintNodesCase: ITestCasesType = {
  method: 'PUT',
  expectedResponseType: expectedTaintNodesType,
  p1: [
    {
      description: 'should taint serval nodes',
      payload: {
        nodes: [nodes[3]],
        action: 'update',
        taint: {
          key: 'cypress',
          value: 'test',
          effect: 'NoSchedule'
        }
      },
      expectedStatusCode: 200,
      shouldValidateResponseType: true
    }
  ],
  p2: [
    {
      description: 'should update taint',
      payload: {
        nodes: [nodes[1]],
        action: 'update',
        taint: {
          key: 'cypress',
          value: 'test',
          effect: 'NoSchedule'
        }
      },
      expectedStatusCode: 200
    },
    {
      description: 'should remove taint',
      payload: {
        nodes: [nodes[1]],
        action: 'remove',
        taint: {
          key: 'cypress'
        }
      },
      expectedStatusCode: 200
    }
  ],
  p3: []
}
