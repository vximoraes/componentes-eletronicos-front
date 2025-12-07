describe("Movimentações — Pesquisa e Estatísticas", () => {

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

  //teste 01
  it("Pesquisa por nome do produto", () => {
    cy.get('[data-test="search-input"]').type("arduino", { delay: 0 });

    cy.get('[data-test="movimentacoes-table-body"] tr')
      .each(($row) => {
        cy.wrap($row).find('[data-test="movimentacao-produto"]')
          .invoke("text")
          .should("match", /arduino/i);
      });
  });

  //teste 02
  it("Exibe estado vazio quando a pesquisa não encontra resultados", () => {
    cy.get('[data-test="search-input"]').type("algoquenaoexiste123");

    cy.get('[data-test="empty-state"]').should("be.visible");
  });

//teste 03
  it("Exibe estatísticas com total, entradas e saídas", () => {
    cy.get('[data-test="stat-total-movimentacoes"]')
      .should("be.visible")
      .invoke("text")
      .should("match", /\d+/);

    cy.get('[data-test="stat-entradas"]')
      .should("be.visible")
      .invoke("text")
      .should("match", /\d+/);

    cy.get('[data-test="stat-saidas"]')
      .should("be.visible")
      .invoke("text")
      .should("match", /\d+/);
  });
  
    //teste 04
  it("Estatísticas atualizam após pesquisa", () => {
    cy.get('[data-test="stat-total-movimentacoes"]')
      .invoke("text")
      .then((valorAntes) => {
        cy.get('[data-test="search-input"]').type("entrada");

        cy.wait(700);

        cy.get('[data-test="stat-total-movimentacoes"]')
          .invoke("text")
          .should((valorDepois) => {
            expect(valorDepois).not.to.eq(valorAntes);
          });
      });
  });
});