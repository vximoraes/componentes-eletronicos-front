/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable {
      getByData(seletor: string): Chainable<JQuery<HTMLElement>>
      login(email: string, senha: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('getByData', (seletor: string) => {
  return cy.get(`[data-test=${seletor}]`)
})

Cypress.Commands.add('login', (email: string, senha: string) => {
  cy.getByData('botao-login').click()
  cy.getByData('email-input').type(email)
  cy.getByData('senha-input').type(senha)
  cy.getByData('botao-enviar').click()
})

export { }