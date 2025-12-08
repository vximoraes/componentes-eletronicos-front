describe("Perfil — Edição de Informações", () => {

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
  it("Abre o modal de edição ao clicar em Editar perfil", () => {
    cy.get('[data-test="edit-perfil-button"]').click();

    cy.get('[data-test="modal-edit-perfil"]')
      .should("be.visible");

    cy.get('[data-test="input-nome"]')
      .should("be.visible")
     .and(($input) => {
        expect($input.val()).to.not.be.empty;
    });

  //Teste 02
  it("Fecha o modal ao clicar no botão X", () => {
    cy.get('[data-test="edit-perfil-button"]').click();

    cy.get('[data-test="modal-edit-perfil"]')
      .should("be.visible");

    cy.get('[data-test="modal-edit-perfil-close-button"]').click();

    cy.get('[data-test="modal-edit-perfil"]')
      .should("not.exist");
  });

    //Teste 03
  it("Edita o nome do usuário e salva", () => {
    const novoNome = "Admin Teste " + Date.now();

    cy.get('[data-test="edit-perfil-button"]').click();
    cy.get('[data-test="modal-edit-perfil"]').should("be.visible");

    cy.get('[data-test="input-nome"]')
      .clear()
      .type(novoNome);

    cy.get('[data-test="save-perfil-button"]').click();

    cy.get('[data-test="modal-edit-perfil"]')
      .should("not.exist");

    cy.get('[data-test="perfil-nome"]', { timeout: 5000 })
      .should("contain", novoNome);
  });

    //Teste 04
  it("Desabilita o botão Salvar enquanto está salvando", () => {
    cy.get('[data-test="edit-perfil-button"]').click();

    cy.get('[data-test="input-nome"]')
      .clear()
      .type("Novo Nome Teste");

    cy.get('[data-test="save-perfil-button"]').click();

    cy.get('[data-test="save-perfil-button"]')
      .should("be.disabled");
  });


  });

});
