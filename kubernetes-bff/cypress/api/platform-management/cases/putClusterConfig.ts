import { ITestCasesType } from 'cypress/api/caseTypes'

const group = Cypress.env('group')
const { cid, environment } = Cypress.env('cluster')

export const putClusterCases: ITestCasesType = {
  method: 'PUT',
  p1: [
    {
      description: 'should put a cluster config',
      expectedStatusCode: 200,
      payload: {
        cids: [cid],
        environments: [environment],
        groups: [group]
      }
    }
  ],
  p2: [],
  p3: []
}
