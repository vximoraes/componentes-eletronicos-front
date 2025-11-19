/// <reference types="cypress"/>

describe('Tela de relatórios de componentes', () => {
  let email = Cypress.env('email');
  let senha = Cypress.env('senha')
  let api_url = Cypress.env('api_url')
  let accesstoken;
  let refreshtoken;
  let componentes
  beforeEach(() => {
    cy.visit(Cypress.env('host'))
  })



  it('Deve listar os relatórios do componentes do frontend e comparar com a API', async () => {

    login(email, senha)
    cy.get('[data-test="sidebar-btn-relatorios"]').click()
    cy.get('[data-test="sidebar-btn-relatorios-subitem-componentes"]').click()
    await cy.request({ method: 'POST', url: `${api_url}/login`, form: true, body: { email: email, senha: senha } }).then((e) => {
      accesstoken = e.body.data.user.accesstoken
      refreshtoken = e.body.data.user.refreshtoken
      // 
    });
    await cy.request({method:'GET', url:`${api_url}/componentes`, headers:{'Authorization': `Bearer ${accesstoken}`}}).then((e) => {
      componentes = e.body
      cy.log(JSON.stringify(componentes))
    });
  })

})
function login(email, senha) {
  cy.get('#email').type(email)
  cy.get("#senha").type(senha)
  cy.get('button').contains('Entrar').click()
}