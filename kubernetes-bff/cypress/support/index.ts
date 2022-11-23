import './commands'

// Globally setting
describe('Set cookie!', () => {
  it('should set cookie successfully', () => {
    // Set cookie
    cy.setRequestCookie()
    cy.request('GET', '/').then((response) => {
      expect(response.status).to.equal(200)
    })

    // Set up cluster for global testing
    // cy.fixture('clusters/kin5-raw.yaml').then((kubeconfig) => {
    //   const { name: clusterName } = Cypress.env('cluster')
    //   cy.setUpCluster({ clusterName, kubeconfig })
    // })
  })
})

Cypress.Cookies.defaults({
  preserve: 'skesession'
})
