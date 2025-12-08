describe("Perfil — Informações e Estatísticas", () => {

  beforeEach(() => {
    cy.session("login-admin", () => {
      cy.visit("/login");

      cy.get("#email").type("admin@admin.com");
      cy.get("#senha").type("Senha@123");
      cy.contains("button", "Entrar").click();

      cy.location("pathname").should("not.include", "/login");
    });

    cy.visit("/perfil");

    cy.get('[data-test="perfil-page"]', { timeout: 15000 })
      .should("be.visible");
  });

  //Teste 01
  it("Exibe nome, email e avatar", () => {
    cy.get('[data-test="perfil-nome"]').should("be.visible");
    cy.get('[data-test="perfil-email"]').should("be.visible");

    cy.get('[data-test="perfil-avatar-container"]').should("exist");
  });

    //Teste 02
  it("Mostra estatísticas do usuário", () => {
    cy.get('[data-test="total-componentes-value"]')
      .should("be.visible")
      .invoke("text")
      .should("match", /\d+/);

    cy.get('[data-test="total-movimentacoes-value"]')
      .should("be.visible")
      .invoke("text")
      .should("match", /\d+/);

    cy.get('[data-test="total-orcamentos-value"]')
      .should("be.visible")
      .invoke("text")
      .should("match", /\d+/);
  });

    //Teste 03
it("Renderiza área de notificações", () => {
  cy.get('[data-test="notificacoes-section"]')
    .should("be.visible");

  cy.get('[data-test="notificacoes-section"]').within(() => {

    cy.get('[data-test="notificacoes-list"], [data-test="no-notificacoes-message"]')
      .then(($el) => {
        const temLista = $el.filter('[data-test="notificacoes-list"]').length > 0;
        const temVazio = $el.filter('[data-test="no-notificacoes-message"]').length > 0;

        expect(
          temLista || temVazio,
          "Deve existir lista ou mensagem de 'nenhuma notificação'"
        ).to.be.true;

        if (temLista) {
          cy.get('[data-test="notificacoes-list"]').should("be.visible");
        } else {
          cy.get('[data-test="no-notificacoes-message"]').should("be.visible");
        }
      });
    });
  });
});
