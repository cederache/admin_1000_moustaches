describe('Pole Communication - Dashboard', () => {
  it("Should show PoleCom cards", () => {
    cy.login('testcom@example.com', 'testcom');

    cy.get('.card-title').contains('Nombre d\'animaux présents dans l\'association')
    cy.get('.card-title').contains('Nombre d\'animaux adoptés')
  })

  it("Should not show other cards", () => {
    cy.login('testcom@example.com', 'testcom');

    cy.get('.card-title').contains('Nombre d\'animaux présents dans l\'association BIS')
  })
})
