/// <reference types="cypress" />

Cypress.Commands.add('login', (email: string, password: string) => {
    cy.intercept('http://localhost:5001/admin-1000-moustaches/us-central1/api/permissions').as('permissions')

    cy.visit('http://localhost:5173/login')
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(2) > .form-control').type(email);
    cy.get('form').click();
    cy.get(':nth-child(3) > .form-control').type(password);
    cy.get('.bg-gradient-theme-left').click();
    /* ==== End Cypress Studio ==== */
    cy.wait('@permissions');
})