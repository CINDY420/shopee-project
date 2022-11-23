import { ITestCasesType } from 'cypress/api/caseTypes'

const groupName = Cypress.env('group')
const projectName = Cypress.env('project')
const apiServer = Cypress.env('apiServer')
const baseUrl = `/groups/${groupName}/projects/${projectName}`

const createApplicationName = `cypressauto${Math.random().toString(36).substring(7)}`
const createApplicationPayload = {
  appName: createApplicationName,
  strategyType: { type: 'RollingUpdate', value: { maxSurge: '25%', maxUnavailable: '0' } },
  healthCheck: {
    readinessProbe: {
      type: 'HTTP',
      typeValue: 'cypressauto',
      initialDelaySeconds: 15,
      periodSeconds: 5,
      successThreshold: 1,
      timeoutSeconds: 5
    },
    livenessProbe: {}
  },
  pipeline: ''
}

export const createApplicationCases: ITestCasesType = {
  method: 'POST',
  p1: [
    {
      url: `${baseUrl}/apps`,
      description: 'should create an application',
      payload: createApplicationPayload,
      expectedStatusCode: 201
    }
  ],
  after: function (cy) {
    cy.task('deleteApplication', {
      projectName,
      name: createApplicationName,
      apiServer
    })
  }
}
