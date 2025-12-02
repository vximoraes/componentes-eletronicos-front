
describe('Tela de relatórios de componentes.', () => {
  let email = Cypress.env('email');
  let senha = Cypress.env('senha')

  beforeEach(() => {
    cy.visit('/')
    login(email, senha)
  })

  it.skip('Deve verificar se os cabeçalhos da tabela estão corretos', () => {
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-componentes"]').click()

    // Verificar se o cabeçalho da tabela existe
    cy.get('[data-test="table-head-codigo"]').should('be.visible')
    cy.get('[data-test="table-head-componente"]').should('be.visible')
    cy.get('[data-test="table-head-quantidade"]').should('be.visible')
    cy.get('[data-test="table-head-status"]').should('be.visible')
    cy.get('[data-test="table-head-localizacao"]').should('be.visible')

    // Verificar o texto de cada cabeçalho
    cy.get('[data-test="table-head-codigo"]').should('contain.text', 'CÓDIGO')
    cy.get('[data-test="table-head-componente"]').should('contain.text', 'COMPONENTE')
    cy.get('[data-test="table-head-quantidade"]').should('contain.text', 'QUANTIDADE')
    cy.get('[data-test="table-head-status"]').should('contain.text', 'STATUS')
    cy.get('[data-test="table-head-localizacao"]').should('contain.text', 'LOCALIZAÇÃO')

    // Verificar se o checkbox do cabeçalho existe
    cy.get('[data-test="table-head-checkbox"]').should('be.visible')
    cy.get('[data-test="table-head-checkbox"]').find('input[type="checkbox"]').should('exist')
  })

  it.skip('Deve verificar se os campos estão visíveis em todas as linhas e se a nomenclatura dos campos correspondem.', () => {
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-componentes"]').click()

    // Verificar se há componentes na lista
    cy.get('[data-test="componente-row"]').should('exist')
    cy.get('[data-test="componente-row"]').should('have.length.greaterThan', 0)

    // Verificar cada linha da tabela
    cy.get('[data-test="componente-row"]').each((row) => {
      cy.wrap(row).within(() => {
        // Verificar código do produto (ID)
        cy.get('[data-test="componente-codigo"]').should('be.visible')
        
        // Verificar nome do produto
        cy.get('[data-test="componente-nome"]').should('be.visible')
        
        // Verificar quantidade
        cy.get('[data-test="componente-quantidade"]').should('be.visible')
        
        // Verificar localização
        cy.get('[data-test="componente-localizacao"]').should('be.visible')
      })
    })
  })
  it.skip('Deve verificar se as checkboxs são todas ativadas/desatividas quando a checkbox mãe passar por uma interação.', () => {
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-componentes"]').click()

    // Aguardar a tabela carregar
    cy.get('[data-test="componente-row"]').should('exist')
    cy.get('[data-test="componente-row"]').should('have.length.greaterThan', 0)

    // Verificar que nenhum checkbox está marcado inicialmente
    cy.get('[data-test="checkbox-select-item"]').each((checkbox) => {
      cy.wrap(checkbox).should('not.be.checked')
    })

    // Verificar que o checkbox mãe não está marcado
    cy.get('[data-test="checkbox-select-all"]').should('not.be.checked')

    // Clicar no checkbox mãe para selecionar todos
    cy.get('[data-test="checkbox-select-all"]').click()

    // Verificar se o checkbox mãe está marcado
    cy.get('[data-test="checkbox-select-all"]').should('be.checked')

    // Verificar se todos os checkboxes filhos foram marcados
    cy.get('[data-test="checkbox-select-item"]').each((checkbox) => {
      cy.wrap(checkbox).should('be.checked')
      })

    cy.wrap(null).then(() => {
      cy.get('[data-test="checkbox-select-all"]').click({force:true})
      cy.get('[data-test="checkbox-select-all"]').should('not.be.checked')
      cy.get('[data-test="checkbox-select-item"]').each((chekbox) => {
        cy.wrap(chekbox).should('not.be.checked')
      })
    })
  })

  it.skip('Deve realizar uma pesquisa por filtro,')


})

function login(email:string, senha:string) {
  cy.get('#email').type(email)
  cy.get("#senha").type(senha)
  cy.get('button').contains('Entrar').click()
}