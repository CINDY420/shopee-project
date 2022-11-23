import { runRequestP1Cases } from 'cypress/api/lib/runCasesLib/runLevelCases'
import * as applications from './cases/applications'

describe('Application: p1 cases', () => {
  // get application list
  runRequestP1Cases({
    cases: applications.getApplicationListCases
  })

  // create application
  runRequestP1Cases({
    cases: applications.createApplicationCases
  })

  // delete application
  runRequestP1Cases({
    cases: applications.deleteApplicationCases
  })

  // get application deploy filters
  runRequestP1Cases({
    cases: applications.getApplicationDeployFilter
  })

  // get application deploys
  runRequestP1Cases({
    cases: applications.getApplicationDeploys
  })
})
