import { ITestCasesType } from 'cypress/api/caseTypes'

const groupName = Cypress.env('group')
const projectName = Cypress.env('project')
const applicationName = Cypress.env('application')

export const getApplicationDeploys: ITestCasesType = {
  method: 'GET',
  p1: [
    {
      url: `/groups/${groupName}/projects/${projectName}/apps/${applicationName}/deploys`,
      description: 'should get application deploys',
      expectedStatusCode: 200
    }
  ]
}
