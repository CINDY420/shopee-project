import { ITestCasesType } from 'cypress/api/caseTypes'

const groupName = Cypress.env('group')
const projectName = Cypress.env('project')
const applicationName = Cypress.env('application')

export const getApplicationDeployFilter: ITestCasesType = {
  method: 'GET',
  p1: [
    {
      url: `/groups/${groupName}/projects/${projectName}/apps/${applicationName}/deploysFilterInfo`,
      description: 'should get application deploy filters',
      expectedStatusCode: 200
    }
  ]
}
