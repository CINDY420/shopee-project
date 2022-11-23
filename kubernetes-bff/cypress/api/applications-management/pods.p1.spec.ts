import { getPodListCase } from './cases/pods'

import { runRequestP1Cases } from 'cypress/api/lib/runCasesLib/runLevelCases'

const group = Cypress.env('group')
const project = Cypress.env('project')
const application = Cypress.env('application')
const deployment = Cypress.env('deployment')

const getPodListUrl = `/groups/${group}/projects/${project}/apps/${application}/deploys/${deployment}/pods`

describe('Cluster pods: p1 cases', () => {
  // Test pods list
  runRequestP1Cases({ url: getPodListUrl, cases: getPodListCase })
})
