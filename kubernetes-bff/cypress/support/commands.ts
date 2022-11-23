import { setRequestCookie, setRequestCookieFn, validateResponse, validateResponseFn } from './commandLib/common'
import { setupApplication, setUpApplicationFn } from './commandLib/application'
import { setUpCluster, setUpClusterFn } from './commandLib/cluster'

// Declare types here
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      setRequestCookie: setRequestCookieFn
      validateResponse: validateResponseFn
      setUpApplication: setUpApplicationFn
      setUpCluster: setUpClusterFn
    }
  }
}

// Common commands
Cypress.Commands.add('setRequestCookie', setRequestCookie)
Cypress.Commands.add('validateResponse', validateResponse)

// Cluster commands
Cypress.Commands.add('setUpCluster', setUpCluster)

// Application commands
Cypress.Commands.add('setUpApplication', setupApplication)
