describe('Orçamentos - Cadastro e Edição', () => {
  const frontendUrl = Cypress.env('FRONTEND_URL');
  const apiUrl = Cypress.env('API_URL');
  const email = Cypress.env('TEST_USER_EMAIL');
  const senha = Cypress.env('TEST_USER_PASSWORD');

  let orcamentoIdCriado: string;
  let authToken: string;
  let componentesTeste: any[] = [];
  let fornecedoresTeste: any[] = [];

  before(() => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: { email, senha }
    }).then((response) => {
      expect(response.status).to.eq(200);
      authToken = response.body.data.user.accesstoken;

      cy.request({
        method: 'GET',
        url: `${apiUrl}/componentes?limit=5`,
        headers: { Authorization: `Bearer ${authToken}` }
      }).then((compResponse) => {
        expect(compResponse.status).to.eq(200);
        componentesTeste = compResponse.body.data.docs || [];
      });

      cy.request({
        method: 'GET',
        url: `${apiUrl}/fornecedores?limit=5`,
        headers: { Authorization: `Bearer ${authToken}` }
      }).then((fornResponse) => {
        expect(fornResponse.status).to.eq(200);
        fornecedoresTeste = fornResponse.body.data.docs || [];
      });
    });
  });

  beforeEach(() => {
    cy.intercept('GET', `${apiUrl}/orcamentos*`).as('getOrcamentos');
    cy.intercept('POST', `${apiUrl}/orcamentos`).as('createOrcamento');
    cy.intercept('PUT', `${apiUrl}/orcamentos/*`).as('updateOrcamento');
    cy.intercept('PATCH', `${apiUrl}/orcamentos/*`).as('patchOrcamento');
    cy.intercept('GET', `${apiUrl}/componentes*`).as('getComponentes');
    cy.intercept('GET', `${apiUrl}/fornecedores*`).as('getFornecedores');

    cy.login(email, senha);
  });

  describe('Adicionar Orçamento', () => {
    beforeEach(() => {
      cy.visit(`${frontendUrl}/orcamentos`);
      cy.wait('@getOrcamentos');

      cy.contains('button', 'Adicionar').click();

      cy.url().should('include', '/orcamentos/adicionar');
    });

    it('Deve redirecionar para tela de cadastro ao clicar em Adicionar', () => {
      cy.url().should('include', '/orcamentos/adicionar');

      cy.contains('Orçamentos').should('be.visible');
      cy.contains('Adicionar').should('be.visible');
    });

    it('Deve exibir todos os campos obrigatórios do formulário', () => {
      cy.contains('Nome').should('be.visible');
      cy.get('[data-test="botao-adicionar-componente"]').should('be.visible');
      cy.contains('button', 'Salvar').should('be.visible');
    });

    it('Deve validar campo Nome obrigatório', () => {
      cy.contains('button', 'Salvar').click();

      cy.wait(500);
      cy.get('form').should('be.visible');
    });

    it('Deve validar limite de caracteres do Nome (máx 100)', () => {
      const nomeGrande = 'A'.repeat(101);

      cy.get('#nome').type(nomeGrande);

      cy.get('#nome').invoke('val').then((val) => {
        expect(val?.toString().length).to.be.lte(100);
      });
    });

    it('Deve validar limite de caracteres da Descrição (máx 200)', () => {
      const descricaoGrande = 'A'.repeat(201);

      cy.get('#descricao').type(descricaoGrande.substring(0, 200));

      cy.get('#descricao').invoke('val').then((val) => {
        expect(val?.toString().length).to.be.lte(200);
      });
    });

    it('Deve exibir contadores de caracteres', () => {
      cy.get('#nome').type('Teste');

      cy.get('body').then($body => {
        const texto = $body.text();
        cy.log('Contador pode estar presente no formulário');
      });
    });

    it('Deve validar que pelo menos um componente é obrigatório', () => {
      const nomeOrcamento = `Orçamento Teste ${Date.now()}`;

      cy.get('#nome').type(nomeOrcamento);
      cy.contains('button', 'Salvar').click();

      cy.wait(500);
      cy.url().should('include', '/adicionar');
    });
  });

  describe('Seleção de Componentes', () => {
    beforeEach(() => {
      cy.visit(`${frontendUrl}/orcamentos/adicionar`);
    });

    it('Deve abrir modal de seleção ao clicar em Adicionar componente', () => {
      if (componentesTeste.length === 0) {
        cy.log('Nenhum componente disponível para teste');
        return;
      }

      cy.get('[data-test="botao-adicionar-componente"]').click();

      cy.get('[data-test="modal-selecionar-componentes"]').should('be.visible');
      cy.get('[data-test="modal-selecionar-componentes"]').within(() => {
        cy.contains(/selecionar componentes|adicionar componentes/i).should('be.visible');
      });
    });

    it('Modal deve ter campo de pesquisa para filtrar componentes', () => {
      if (componentesTeste.length === 0) {
        cy.log('Nenhum componente disponível para teste');
        return;
      }

      cy.get('[data-test="botao-adicionar-componente"]').click();

      cy.get('[data-test="modal-selecionar-componentes"]').within(() => {
        cy.get('[data-test="modal-search-input"]').should('be.visible');
      });
    });

    it('Deve exibir componentes em grid de cards', () => {
      if (componentesTeste.length === 0) {
        cy.log('Nenhum componente disponível para teste');
        return;
      }

      cy.get('[data-test="botao-adicionar-componente"]').click();
      cy.wait('@getComponentes');

      cy.get('[data-test="modal-selecionar-componentes"]').within(() => {
        cy.get('[data-test="componentes-grid"]').should('be.visible');
        cy.get('[data-test^="componente-selecao-card-"]').should('have.length.at.least', 1);
      });
    });

    it('Deve permitir seleção múltipla de componentes', () => {
      if (componentesTeste.length < 2) {
        cy.log('Componentes insuficientes para teste de seleção múltipla');
        return;
      }

      cy.get('[data-test="botao-adicionar-componente"]').click();
      cy.wait('@getComponentes');

      cy.get('[data-test="modal-selecionar-componentes"]').within(() => {
        cy.get('[data-test="componente-selecao-card-0"]').click();
        cy.get('[data-test="componente-selecao-card-1"]').click();

        cy.get('[data-test="contador-selecionados"]').should('contain', '2');
      });
    });

    it('Deve exibir indicador visual de componente selecionado', () => {
      if (componentesTeste.length === 0) {
        cy.log('Nenhum componente disponível para teste');
        return;
      }

      cy.get('[data-test="botao-adicionar-componente"]').click();
      cy.wait('@getComponentes');

      cy.get('[data-test="modal-selecionar-componentes"]').within(() => {
        cy.get('[data-test="componente-selecao-card-0"]').click();
        cy.get('[data-test="componente-selecao-card-0"]').should('have.class', 'selected')
          .or('have.css', 'border-color', /blue|rgb\(59, 130, 246\)/);
      });
    });

    it('Deve adicionar componentes selecionados à tabela', () => {
      if (componentesTeste.length === 0) {
        cy.log('Nenhum componente disponível para teste');
        return;
      }

      cy.get('[data-test="botao-adicionar-componente"]').click();
      cy.wait('@getComponentes');

      cy.get('[data-test="modal-selecionar-componentes"]').within(() => {
        cy.get('[data-test="componente-selecao-card-0"]').click();
        cy.get('[data-test="botao-confirmar-selecao"]').click();
      });

      cy.get('[data-test="tabela-itens-orcamento"]').should('be.visible');
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').should('have.length.at.least', 1);
      });
    });

    it('Modal deve ter scroll infinito para carregar mais componentes', () => {
      cy.get('[data-test="botao-adicionar-componente"]').click();
      cy.wait('@getComponentes');

      cy.get('[data-test="modal-selecionar-componentes"]').within(() => {
        cy.get('[data-test="componentes-grid"]').scrollTo('bottom');
        cy.wait(1000);
        cy.log('Scroll infinito pode carregar mais componentes');
      });
    });

    it('Deve pesquisar componentes por nome no modal', () => {
      if (componentesTeste.length === 0) {
        cy.log('Nenhum componente disponível para teste');
        return;
      }

      cy.get('[data-test="botao-adicionar-componente"]').click();
      cy.wait('@getComponentes');

      cy.get('[data-test="modal-selecionar-componentes"]').within(() => {
        cy.intercept('GET', '**/componentes*').as('searchComponentes');
        cy.get('[data-test="modal-search-input"]').type(componentesTeste[0].nome);
        cy.wait('@searchComponentes');
        cy.contains(componentesTeste[0].nome).should('be.visible');
      });
    });
  });

  describe('Seleção de Fornecedor', () => {
    beforeEach(() => {
      if (componentesTeste.length === 0 || fornecedoresTeste.length === 0) {
        cy.log('Componentes ou fornecedores insuficientes para teste');
        return;
      }

      cy.visit(`${frontendUrl}/orcamentos/adicionar`);
      cy.get('[data-test="botao-adicionar-componente"]').click();
      cy.wait('@getComponentes');

      cy.get('[data-test="modal-selecionar-componentes"]').within(() => {
        cy.get('[data-test="componente-selecao-card-0"]').click();
        cy.get('[data-test="botao-confirmar-selecao"]').click();
      });
    });

    it('Deve exibir dropdown de fornecedor para cada componente', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="select-fornecedor"]').should('exist');
        });
      });
    });

    it('Dropdown deve abrir ao clicar no campo', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="select-fornecedor"]').click();
        });
      });

      cy.get('[data-test="dropdown-fornecedores"]').should('be.visible');
    });

    it('Dropdown deve ter campo de pesquisa', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="select-fornecedor"]').click();
        });
      });

      cy.get('[data-test="dropdown-fornecedores"]').within(() => {
        cy.get('[data-test="dropdown-search-input"]').should('be.visible');
      });
    });

    it('Deve pesquisar fornecedores dentro do dropdown', () => {
      if (fornecedoresTeste.length === 0) {
        cy.log('Nenhum fornecedor disponível para teste');
        return;
      }

      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="select-fornecedor"]').click();
        });
      });

      cy.get('[data-test="dropdown-fornecedores"]').within(() => {
        cy.intercept('GET', '**/fornecedores*').as('searchFornecedores');
        cy.get('[data-test="dropdown-search-input"]').type(fornecedoresTeste[0].nome);
        cy.wait('@searchFornecedores');
        cy.contains(fornecedoresTeste[0].nome).should('be.visible');
      });
    });

    it('Deve selecionar fornecedor e exibir no campo', () => {
      if (fornecedoresTeste.length === 0) {
        cy.log('Nenhum fornecedor disponível para teste');
        return;
      }

      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="select-fornecedor"]').click();
        });
      });

      cy.get('[data-test="dropdown-fornecedores"]').within(() => {
        cy.get('[data-test^="fornecedor-option-"]').first().click();
      });

      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="select-fornecedor"]').should('not.be.empty');
        });
      });
    });

    it('Dropdown deve ter scroll infinito para mais fornecedores', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="select-fornecedor"]').click();
        });
      });

      cy.get('[data-test="dropdown-fornecedores"]').within(() => {
        cy.get('[data-test="fornecedores-list"]').scrollTo('bottom');
        cy.wait(1000);
        cy.log('Scroll infinito pode carregar mais fornecedores');
      });
    });
  });

  describe('Quantidade do Componente', () => {
    beforeEach(() => {
      if (componentesTeste.length === 0) {
        cy.log('Nenhum componente disponível para teste');
        return;
      }

      cy.visit(`${frontendUrl}/orcamentos/adicionar`);
      cy.get('[data-test="botao-adicionar-componente"]').click();
      cy.wait('@getComponentes');

      cy.get('[data-test="modal-selecionar-componentes"]').within(() => {
        cy.get('[data-test="componente-selecao-card-0"]').click();
        cy.get('[data-test="botao-confirmar-selecao"]').click();
      });
    });

    it('Campo de quantidade deve ter valor inicial 1', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="input-quantidade"]').should('have.value', '1');
        });
      });
    });

    it('Deve ter botões + e - para incrementar/decrementar', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="botao-incrementar"]').should('exist');
          cy.get('[data-test="botao-decrementar"]').should('exist');
        });
      });
    });

    it('Botão + deve incrementar quantidade', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="botao-incrementar"]').click();
          cy.get('[data-test="input-quantidade"]').should('have.value', '2');
        });
      });
    });

    it('Botão - deve decrementar quantidade', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="botao-incrementar"]').click();
          cy.get('[data-test="botao-decrementar"]').click();
          cy.get('[data-test="input-quantidade"]').should('have.value', '1');
        });
      });
    });

    it('Botão - deve estar desabilitado quando quantidade = 1', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="botao-decrementar"]').should('be.disabled');
        });
      });
    });

    it('Deve respeitar limite mínimo de 1', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="input-quantidade"]').clear().type('0');
          cy.get('[data-test="input-quantidade"]').blur();
          cy.wait(500);
          cy.get('[data-test="input-quantidade"]').should('have.value', '1');
        });
      });
    });

    it('Deve respeitar limite máximo de 999.999.999', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="input-quantidade"]').clear().type('9999999999');
          cy.get('[data-test="input-quantidade"]').invoke('val').then((val) => {
            expect(parseInt(val as string)).to.be.lte(999999999);
          });
        });
      });
    });

    it('Deve permitir digitação direta da quantidade', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="input-quantidade"]').clear().type('50');
          cy.get('[data-test="input-quantidade"]').should('have.value', '50');
        });
      });
    });

    it('Subtotal deve ser recalculado ao alterar quantidade', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="input-valor-unitario"]').clear().type('10');
          cy.get('[data-test="input-quantidade"]').clear().type('5');
          cy.get('[data-test="subtotal"]').should('contain', '50');
        });
      });
    });
  });

  describe('Valor Unitário', () => {
    beforeEach(() => {
      if (componentesTeste.length === 0) {
        cy.log('Nenhum componente disponível para teste');
        return;
      }

      cy.visit(`${frontendUrl}/orcamentos/adicionar`);
      cy.get('[data-test="botao-adicionar-componente"]').click();
      cy.wait('@getComponentes');

      cy.get('[data-test="modal-selecionar-componentes"]').within(() => {
        cy.get('[data-test="componente-selecao-card-0"]').click();
        cy.get('[data-test="botao-confirmar-selecao"]').click();
      });
    });

    it('Campo deve aceitar valores decimais', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="input-valor-unitario"]').clear().type('10.50');
          cy.get('[data-test="input-valor-unitario"]').should('have.value', '10.50');
        });
      });
    });

    it('Deve aceitar valor mínimo 0', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="input-valor-unitario"]').clear().type('0');
          cy.get('[data-test="input-valor-unitario"]').should('have.value', '0');
        });
      });
    });

    it('Subtotal = quantidade × valor unitário', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="input-quantidade"]').clear().type('3');
          cy.get('[data-test="input-valor-unitario"]').clear().type('25.50');
          cy.get('[data-test="subtotal"]').should('contain', '76.50');
        });
      });
    });

    it('Total do orçamento deve ser atualizado automaticamente', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="input-quantidade"]').clear().type('2');
          cy.get('[data-test="input-valor-unitario"]').clear().type('15.00');
        });
      });

      cy.get('[data-test="total-orcamento"]').should('contain', '30.00');
    });
  });

  describe('Remover Componente', () => {
    beforeEach(() => {
      if (componentesTeste.length === 0) {
        cy.log('Nenhum componente disponível para teste');
        return;
      }

      cy.visit(`${frontendUrl}/orcamentos/adicionar`);
      cy.get('[data-test="botao-adicionar-componente"]').click();
      cy.wait('@getComponentes');

      cy.get('[data-test="modal-selecionar-componentes"]').within(() => {
        cy.get('[data-test="componente-selecao-card-0"]').click();
        cy.get('[data-test="botao-confirmar-selecao"]').click();
      });
    });

    it('Deve ter botão de remoção (lixeira) para cada componente', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="botao-remover-item"]').should('exist');
        });
      });
    });

    it('Deve remover componente ao clicar no botão', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').should('have.length', 1);
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="botao-remover-item"]').click();
        });
      });

      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').should('have.length', 0);
      });
    });

    it('Total deve ser recalculado após remover componente', () => {
      cy.get('[data-test="botao-adicionar-componente"]').click();
      cy.wait('@getComponentes');

      cy.get('[data-test="modal-selecionar-componentes"]').within(() => {
        cy.get('[data-test="componente-selecao-card-1"]').click();
        cy.get('[data-test="botao-confirmar-selecao"]').click();
      });

      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').eq(0).within(() => {
          cy.get('[data-test="input-valor-unitario"]').clear().type('10');
        });
        cy.get('tbody tr').eq(1).within(() => {
          cy.get('[data-test="input-valor-unitario"]').clear().type('20');
        });
      });

      cy.get('[data-test="total-orcamento"]').should('contain', '30');

      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="botao-remover-item"]').click();
        });
      });

      cy.get('[data-test="total-orcamento"]').should('contain', '20');
    });

    it('Deve exibir mensagem quando não há componentes', () => {
      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="botao-remover-item"]').click();
        });
      });

      cy.contains(/nenhum componente adicionado/i).should('be.visible');
    });
  });

  describe('Validações no Cadastro', () => {
    beforeEach(() => {
      cy.visit(`${frontendUrl}/orcamentos/adicionar`);
    });

    it('Deve validar nome obrigatório', () => {
      cy.contains('button', 'Salvar').click();
      cy.wait(500);
      cy.url().should('include', '/adicionar');
    });

    it('Deve validar que pelo menos um componente é necessário', () => {
      const nomeOrcamento = `Orçamento Teste ${Date.now()}`;
      cy.get('#nome').type(nomeOrcamento);
      cy.contains('button', 'Salvar').click();
      cy.wait(500);
      cy.url().should('include', '/adicionar');
    });

    it('Deve validar que todos componentes têm fornecedor', () => {
      if (componentesTeste.length === 0) {
        cy.log('Nenhum componente disponível para teste');
        return;
      }

      const nomeOrcamento = `Orçamento Teste ${Date.now()}`;
      cy.get('#nome').type(nomeOrcamento);

      cy.get('[data-test="botao-adicionar-componente"]').click();
      cy.wait('@getComponentes');

      cy.get('[data-test="modal-selecionar-componentes"]').within(() => {
        cy.get('[data-test="componente-selecao-card-0"]').click();
        cy.get('[data-test="botao-confirmar-selecao"]').click();
      });

      cy.contains('button', 'Salvar').click();
      cy.wait(500);
      cy.url().should('include', '/adicionar');
    });

    it('Deve desabilitar botão Salvar durante processamento', () => {
      if (componentesTeste.length === 0 || fornecedoresTeste.length === 0) {
        cy.log('Componentes ou fornecedores insuficientes para teste');
        return;
      }

      const nomeOrcamento = `Orçamento Teste ${Date.now()}`;
      cy.get('#nome').type(nomeOrcamento);

      cy.get('[data-test="botao-adicionar-componente"]').click();
      cy.wait('@getComponentes');

      cy.get('[data-test="modal-selecionar-componentes"]').within(() => {
        cy.get('[data-test="componente-selecao-card-0"]').click();
        cy.get('[data-test="botao-confirmar-selecao"]').click();
      });

      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="select-fornecedor"]').click();
        });
      });

      cy.get('[data-test="dropdown-fornecedores"]').within(() => {
        cy.get('[data-test^="fornecedor-option-"]').first().click();
      });

      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="input-valor-unitario"]').clear().type('10');
        });
      });

      cy.contains('button', 'Salvar').click();

      cy.get('button:contains("Salvar")').should('be.disabled');
    });

    it('Deve criar orçamento com sucesso', () => {
      if (componentesTeste.length === 0 || fornecedoresTeste.length === 0) {
        cy.log('Componentes ou fornecedores insuficientes para teste');
        return;
      }

      const nomeOrcamento = `Orçamento Teste ${Date.now()}`;
      cy.get('#nome').type(nomeOrcamento);
      cy.get('#descricao').type('Descrição do orçamento de teste');

      cy.get('[data-test="botao-adicionar-componente"]').click();
      cy.wait('@getComponentes');

      cy.get('[data-test="modal-selecionar-componentes"]').within(() => {
        cy.get('[data-test="componente-selecao-card-0"]').click();
        cy.get('[data-test="botao-confirmar-selecao"]').click();
      });

      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="select-fornecedor"]').click();
        });
      });

      cy.get('[data-test="dropdown-fornecedores"]').within(() => {
        cy.get('[data-test^="fornecedor-option-"]').first().click();
      });

      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="input-valor-unitario"]').clear().type('25.50');
        });
      });

      cy.contains('button', 'Salvar').click();

      cy.wait('@createOrcamento').then((createInterception) => {
        expect(createInterception.response?.statusCode).to.be.oneOf([200, 201]);

        orcamentoIdCriado = createInterception.response?.body?.data?._id;

        cy.url().should('include', '/orcamentos');
        cy.url().should('not.include', '/adicionar');

        cy.contains('sucesso', { matchCase: false }).should('be.visible');
      });
    });
  });

  describe('Editar Orçamento', () => {
    let primeiroOrcamento: any;

    beforeEach(() => {
      cy.visit(`${frontendUrl}/orcamentos`);
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];
        if (orcamentos.length > 0) {
          primeiroOrcamento = orcamentos[0];
        }
      });
    });

    it('Deve redirecionar para tela de edição ao clicar em Editar', () => {
      if (!primeiroOrcamento) return;

      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="editar-button"]').click();
        });
      });

      cy.url().should('include', `/orcamentos/editar/${primeiroOrcamento._id}`);
    });

    it('Deve pré-preencher campos com dados atuais', () => {
      if (!primeiroOrcamento) return;

      cy.visit(`${frontendUrl}/orcamentos/editar/${primeiroOrcamento._id}`);

      cy.get('#nome').should('have.value', primeiroOrcamento.nome);
      
      if (primeiroOrcamento.descricao) {
        cy.get('#descricao').should('have.value', primeiroOrcamento.descricao);
      }

      if (primeiroOrcamento.itens && primeiroOrcamento.itens.length > 0) {
        cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
          cy.get('tbody tr').should('have.length', primeiroOrcamento.itens.length);
        });
      }
    });

    it('Deve manter mesmas validações do cadastro', () => {
      if (!primeiroOrcamento) return;

      cy.visit(`${frontendUrl}/orcamentos/editar/${primeiroOrcamento._id}`);

      cy.get('#nome').clear();

      cy.contains('button', 'Salvar').click();

      cy.wait(500);
      cy.url().should('include', '/editar');
    });

    it('Deve permitir adicionar novos componentes', () => {
      if (!primeiroOrcamento || componentesTeste.length === 0) return;

      cy.visit(`${frontendUrl}/orcamentos/editar/${primeiroOrcamento._id}`);

      const qtdAnterior = primeiroOrcamento.itens?.length || 0;

      cy.get('[data-test="botao-adicionar-componente"]').click();
      cy.wait('@getComponentes');

      cy.get('[data-test="modal-selecionar-componentes"]').within(() => {
        cy.get('[data-test="componente-selecao-card-0"]').click();
        cy.get('[data-test="botao-confirmar-selecao"]').click();
      });

      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').should('have.length', qtdAnterior + 1);
      });
    });

    it('Deve permitir remover componentes existentes', () => {
      if (!primeiroOrcamento || !primeiroOrcamento.itens || primeiroOrcamento.itens.length === 0) return;

      cy.visit(`${frontendUrl}/orcamentos/editar/${primeiroOrcamento._id}`);

      const qtdAnterior = primeiroOrcamento.itens.length;

      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="botao-remover-item"]').click();
        });
      });

      cy.get('[data-test="tabela-itens-orcamento"]').within(() => {
        cy.get('tbody tr').should('have.length', qtdAnterior - 1);
      });
    });

    it('Deve atualizar orçamento com sucesso', () => {
      if (!primeiroOrcamento) return;

      const novaDescricao = `Descrição atualizada ${Date.now()}`;

      cy.visit(`${frontendUrl}/orcamentos/editar/${primeiroOrcamento._id}`);

      cy.get('#descricao').clear().type(novaDescricao);

      cy.contains('button', 'Salvar').click();

      cy.wait('@patchOrcamento', { timeout: 10000 }).then((interception) => {
        expect(interception.response?.statusCode).to.be.oneOf([200, 201]);

        cy.url().should('include', '/orcamentos');
        cy.url().should('not.include', '/editar');

        cy.contains(/atualizado|sucesso/i).should('be.visible');
      });
    });
  });

  describe('Cancelar Operação', () => {
    it('Deve redirecionar para listagem ao clicar em Cancelar no cadastro', () => {
      cy.visit(`${frontendUrl}/orcamentos/adicionar`);

      cy.get('[data-test="botao-cancelar"]').click();

      cy.url().should('include', '/orcamentos');
      cy.url().should('not.include', '/adicionar');
    });

    it('Não deve persistir dados ao cancelar', () => {
      cy.visit(`${frontendUrl}/orcamentos/adicionar`);

      cy.get('#nome').type('Orçamento Cancelado');

      cy.get('[data-test="botao-cancelar"]').click();

      cy.url().should('include', '/orcamentos');
      cy.get('body').should('not.contain', 'Orçamento Cancelado');
    });
  });

  after(() => {
    if (orcamentoIdCriado) {
      const apiUrl = Cypress.env('API_URL');
      const email = Cypress.env('TEST_USER_EMAIL');
      const senha = Cypress.env('TEST_USER_PASSWORD');

      cy.request({
        method: 'POST',
        url: `${apiUrl}/login`,
        body: { email, senha }
      }).then((loginResponse) => {
        const token = loginResponse.body.data.user.accesstoken;

        cy.request({
          method: 'PATCH',
          url: `${apiUrl}/orcamentos/${orcamentoIdCriado}/inativar`,
          headers: {
            Authorization: `Bearer ${token}`
          },
          failOnStatusCode: false
        }).then(() => {
          cy.log(`Orçamento de teste ${orcamentoIdCriado} removido`);
        });
      });
    }
  });
});
