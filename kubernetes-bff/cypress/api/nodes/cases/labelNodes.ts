import { ITestCasesType } from 'cypress/api/caseTypes'

const expectedLabelNodesType = {
  success: 'array',
  fail: 'array'
}

const { nodes } = Cypress.env('cluster')
const nodeName = nodes[1]

export const labelNodesCase: ITestCasesType = {
  method: 'PUT',
  expectedResponseType: expectedLabelNodesType,
  p1: [
    {
      description: 'should label serval nodes',
      payload: {
        nodes: [nodeName],
        labels: {
          cypress1: 'test1',
          cypress2: 'test2',
          cypress3: 'test3',
          cypress4: 'test4'
        }
      },
      expectedStatusCode: 200,
      shouldValidateResponseType: true
    }
  ],
  p2: [
    {
      description: 'should not label any node',
      payload: {
        nodes: ['string'],
        labels: {
          cypress1: 'test1',
          cypress2: 'test2'
        }
      },
      expectedStatusCode: 200
    },
    {
      description: 'should replace label by labeling node',
      payload: {
        nodes: [nodeName],
        labels: {
          cypress1: 'test1-replace',
          cypress2: 'test2s'
        }
      },
      expectedStatusCode: 200
    }
  ],
  p3: []
}
