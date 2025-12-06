describe('Notificações.', () => {
  let email = Cypress.env('email');
  let senha = Cypress.env('senha');
  let componente = "Componente Teste Notificações"
  let min = 5
  let status = ["Em Estoque", "Baixo Estoque", "Indisponível"]
  beforeEach(() => {
    cy.visit('/')
    login(email, senha)
  })

  it.skip('Deve cadastrar um componente e verificar se uma nova notificação correspondente é criada', () => {
    cy.get('[data-test="search-input"]').type(componente)
    cy.wait(1500)
    cy.get('[data-test="stat-total-componentes"]').find('p').invoke('text').then((e) => {
      let total = parseInt(e.replace(/\D/g, ''))
      if (total == 0) {
        cy.get('[data-test="adicionar-button"]').click()
        cy.get('[data-teste="input-nome-componente"]').type(componente)
        cy.get('[data-teste="botao-selecionar-categoria"]').click()
        cy.get('[title="Cabos"]').click()
        cy.get('[data-teste="input-estoque-minimo"]').clear().type(min.toString())
        cy.get('[data-teste="textarea-descricao-componente"]').type('Notificações teste...')
        cy.get('[data-teste="botao-salvar"]').click()
      } else {
        gerarNotificacao(min)
        cy.log('Componente já cadastrado.')
      }
    })
  })

  it.skip('Deve averiguar a mensagem sobre o status do último componente.', () => {
    let quantidade = ""
    cy.get('[data-test="search-input"]').type(componente)
    cy.wait(1500)
    cy.get('[data-test="stat-total-componentes"]').find('p').invoke('text').then((e) => {
      let total = parseInt(e.replace(/\D/g, ''))
      if (total == 0) {
        cy.get('[data-test="adicionar-button"]').click()
        cy.get('[data-teste="input-nome-componente"]').type(componente)
        cy.get('[data-teste="botao-selecionar-categoria"]').click()
        cy.get('[title="Cabos"]').click()
        cy.get('[data-teste="input-estoque-minimo"]').clear().type(min.toString())
        cy.get('[data-teste="textarea-descricao-componente"]').type('Notificações teste...')
        cy.get('[data-teste="botao-salvar"]').click()
        cy.wait(1500)
        gerarNotificacao(min)
        cy.get('[data-test="search-input"]').clear().type(componente)
        cy.get('[data-test="componente-card-0"]').find('[data-test="status-badge"]').first().invoke('text').then((e) => {
          cy.get('[data-teste="botao-notificacoes"]').click()
          cy.get('[data-teste="mensagem-notificacao"]').first().invoke('text').then((notificacao) => {
            cy.log(e)
          })
        })
      } else {
        gerarNotificacao(min)
        cy.log('Componente já cadastrado.')
        cy.get('[data-test="search-input"]').clear().type(componente)
        cy.get('[data-test="quantity"]').find('span').first().invoke('text').then((e) => {
          quantidade = e.replaceAll(/\D/g, '')
          cy.log(e)
          cy.log(quantidade)
        })
        cy.wait(1000)
        cy.get('[data-test="componente-card-0"]').find('[data-test="status-badge"]').first().invoke('text').then((e) => {
          cy.get('[data-teste="botao-notificacoes"]').click()
          cy.wait(10000)
          cy.get('[data-teste="mensagem-notificacao"]').first().invoke('text').then((notificacao) => {
            // cy.log(e)
            if (e === "Em Estoque") {
              expect(notificacao).to.eq(`${componente} está em estoque (${quantidade} unidades)`)
            } else if (e === "Baixo Estoque") {
              expect(notificacao).to.eq(`${componente} está com estoque baixo (${quantidade} unidades)`)
            } else if (e === "Indisponível") {
              expect(notificacao).to.eq(`${componente} está indisponível (${quantidade} unidades)`)
            }
          })
        })
      }
    })
  })

  it('Deve verificar marcar um teste como visto.', () => {
    cy.get('[data-test="search-input"]').type(componente)
    cy.wait(1500)
    cy.get('[data-test="stat-total-componentes"]').find('p').invoke('text').then((e) => {
      let total = parseInt(e.replace(/\D/g, ''))
      if (total == 0) {
        cy.get('[data-test="adicionar-button"]').click()
        cy.get('[data-teste="input-nome-componente"]').type(componente)
        cy.get('[data-teste="botao-selecionar-categoria"]').click()
        cy.get('[title="Cabos"]').click()
        cy.get('[data-teste="input-estoque-minimo"]').clear().type(min.toString())
        cy.get('[data-teste="textarea-descricao-componente"]').type('Notificações teste...')
        cy.get('[data-teste="botao-salvar"]').click()
        cy.get('[data-teste="botao-notificacoes"]').click()
        cy.get('[data-teste="item-notificacao"]').first().then((e) => {
          const visualizacao = e.find('[data-teste="indicador-nao-lida"]')
          cy.log(visualizacao)
        })
      } else {
        gerarNotificacao(min)
        cy.log('Componente já cadastrado.')

        cy.wrap(null).then(() => {
          cy.get('[data-teste="botao-notificacoes"]').click()
          cy.get('[data-teste="item-notificacao"]').first().then((e) => {
            const visualizacao = e.find('[data-teste="indicador-nao-lida"]')
            cy.log(visualizacao)
          })
        })

      }
    })
  })
})

function login(email: string, senha: string) {
  cy.get('#email').type(email)
  cy.get("#senha").type(senha)
  cy.get('button').contains('Entrar').click()
}

function gerarNotificacao(min: number) {
  let valor = 0
  cy.get('[data-teste="contador-notificacoes"]').invoke('text').then((e) => {
    valor = parseInt(e.replaceAll(/\D/g, ''))
  })
  cy.get('[data-test="quantity"]').find('span').first().invoke('text').then((e) => {
    let qtd = parseInt(e.replaceAll(/\D/g, ''))
    cy.log(qtd.toString())
    if (qtd > min) {
      cy.get('[data-test="componente-card-0"]').find('[data-test="saida-icon"]').click()
      cy.get('[data-test="modal-saida-quantidade-input"]').type(qtd.toString())
      cy.get('[data-test="modal-saida-localizacao-dropdown"]').click()
      cy.get('[data-test="modal-saida-localizacao-dropdown"]').parent().find('button:not([data-test="modal-saida-localizacao-dropdown"])').first().click()
      cy.get('[data-test="modal-saida-confirmar"]').click()
      cy.get('[data-teste="botao-notificacoes"]').click()
      compararValor(valor)
    } else if (qtd < min) {
      let valor = min - qtd
      cy.get('[data-test="componente-card-0"]').find('[data-test="entrada-icon"]').click()
      cy.get('[data-test="modal-entrada-quantidade-input"]').type(valor.toString())
      cy.get('[data-test="modal-entrada-localizacao-dropdown"]').click()
      cy.get('[data-test="modal-entrada-localizacao-dropdown"]').parent().find('button:not([data-test="modal-entrada-localizacao-dropdown"])').first().click()
      cy.get('[data-test="modal-entrada-confirmar"]').click()
      cy.get('[data-teste="botao-notificacoes"]').click()
      compararValor(valor)
    }
    else if (qtd == 0) {
      cy.get('[data-test="componente-card-0"]').find('[data-test="entrada-icon"]').click()
      cy.get('[data-test="modal-entrada-quantidade-input"]').type(min.toString())
      cy.get('[data-test="modal-entrada-localizacao-dropdown"]').click()
      cy.get('[data-test="modal-entrada-localizacao-dropdown"]').parent().find('button:not([data-test="modal-entrada-localizacao-dropdown"])').first().click()
      cy.get('[data-test="modal-entrada-confirmar"]').click()
      cy.get('[data-teste="botao-notificacoes"]').click()
      compararValor(valor)
    }
    else {
      let valor = min - 1
      cy.get('[data-test="componente-card-0"]').find('[data-test="saida-icon"]').click()
      cy.get('[data-test="modal-saida-quantidade-input"]').type(valor.toString())
      cy.get('[data-test="modal-saida-localizacao-dropdown"]').click()
      cy.get('[data-test="modal-saida-localizacao-dropdown"]').parent().find('button:not([data-test="modal-saida-localizacao-dropdown"])').first().click()
      cy.get('[data-test="modal-saida-confirmar"]').click()
      cy.get('[data-teste="botao-notificacoes"]').click()
      compararValor(valor)
    }
  })
}

function compararValor(valor: number) {
  let valorInterno = 0
  cy.get('[data-teste="contador-notificacoes"]').invoke('text').then((e) => {
    valorInterno = parseInt(e.replaceAll(/\D/g, ''))
    expect(valor).to.lte(valorInterno)
    return
  })
}