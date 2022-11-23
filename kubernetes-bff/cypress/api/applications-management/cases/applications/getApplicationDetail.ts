import { ITestCasesType } from 'cypress/api/caseTypes'

const groupName = Cypress.env('group')
const projectName = Cypress.env('project')
const applicationName = Cypress.env('application')

export const getApplicationCases: ITestCasesType = {
  method: 'GET',
  p1: [
    {
      url: `/groups/${groupName}/projects/${projectName}/apps/${applicationName}`,
      description: 'should get application detail',
      expectedStatusCode: 200
    }
  ]
}
