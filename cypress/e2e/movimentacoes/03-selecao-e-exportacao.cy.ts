describe("Movimentações — Seleção e Exportação", () => {

  beforeEach(() => {
    cy.session("login-admin", () => {
      cy.visit("/login");

      cy.get("#email").type("admin@admin.com");
      cy.get("#senha").type("Senha@123");
      cy.contains("button", "Entrar").click();

      cy.location("pathname").should("not.include", "/login");
    });

    cy.visit("/relatorios/movimentacoes");

    cy.get('[data-test="relatorio-movimentacoes-page"]', { timeout: 15000 })
      .should("be.visible");
  });

  it("Seleciona itens e exporta PDF (sem leitura do arquivo)", () => {

    cy.get('[data-test^="checkbox-item-"]')
      .should("have.length.greaterThan", 1)
      .as("checkboxes");

    cy.get("@checkboxes").eq(0).click();
    cy.get("@checkboxes").eq(1).click();

    cy.get('[data-test="exportar-button"]')
      .should("not.be.disabled")
      .click();

    cy.get('[data-test="modal-exportar-overlay"]')
      .should("exist");

    cy.get('[data-test="filename-input"]')
      .clear()
      .type("movimentacoes-teste");

    cy.get('[data-test="format-radio-pdf"]').check({ force: true });

    cy.get('[data-test="modal-exportar-export-button"]').click();

    cy.get('[data-test="modal-exportar-overlay"]')
      .should("not.exist");

  });

  //
});
