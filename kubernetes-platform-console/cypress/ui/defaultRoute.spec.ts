describe('Login', () => {
  // Set up
  before(() => {
    cy.login()
  })

  it('should visit ApplicationManagement page by default', () => {
    cy.visit('/')
      .url()
      .should('include', '/applications')
  })
})
