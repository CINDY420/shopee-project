import { ITestCasesType } from 'cypress/api/caseTypes'

const groupName = Cypress.env('group')
const projectName = Cypress.env('project')

export const getGroupProjectsQuotas: ITestCasesType = {
  method: 'GET',
  p1: [
    {
      url: `/groups/${groupName}/projects/${projectName}/resourceQuotas`,
      description: 'should get a group quotas',
      expectedStatusCode: 200
    }
  ]
}
