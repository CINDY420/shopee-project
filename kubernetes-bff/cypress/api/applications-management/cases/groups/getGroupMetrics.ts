import { ITestCasesType } from 'cypress/api/caseTypes'

const groupName = Cypress.env('group')

export const getGroupMetricsCases: ITestCasesType = {
  method: 'GET',
  p1: [
    {
      url: `/groups/${groupName}/metrics`,
      description: 'should get a group metrics',
      params: {
        env: 'DEV',
        cluster: 'dev'
      },
      expectedStatusCode: 200
    }
  ]
}
