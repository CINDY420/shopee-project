describe('Test node detail', () => {
  // Set up
  before(() => {
    cy.login()
  })

  it('should display the node detail', () => {
    cy.visit('/platform/clusters/dev/nodes/devops-kube-dev-node2')
    cy.get('[data-cy=node-detail-overview]').should('be.visible')
    cy.get('[data-cy=node-detail-pod-list]').should('be.visible')
  })
  it('should search pod with nginx', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'https://kube-test.devops.test.sz.shopee.io/api/v3/clusters/dev/nodes/devops-kube-dev-node2/pods'
      },
      request => {
        expect(request.url).to.include('nginx')
      }
    ).as('searchPod')
    cy.get('[data-cy=node-detail-search-pod]').type('nginx')
    cy.wait('@searchPod')
  })
})
