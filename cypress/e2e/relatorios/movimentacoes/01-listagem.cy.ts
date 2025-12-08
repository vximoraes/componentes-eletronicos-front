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

  it("Carrega cabeçalhos da tabela", () => {
    cy.get('[data-test="table-head-codigo"]').should("be.visible");
    cy.get('[data-test="table-head-produto"]').should("be.visible");
    cy.get('[data-test="table-head-quantidade"]').should("be.visible");
    cy.get('[data-test="table-head-tipo"]').should("be.visible");
    cy.get('[data-test="table-head-localizacao"]').should("be.visible");
    cy.get('[data-test="table-head-data"]').should("be.visible");
  }); 
});
