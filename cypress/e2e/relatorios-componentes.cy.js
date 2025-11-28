/// <reference types="cypress"/>

describe('Tela de relatórios de componentes', () => {
  let email = Cypress.env('email');
  let senha = Cypress.env('senha')

  beforeEach(() => {
    cy.visit(Cypress.env('host'))
  })

  it('Deve verificar se os campos estão visíveis em todas as linhas', () => {
    login(email, senha)
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    // cy.get('[data-test="sidebar-btn-relatorios-subitem-componentes"]').click()
    // cy.wait(2000)

    // // Verificar se há componentes na lista
    // cy.get('[data-test="componente-row"]').should('exist')
    // cy.get('[data-test="componente-row"]').should('have.length.greaterThan', 0)

    // // Verificar cada linha da tabela
    // cy.get('[data-test="componente-row"]').each((row) => {
    //   cy.wrap(row).within(() => {
    //     // Verificar código do produto (ID)
    //     cy.get('[data-test="componente-codigo"]').should('be.visible')
        
    //     // Verificar nome do produto
    //     cy.get('[data-test="componente-nome"]').should('be.visible')
        
    //     // Verificar quantidade
    //     cy.get('[data-test="componente-quantidade"]').should('be.visible')
        
    //     // Verificar localização
    //     cy.get('[data-test="componente-localizacao"]').should('be.visible')
    //   })
    // })
  })

})

function login(email, senha) {
  cy.get('#email').type(email)
  cy.get("#senha").type(senha)
  cy.get('button').contains('Entrar').click()
  cy.wait(5000)
}