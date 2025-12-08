describe("Perfil — Edição de Foto", () => {

  beforeEach(() => {
    cy.session("login-admin", () => {
      cy.visit("/login");
      cy.get("#email").type("admin@admin.com");
      cy.get("#senha").type("Senha@123");
      cy.contains("button", "Entrar").click();
      cy.location("pathname").should("not.include", "/login");
    });

    cy.visit("/perfil");
    cy.get('[data-test="perfil-page"]').should("be.visible");
  });

  //teste01
  it("Abre o modal ao clicar em editar foto", () => {
    cy.get('[data-test="edit-avatar-button"]').click();
    cy.get('[data-test="modal-edit-foto"]').should("be.visible");
  });

  //teste02
  it("Fecha o modal ao clicar no botão X", () => {
    cy.get('[data-test="edit-avatar-button"]').click();
    cy.get('[data-test="modal-edit-foto-close-button"]').click();
    cy.get('[data-test="modal-edit-foto"]').should("not.exist");
  });

  
    //teste03
  it("Permite selecionar um arquivo de imagem", () => {
    cy.get('[data-test="edit-avatar-button"]').click();

    cy.get('[data-test="foto-file-input"]').selectFile(
      {
        contents: Cypress.Buffer.from("fake image content"),
        fileName: "foto-teste.png",
        mimeType: "image/png",
      },
      { force: true }
    );

    cy.get('[data-test="save-foto-button"]').should("be.visible");
  });

});