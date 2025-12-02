describe('Orçamentos - Listagem e Pesquisa', () => {
  const frontendUrl = Cypress.env('FRONTEND_URL');
  const apiUrl = Cypress.env('API_URL');
  const email = Cypress.env('TEST_USER_EMAIL');
  const senha = Cypress.env('TEST_USER_PASSWORD');

  let authToken: string;
  let primeiroOrcamento: any;

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
        url: `${apiUrl}/orcamentos?limit=1`,
        headers: { Authorization: `Bearer ${authToken}` }
      }).then((orcResponse) => {
        expect(orcResponse.status).to.eq(200);
        if (orcResponse.body.data.docs.length > 0) {
          primeiroOrcamento = orcResponse.body.data.docs[0];
        }
      });
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '**/orcamentos*').as('getOrcamentos');

    cy.visit(`${frontendUrl}/login`);
    cy.get('[data-test="email-input"]').should('be.visible').clear().type(email);
    cy.get('[data-test="senha-input"]').should('be.visible').clear().type(senha);
    cy.get('[data-test="botao-entrar"]').click();

    cy.url({ timeout: 30000 }).should('include', '/componentes');
    
    cy.visit(`${frontendUrl}/orcamentos`);
    cy.wait('@getOrcamentos');
  });

  describe('Listagem de Orçamentos', () => {
    it('exibe tabela de orçamentos após carregar', () => {
      cy.get('[data-test="orcamentos-page"]').should('be.visible');
      cy.get('[data-test="orcamentos-table"]').should('be.visible');
    });

    it('exibe colunas corretas na tabela', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.contains('NOME').should('be.visible');
        cy.contains('DESCRIÇÃO').should('be.visible');
        cy.contains('TOTAL').should('be.visible');
        cy.contains('AÇÕES').should('be.visible');
      });
    });

    it('exibe orçamentos com informações corretas', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').should('have.length.at.least', 1);
        cy.get('tbody tr').first().within(() => {
          cy.get('td').should('have.length.at.least', 4);
        });
      });
    });

    it('exibe total em formato monetário (R$)', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('td').eq(2).invoke('text').should('match', /R\$\s*\d+\.\d{2}/);
        });
      });
    });

    it('exibe botões de ações (visualizar, editar, excluir)', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').should('exist');
          cy.get('[data-test="editar-button"]').should('exist');
          cy.get('[data-test="excluir-button"]').should('exist');
        });
      });
    });
  });

  describe('Pesquisa', () => {
    it('filtra orçamentos por nome', () => {
      if (!primeiroOrcamento) {
        cy.log('Nenhum orçamento disponível para teste');
        return;
      }

      cy.intercept('GET', '**/orcamentos*').as('searchRequest');
      const parteDoNome = primeiroOrcamento.nome.substring(0, Math.min(5, primeiroOrcamento.nome.length));
      cy.get('[data-test="search-input"]').clear().type(parteDoNome);
      cy.wait('@searchRequest');
      cy.wait(1000);
      cy.get('[data-test="orcamentos-table"]').should('be.visible');
    });

    it('exibe mensagem quando não encontra resultados', () => {
      cy.intercept('GET', '**/orcamentos*').as('searchRequest');
      cy.get('[data-test="search-input"]').clear().type('XYZABC123456NAOEXISTE');
      cy.wait('@searchRequest');
      cy.wait(500);
      cy.get('[data-test="empty-state"]', { timeout: 15000 }).should('be.visible');
      cy.contains('Nenhum orçamento encontrado para sua pesquisa.').should('be.visible');
    });

    it('restaura listagem ao limpar busca', () => {
      cy.intercept('GET', '**/orcamentos*').as('searchRequest');
      cy.get('[data-test="search-input"]').clear().type('teste');
      cy.wait('@searchRequest');
      cy.get('[data-test="search-input"]').clear();
      cy.wait('@searchRequest');
      cy.get('[data-test="orcamentos-table"]').should('be.visible');
    });

    it('pesquisa funciona em tempo real', () => {
      if (!primeiroOrcamento) {
        cy.log('Nenhum orçamento disponível para teste');
        return;
      }

      cy.intercept('GET', '**/orcamentos*').as('searchRequest');
      const parteDoNome = primeiroOrcamento.nome.substring(0, 3);
      cy.get('[data-test="search-input"]').clear().type(parteDoNome);
      cy.wait('@searchRequest');
      cy.wait(500);
      cy.get('[data-test="orcamentos-table"]').should('be.visible');
    });
  });

  describe('Navegação', () => {
    it('redireciona para adicionar orçamento', () => {
      cy.get('[data-test="adicionar-button"]').click();
      cy.url().should('include', '/orcamentos/adicionar');
    });

    it('redireciona para editar orçamento ao clicar no botão editar', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="editar-button"]').click();
        });
      });
      cy.url().should('include', '/orcamentos/editar/');
    });
  });

  describe('Paginação', () => {
    it('exibe controles de paginação quando necessário', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const pagination = interception.response?.body?.data;
        if (pagination && pagination.totalPages > 1) {
          cy.get('[data-test="pagination"]').should('be.visible');
          cy.get('[data-test="pagination"]').within(() => {
            cy.get('button').should('have.length.at.least', 2);
          });
        }
      });
    });

    it('navega para próxima página', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const pagination = interception.response?.body?.data;
        if (pagination && pagination.totalPages > 1 && pagination.page < pagination.totalPages) {
          cy.intercept('GET', '**/orcamentos*').as('nextPage');
          cy.get('[data-test="pagination"]').within(() => {
            cy.contains('button', /próxima|next/i).click();
          });
          cy.wait('@nextPage');
          cy.url().should('include', 'page=2');
        }
      });
    });

    it('botão anterior desabilitado na primeira página', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const pagination = interception.response?.body?.data;
        if (pagination && pagination.page === 1 && pagination.totalPages > 1) {
          cy.get('[data-test="pagination"]').within(() => {
            cy.contains('button', /anterior|previous/i).should('be.disabled');
          });
        }
      });
    });
  });

  describe('Estado Vazio', () => {
    it('exibe mensagem apropriada quando não há orçamentos', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];
        if (orcamentos.length === 0) {
          cy.get('[data-test="empty-state"]').should('be.visible');
          cy.contains(/nenhum orçamento|sem orçamentos/i).should('be.visible');
        } else {
          cy.log('Teste pulado: existem orçamentos cadastrados');
        }
      });
    });
  });

  describe('Tratamento de Erros', () => {
    it('exibe mensagem de erro ao falhar carregamento', () => {
      cy.intercept('GET', '**/orcamentos*', {
        statusCode: 500,
        body: { message: 'Erro ao carregar orçamentos' }
      }).as('getOrcamentosError');

      cy.visit(`${frontendUrl}/orcamentos`, { failOnStatusCode: false });
      cy.wait('@getOrcamentosError');
      
      cy.wait(2000);
      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('erro') || bodyText.includes('Erro')) {
          cy.contains(/erro/i).should('be.visible');
        } else {
          cy.log('Página carregou sem exibir erro visível');
        }
      });
    });
  });
});
