/// <reference types="cypress" />

describe("Movimentações — Filtros", () => {

  beforeEach(() => {
    cy.session("login-admin", () => {
      cy.visit("/login");

      cy.get("#email").should("be.visible").type("admin@admin.com");
      cy.get("#senha").should("be.visible").type("Senha@123");
      cy.contains("button", "Entrar").should("be.visible").click();

      cy.location("pathname", { timeout: 10000 }).should("not.include", "/login");
    });

    cy.visit("/relatorios/movimentacoes");
    cy.get('[data-test="relatorio-movimentacoes-page"]').should("be.visible");
  });


// teste 01
  it("Abre e fecha o modal de filtros", () => {
    cy.get('[data-test="filtros-button"]').click();

    cy.get('[data-test="modal-filtros-content"]').should("exist");

    cy.get('[data-test="modal-filtros-close-button"]').click();

    cy.get('[data-test="modal-filtros-content"]').should("not.exist");
  });

 
});
