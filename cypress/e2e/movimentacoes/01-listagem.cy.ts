describe("Movimentações — Listagem", () => {
  beforeEach(() => {
    cy.session("login-admin", () => {
      cy.visit("/login");

      cy.get("#email").should("be.visible").type("admin@admin.com");
      cy.get("#senha").should("be.visible").type("Senha@123");

      cy.contains("button", "Entrar").should("be.visible").click();

    
      cy.url({ timeout: 15000 }).should("not.include", "/login");
    });

    cy.visit("/relatorios/movimentacoes");

    cy.get('[data-test="relatorio-movimentacoes-page"]', { timeout: 15000 })
      .should("be.visible");
  });


});
