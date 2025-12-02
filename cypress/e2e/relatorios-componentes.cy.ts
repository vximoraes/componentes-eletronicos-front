import path from 'path'
import { da } from 'zod/v4/locales';

describe('Tela de relatórios de componentes.', () => {
  let email = Cypress.env('email');
  let senha = Cypress.env('senha');
  let status = ["Em Estoque", "Baixo Estoque", "Indisponível"]

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
      cy.get('[data-test="checkbox-select-all"]').click({ force: true })
      cy.get('[data-test="checkbox-select-all"]').should('not.be.checked')
      cy.get('[data-test="checkbox-select-item"]').each((chekbox) => {
        cy.wrap(chekbox).should('not.be.checked')
      })
    })
  })

  it.skip('Deve realizar uma pesquisa pelo filtro baseado no status.', () => {
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-componentes"]').click()

    cy.get('[data-test="componente-status"]').first().invoke('text').then((e) => {
      if (status.includes(e)) {
        cy.get('[data-test="filtros-button"]').should('be.visible')
        cy.get('[data-test="filtros-button"]').click()
        cy.get('[data-test="filtro-status-dropdown"]').should('be.visible')
        cy.get('[data-test="filtro-status-dropdown"]').click()
        cy.get('[data-test="filtro-status-dropdown"]').parent().find('div').first().contains('button', `${e}`).should('be.visible')
        cy.get('[data-test="filtro-status-dropdown"]').parent().find('div').first().contains('button', `${e}`).click()
        cy.get('[data-test="aplicar-filtros-button"]').should('be.visible')
        cy.get('[data-test="aplicar-filtros-button"]').click()
        cy.wait(500)
        cy.get('[data-test="componente-row"]').each((produto_status) => {
          const statusAtual = produto_status.find('[data-test="componente-status"]').text()
          expect(statusAtual).to.eq(e)
        })
        cy.get('[data-test="filter-tag-status"]').contains(e)
      } else {
        cy.log('Não há produtos cadastrados.')
        return
      }
    })
  })
  it.skip('Deve realizar uma pesquisa pelo filtro baseado na categoria.', () => {
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-componentes"]').click()
    cy.get('[data-test="filtros-button"]').should('be.visible')
    cy.get('[data-test="filtros-button"]').click()
    cy.get('[data-test="filtro-categoria-dropdown"]').should('be.visible')
    cy.get('[data-test="filtro-categoria-dropdown"]').click()
    cy.get('[data-test="filtro-categoria-dropdown"]').parent().find('div').first().find('button').then((e) => {
      const cabos = e.get()[1].textContent
      cy.contains(cabos).should('be.visible')
      cy.contains(cabos).click()
      cy.get('[data-test="aplicar-filtros-button"]').should('be.visible')
      cy.get('[data-test="aplicar-filtros-button"]').click()
      cy.get('[data-test="componente-row"]').should('exist')
      cy.get('[data-test="componente-row"]').should('be.visible')
      cy.get('[data-test="filter-tag-categoria"]').contains(cabos)
    })
  })

  it.skip('Deve verificar a se as informações das estaticas estão visíveis.', () => {
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-componentes"]').click()
    cy.wait(500)
    cy.get('[data-test="stat-total-componentes"]').within((e) => {
      const paragrafos = e.find('p')
      let texto = ''
      for (const p of paragrafos) {
        texto += p.textContent + " "
      }
      texto = texto.trim()
      if (texto) {
        expect(texto).contain('Total de componentes')
      }
    })

    cy.get('[data-test="stat-em-estoque"]').within((e) => {
      const paragrafos = e.find('p')
      let texto = ''
      for (const p of paragrafos) {
        texto += p.textContent + " "
      }
      texto = texto.trim()
      if (texto) {
        expect(texto).contain('Total de componentes')
      }
    })

    cy.get('[data-test="stat-baixo-estoque"]').within((e) => {
      const paragrafos = e.find('p')
      let texto = ''
      for (const p of paragrafos) {
        texto += p.textContent + " "
      }
      texto = texto.trim()
      if (texto) {
        expect(texto).contain('Total de componentes')
      }
    })

    cy.get('[data-test="stat-indisponiveis"]').within((e) => {
      const paragrafos = e.find('p')
      let texto = ''
      for (const p of paragrafos) {
        texto += p.textContent + " "
      }
      texto = texto.trim()
      if (texto) {
        expect(texto).contain('Total de componentes')
      }
    })
  })
  it.skip('Deve pesquisar um componente pelo nome.', () => {
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-componentes"]').click()
    cy.get('[data-test="componente-row"]').first().find('[data-test="componente-nome"]').first().invoke('text').then((e) => {
      cy.get('[data-test="search-input"]').type(e)
      cy.wait(500)
      cy.get('[data-test="componente-row"]').each((componente_nome) => {
        const nome = componente_nome.find('[data-test="componente-nome"]').text()
        expect(e).to.eq(nome)
      })
    })
  })

  it.skip('Botão de Exportar deve estar sem interação se nenhum componente com checkbox seletada estiver presente.', () => {
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-componentes"]').click()
    cy.get('[data-test="exportar-button"]').should('not.be.enabled')
    cy.get('[data-test="checkbox-select-item"]').first().click()
  })

  it.skip('Botão de Exportar deve estar interativo se ao menos um componente estiver selecionado.', () => {
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-componentes"]').click()
    cy.get('[data-test="checkbox-select-item"]').first().click()
    cy.get('[data-test="exportar-button"]').should('be.enabled')
  })

  it.skip('Não deve Exportar um .pdf se o campo nome estiver vazio.', () => {
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-componentes"]').click()
    cy.get('[data-test="checkbox-select-item"]').first().click()
    cy.get('[data-test="exportar-button"]').click()
    cy.get('[data-test="modal-exportar-content"]').should('be.visible')
    cy.get('[data-test="filename-input"]').clear()
    cy.get('[data-test="format-radio-pdf"]').check().should('be.checked')
    cy.get('[data-test="modal-exportar-export-button"]').should('not.be.enabled')
  })

  it.skip('Não deve Exportar um .cvs se o campo nome estiver vazio.', () => {
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-componentes"]').click()
    cy.get('[data-test="checkbox-select-item"]').first().click()
    cy.get('[data-test="exportar-button"]').click()
    cy.get('[data-test="modal-exportar-content"]').should('be.visible')
    cy.get('[data-test="filename-input"]').clear()
    cy.get('[data-test="format-radio-csv"]').click()
    cy.get('[data-test="format-radio-csv"]').check().should('be.checked')
    cy.get('[data-test="modal-exportar-export-button"]').should('not.be.enabled')
  })

  it('Deve exportar um pdf com sucesso.', () => {
    const date = new Date().getTime()
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-componentes"]').click()
    cy.get('[data-test="checkbox-select-item"]').first().click()
    cy.get('[data-test="exportar-button"]').click()
    cy.get('[data-test="format-radio-pdf"]').check().should('be.checked')
    cy.get('[data-test="filename-input"]').clear().type(date.toString())
    cy.wait(1000)
    cy.get('[data-test="modal-exportar-content"]').should('be.visible').click({force:true})
    // cy.get('[data-test="modal-exportar-content"]').should('not.exist')
    // const filePath = path.join(Cypress.config('downloadsFolder'), date.toString()+"-2025-12-02.pdf")
    // cy.readFile(filePath).should('exist')
  })
})

function login(email: string, senha: string) {
  cy.get('#email').type(email)
  cy.get("#senha").type(senha)
  cy.get('button').contains('Entrar').click()
}