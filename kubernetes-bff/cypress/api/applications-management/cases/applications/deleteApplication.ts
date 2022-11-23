import { ITestCasesType } from 'cypress/api/caseTypes'

const groupName = Cypress.env('group')
const projectName = Cypress.env('project')
const createApplicationName = `cypressauto${Math.random().toString(36).substring(7)}`
const apiServer = Cypress.env('apiServer')

export const deleteApplicationCases: ITestCasesType = {
  method: 'DELETE',
  before: function (cy) {
    cy.task('createApplication', {
      groupName,
      projectName,
      name: createApplicationName,
      apiServer
    })
  },
  p1: [
    {
      url: `/groups/${groupName}/projects/${projectName}/apps/${createApplicationName}`,
      description: 'should delete application',
      expectedStatusCode: 200
    }
  ]
}
