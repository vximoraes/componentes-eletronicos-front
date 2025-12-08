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

});
