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

// teste 02

  it("Aplica filtro de Entrada e lista somente entradas", () => {
    cy.get('[data-test="filtros-button"]').click();
    cy.get('[data-test="filtro-status-dropdown"]').click();

    cy.get('[data-test="filtro-status-option-entrada"]').click();
    cy.get('[data-test="aplicar-filtros-button"]').click();

    // Badge aparece
    cy.get('[data-test="filter-tag-tipo"]')
      .should("exist")
      .and(($el) => {
        const text = $el.text().toLowerCase();
        expect(text).to.contain("entrada");
      });
 
        // Tabela — somente "Entrada"
    cy.get('[data-test="movimentacoes-table-body"] tr').each(($row) => {
      cy.wrap($row)
        .find('[data-test^="badge-tipo-"]')
        .invoke("text")
        .then((t) => {
          expect(t.trim().toLowerCase()).to.equal("entrada");
        });
    });

    //teste 03
    it("Remove o filtro de tipo pelo botão X", () => {
    cy.get('[data-test="filtros-button"]').click();
    cy.get('[data-test="filtro-status-dropdown"]').click();

    cy.get('[data-test="filtro-status-option-entrada"]').click();
    cy.get('[data-test="aplicar-filtros-button"]').click();

    cy.get('[data-test="remove-tipo-filter"]').click();

    cy.get('[data-test="filter-tag-tipo"]').should("not.exist");
  });
  });
});
