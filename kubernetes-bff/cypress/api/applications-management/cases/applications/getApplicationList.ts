import { ITestCasesType } from 'cypress/api/caseTypes'

const groupName = Cypress.env('group')
const projectName = Cypress.env('project')

export const getApplicationListCases: ITestCasesType = {
  method: 'GET',
  p1: [
    {
      url: `/groups/${groupName}/projects/${projectName}/apps`,
      description: 'should get application list',
      expectedStatusCode: 200
    }
  ]
}
