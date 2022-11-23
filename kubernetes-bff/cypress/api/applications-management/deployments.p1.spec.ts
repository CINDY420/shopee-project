import { getDeploymentList } from './cases/getDeploymentList'
import { runRequestP1Cases } from 'cypress/api/lib/runCasesLib/runLevelCases'
import * as Mustache from 'mustache'

const groupName = Cypress.env('group')
const projectName = Cypress.env('project')
const appName = Cypress.env('applications')

const getDeploymentListUrl = `/groups/${groupName}/projects/${projectName}/apps/${appName}/deploys`

const releaseDeploymentName = 'release-deployment'
const deploymentCommon = {
  group: Cypress.env('group').split(' ').join('-'),
  project: Cypress.env('project'),
  application: Cypress.env('application'),
  namespace: `plat-${Cypress.env('project')}`
}

describe('Application deployment: p1 cases', () => {
  // Set up
  before(() => {
    cy.setUpApplication()

    cy.fixture('templates/deployment.yaml').then((template) => {
      const deployment = Mustache.render(template, {
        ...deploymentCommon,
        name: releaseDeploymentName,
        containerImage: 'harbor.test.shopeemobile.com/shopee/gxm-demo-test-sg:latest',
        containerName: 'bffautotest',
        containerPort: '80'
      })

      cy.task('createDeployment', deployment)
    })
  })

  after(() => {
    cy.task('deleteDeployment', {
      name: releaseDeploymentName,
      namespace: deploymentCommon.namespace
    })
  })

  // Test deployment list
  runRequestP1Cases({ url: getDeploymentListUrl, cases: getDeploymentList })
})
