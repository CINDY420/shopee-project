import { ITestCasesType } from 'cypress/api/caseTypes'

const groupName = Cypress.env('group')

export const getGroupDetailCases: ITestCasesType = {
  method: 'GET',
  p1: [
    {
      url: `/groups/${groupName}`,
      description: 'should get a group detail',
      expectedStatusCode: 200
    }
  ]
}
