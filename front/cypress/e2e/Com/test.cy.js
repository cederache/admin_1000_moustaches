describe('Pole Communication - Dashboard', () => {
  beforeEach(() => {
    cy.login('testcom@example.com', 'testcom');
  });
  it("Should show PoleCom cards", () => {
    cy.get('.card-title').contains('Nombre d\'animaux présents dans l\'association')
    cy.get('.card-title').contains('Nombre d\'animaux adoptés')
  })

  it("Should not show other cards", () => {
    cy.get('.card-title').contains('Nombre de familles d\'accueil disponibles').should('not.exist')
  })
})
