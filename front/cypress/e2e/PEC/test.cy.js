describe('Pole Prise en charge - Dashboard', () => {
  beforeEach(() => {
    cy.login('testpec@example.com', 'testpec');
  });
  it("Should show PEC cards", () => {
    cy.get('.card-title').contains('Nombre de familles d\'accueil disponibles')
  })

  it("Should not show other cards", () => {
    cy.get('.card-title').contains('Nombre d\'animaux présents dans l\'association').should('not.exist')
    cy.get('.card-title').contains('Nombre d\'animaux adoptés').should('not.exist')
  })
})
