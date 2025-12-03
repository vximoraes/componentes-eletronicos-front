describe('Tela de relatórios de orçamentos.', () => {
  let email = Cypress.env('email');
  let senha = Cypress.env('senha');
  let status = ["Em Estoque", "Baixo Estoque", "Indisponível"]

  beforeEach(() => {
    cy.visit('/')
    login(email, senha)
  })
  it.skip('Deve verificar se os cabeçalhos da tabela estão corretos.', () => {
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-orçamentos"]').click()

    cy.get('[data-test="table-head-codigo"]').should('be.visible')
    cy.get('[data-test="table-head-nome"]').should('be.visible')
    cy.get('[data-test="table-head-descricao"]').should('be.visible')
    cy.get('[data-test="table-head-itens"]').should('be.visible')
    cy.get('[data-test="table-head-valor-total"]').should('be.visible')
    cy.get('[data-test="table-head-data"]').should('be.visible')

    cy.get('[data-test="table-head-codigo"]').should('contain.text', 'CÓDIGO')
    cy.get('[data-test="table-head-nome"]').should('contain.text', 'NOME')
    cy.get('[data-test="table-head-descricao"]').should('contain.text', 'DESCRIÇÃO')
    cy.get('[data-test="table-head-itens"]').should('contain.text', 'ITENS')
    cy.get('[data-test="table-head-valor-total"]').should('contain.text', 'VALOR TOTAL')
    cy.get('[data-test="table-head-data"]').should('contain.text', 'DATA')

    cy.get('[data-test="table-head-checkbox"]').should('be.visible')
    cy.get('[data-test="table-head-checkbox"]').find('input[type="checkbox"]').should('exist')
  })

  it.skip('Deve verificar se os campos estão visíveis em todas as linhas e se a nomenclatura dos campos corresponde.', () => {
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-orçamentos"]').click()

    cy.get('[data-test="orcamento-row"]').should('exist')
    cy.get('[data-test="orcamento-row"]').should('have.length.greaterThan', 0)

    cy.get('[data-test="orcamento-row"]').each((row) => {
      cy.wrap(row).within(() => {
        cy.get('[data-test="orcamento-codigo"]').should('be.visible')
        cy.get('[data-test="orcamento-nome"]').should('be.visible')
        cy.get('[data-test="orcamento-descricao"]').should('be.visible')
        cy.get('[data-test="orcamento-itens"]').should('be.visible')
        cy.get('[data-test="orcamento-valor-total"]').should('be.visible')
        cy.get('[data-test="orcamento-data"]').should('be.visible')
      })
    })
  })

  it.skip('Deve verificar se os checkboxes são todos ativados/desativados quando o checkbox mãe passar por uma interação.', () => {
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-orçamentos"]').click()

    cy.get('[data-test="orcamento-row"]').should('exist')
    cy.get('[data-test="orcamento-row"]').should('have.length.greaterThan', 0)

    cy.get('[data-test="checkbox-select-item"]').each((checkbox) => {
      cy.wrap(checkbox).should('not.be.checked')
    })

    cy.get('[data-test="checkbox-select-all"]').should('not.be.checked')
    cy.get('[data-test="checkbox-select-all"]').click()
    cy.get('[data-test="checkbox-select-all"]').should('be.checked')

    cy.get('[data-test="checkbox-select-item"]').each((checkbox) => {
      cy.wrap(checkbox).should('be.checked')
    })

    cy.wrap(null).then(() => {
      cy.get('[data-test="checkbox-select-all"]').click({ force: true })
      cy.get('[data-test="checkbox-select-all"]').should('not.be.checked')
      cy.get('[data-test="checkbox-select-item"]').each((checkbox) => {
        cy.wrap(checkbox).should('not.be.checked')
      })
    })
  })

  it.skip('Deve pesquisar um orçamento pelo nome.', () => {
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-orçamentos"]').click()
    cy.get('[data-test="orcamento-row"]').first().find('[data-test="orcamento-nome"]').first().invoke('text').then((e) => {
      const nomeOrcamento = e.trim()
      cy.get('[data-test="search-input"]').type(nomeOrcamento)
      cy.wait(500)
      cy.get('[data-test="orcamento-row"]').each((orcamento_nome) => {
        const nome = orcamento_nome.find('[data-test="orcamento-nome"]').text().trim()
        expect(nomeOrcamento).to.eq(nome)
      })
    })
  })

  it.skip('Deve pesquisar por um valor x e retornar valores iguais ou maiores a este.', () => {
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-orçamentos"]').click()
    cy.get('[data-test="orcamento-row"]').first().find('[data-test="orcamento-valor-total"]').invoke('text').then((e) => {
      let valor = e.replace('R$', '').replace('R$', '').trim().replace('.', '').replace(',', '.')
      let valorNumerico = parseFloat(valor)
      cy.get('[data-test="filtros-button"]').click()
      cy.get('[data-test="filtro-valor-min-input"]').should('be.visible')
      cy.get('[data-test="filtro-valor-min-input"]').invoke('val').should('be.empty')
      cy.get('[data-test="filtro-valor-min-input"]').type(valor)
      cy.get('[data-test="aplicar-filtros-button"]').should('be.visible')
      cy.get('[data-test="aplicar-filtros-button"]').click()
      cy.wait(1000)
      cy.get('[data-test="orcamento-row"]').each((orcamento) => {
        let i_valor = orcamento.find('[data-test="orcamento-valor-total"]').text().replace('R$', '').trim().replace('.', '').replace(',', '.')
        let i_valorNumerico = parseFloat(i_valor)
        expect(i_valorNumerico).to.be.gte(valorNumerico)
      })
    })
  })

  it.skip('Deve pesquisar por um valor x e retornar valores iguais ou menores a este.', () => {
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-orçamentos"]').click()
    cy.get('[data-test="orcamento-row"]').first().find('[data-test="orcamento-valor-total"]').invoke('text').then((e) => {
      let valor = e.replace('R$', '').replace('R$', '').trim().replace('.', '').replace(',', '.')
      let valorNumerico = parseFloat(valor)
      cy.get('[data-test="filtros-button"]').click()
      cy.get('[data-test="filtro-valor-max-input"]').should('be.visible')
      cy.get('[data-test="filtro-valor-max-input"').invoke('val').should('be.empty')
      cy.get('[data-test="filtro-valor-max-input"]').type(valor)
      cy.get('[data-test="aplicar-filtros-button"]').should('be.visible')
      cy.get('[data-test="aplicar-filtros-button"]').click()
      cy.wait(1000)
      cy.get('[data-test="orcamento-row"]').each((orcamento) => {
        let i_valor = orcamento.find('[data-test="orcamento-valor-total"]').text().replace('R$', '').trim().replace('.', '').replace(',', '.')
        let i_valorNumerico = parseFloat(i_valor)
        expect(i_valorNumerico).to.be.lte(valorNumerico)
      })
    })
  })

  it('')

})

function login(email: string, senha: string) {
  cy.get('#email').type(email)
  cy.get("#senha").type(senha)
  cy.get('button').contains('Entrar').click()
}