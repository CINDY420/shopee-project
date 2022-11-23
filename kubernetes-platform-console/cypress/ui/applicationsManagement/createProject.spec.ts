describe('Login', () => {
  // Set up
  before(() => {
    cy.login()
  })

  it('should create project', () => {
    cy.visit('/')
    cy.get('[data-cy=create-project]')
      .click()
      .get('.create-project-drawer')
      .should('be.visible')
  })
})
