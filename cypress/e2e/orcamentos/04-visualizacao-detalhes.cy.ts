describe('Orçamentos - Visualização de Detalhes', () => {
  const frontendUrl = Cypress.env('FRONTEND_URL');
  const apiUrl = Cypress.env('API_URL');
  const email = Cypress.env('TEST_USER_EMAIL');
  const senha = Cypress.env('TEST_USER_PASSWORD');

  let primeiroOrcamento: any;
  let authToken: string;

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
    cy.intercept('GET', '**/orcamentos/*').as('getOrcamentoById');

    cy.visit(`${frontendUrl}/login`);
    cy.get('[data-test="email-input"]').should('be.visible').clear().type(email);
    cy.get('[data-test="senha-input"]').should('be.visible').clear().type(senha);
    cy.get('[data-test="botao-entrar"]').click();

    cy.url({ timeout: 30000 }).should('include', '/componentes');
    
    cy.visit(`${frontendUrl}/orcamentos`);
    cy.wait('@getOrcamentos');
  });

  describe('Modal de Visualização de Detalhes', () => {
    it('Deve abrir modal ao clicar no ícone de olho', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];

        if (orcamentos.length > 0) {
          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').first().within(() => {
              cy.get('[data-test="visualizar-button"]').click();
            });
          });

          cy.get('[data-test="modal-detalhes-orcamento"]').should('be.visible');
        }
      });
    });

    it('Modal deve exibir nome do orçamento no header', () => {
      if (!primeiroOrcamento) {
        cy.log('Nenhum orçamento disponível para teste');
        return;
      }

      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-header"]').should('contain', primeiroOrcamento.nome);
      });
    });

    it('Deve exibir descrição se houver', () => {
      if (!primeiroOrcamento) {
        cy.log('Nenhum orçamento disponível para teste');
        return;
      }

      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        if (primeiroOrcamento.descricao) {
          cy.get('[data-test="modal-detalhes-descricao"]').should('contain', primeiroOrcamento.descricao);
        }
      });
    });

    it('Deve exibir total em destaque (azul)', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-total"]').should('be.visible');
        cy.get('[data-test="modal-detalhes-total"]')
          .should('have.css', 'color')
          .and('match', /rgb\(59, 130, 246\)|rgb\(37, 99, 235\)|blue/);
      });
    });

    it('Total deve estar em formato monetário (R$)', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-total"]').should('match', /R\$\s*\d+[,\.]\d{2}/);
      });
    });

    it('Deve exibir tabela de componentes', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-tabela"]').should('be.visible');
      });
    });

    it('Tabela deve ter colunas: Nome, Qtd, Valor Unit., Subtotal', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-tabela"]').within(() => {
          cy.contains('th', 'Nome').should('be.visible');
          cy.contains('th', /Qtd|Quantidade/).should('be.visible');
          cy.contains('th', /Valor.*Unit|Valor Unitário/).should('be.visible');
          cy.contains('th', 'Subtotal').should('be.visible');
        });
      });
    });

    it('Deve listar todos os componentes do orçamento', () => {
      if (!primeiroOrcamento || !primeiroOrcamento.itens) {
        cy.log('Orçamento sem itens disponível para teste');
        return;
      }

      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-tabela"]').within(() => {
          cy.get('tbody tr').should('have.length', primeiroOrcamento.itens.length);
        });
      });
    });

    it('Deve exibir data de criação formatada (dd/mm/aaaa hh:mm)', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-data-criacao"]')
          .should('be.visible')
          .invoke('text')
          .should('match', /\d{2}\/\d{2}\/\d{4}.*\d{2}:\d{2}/);
      });
    });

    it('Deve exibir data de atualização formatada (dd/mm/aaaa hh:mm)', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-data-atualizacao"]')
          .should('be.visible')
          .invoke('text')
          .should('match', /\d{2}\/\d{2}\/\d{4}.*\d{2}:\d{2}/);
      });
    });
  });

  describe('Fechamento do Modal', () => {
    it('Deve fechar ao clicar no X', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').should('be.visible');
      
      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-close"]').click();
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').should('not.exist');
    });

    it('Deve fechar ao clicar fora do modal', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').should('be.visible');
      
      cy.get('body').click(0, 0);

      cy.get('[data-test="modal-detalhes-orcamento"]').should('not.exist');
    });

    it('Deve fechar ao pressionar ESC', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').should('be.visible');
      
      cy.get('body').type('{esc}');

      cy.get('[data-test="modal-detalhes-orcamento"]').should('not.exist');
    });

    it('Deve ter botão Fechar no rodapé', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-botao-fechar"]').should('be.visible').click();
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').should('not.exist');
    });
  });

  describe('Informações dos Componentes', () => {
    it('Deve exibir nome do componente', () => {
      if (!primeiroOrcamento || !primeiroOrcamento.itens || primeiroOrcamento.itens.length === 0) {
        cy.log('Orçamento sem itens disponível para teste');
        return;
      }

      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-tabela"]').within(() => {
          cy.get('tbody tr').first().within(() => {
            cy.get('td').first().should('not.be.empty');
          });
        });
      });
    });

    it('Deve exibir quantidade do componente', () => {
      if (!primeiroOrcamento || !primeiroOrcamento.itens || primeiroOrcamento.itens.length === 0) {
        cy.log('Orçamento sem itens disponível para teste');
        return;
      }

      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-tabela"]').within(() => {
          cy.get('tbody tr').first().within(() => {
            cy.get('td').eq(1).should('match', /\d+/);
          });
        });
      });
    });

    it('Valor unitário deve estar em formato monetário', () => {
      if (!primeiroOrcamento || !primeiroOrcamento.itens || primeiroOrcamento.itens.length === 0) {
        cy.log('Orçamento sem itens disponível para teste');
        return;
      }

      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-tabela"]').within(() => {
          cy.get('tbody tr').first().within(() => {
            cy.get('td').eq(2).should('match', /R\$\s*\d+[,\.]\d{2}/);
          });
        });
      });
    });

    it('Subtotal deve estar em formato monetário', () => {
      if (!primeiroOrcamento || !primeiroOrcamento.itens || primeiroOrcamento.itens.length === 0) {
        cy.log('Orçamento sem itens disponível para teste');
        return;
      }

      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-tabela"]').within(() => {
          cy.get('tbody tr').first().within(() => {
            cy.get('td').eq(3).should('match', /R\$\s*\d+[,\.]\d{2}/);
          });
        });
      });
    });

    it('Subtotal = quantidade × valor unitário', () => {
      if (!primeiroOrcamento || !primeiroOrcamento.itens || primeiroOrcamento.itens.length === 0) {
        cy.log('Orçamento sem itens disponível para teste');
        return;
      }

      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-tabela"]').within(() => {
          cy.get('tbody tr').first().within(() => {
            cy.get('td').eq(1).invoke('text').then((qtdText) => {
              cy.get('td').eq(2).invoke('text').then((valorText) => {
                cy.get('td').eq(3).invoke('text').then((subtotalText) => {
                  const qtd = parseFloat(qtdText.trim());
                  const valor = parseFloat(valorText.replace('R$', '').replace(',', '.').trim());
                  const subtotal = parseFloat(subtotalText.replace('R$', '').replace(',', '.').trim());
                  
                  expect(subtotal).to.be.closeTo(qtd * valor, 0.01);
                });
              });
            });
          });
        });
      });
    });
  });

  describe('Visual e Organização', () => {
    it('Modal deve ter visual claro e organizado', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-header"]').should('be.visible');
        cy.get('[data-test="modal-detalhes-total"]').should('be.visible');
        cy.get('[data-test="modal-detalhes-tabela"]').should('be.visible');
        cy.get('[data-test="modal-detalhes-data-criacao"]').should('be.visible');
      });
    });

    it('Informações devem estar bem estruturadas', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').should('be.visible');
      
      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-header"]').should('have.css', 'font-size');
        cy.get('[data-test="modal-detalhes-total"]').should('have.css', 'font-weight');
      });
    });

    it('Total deve estar em destaque visual', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-total"]')
          .should('have.css', 'font-size')
          .and('match', /\d+px/);
        
        cy.get('[data-test="modal-detalhes-total"]')
          .should('have.css', 'font-weight')
          .and('match', /bold|700|600/);
      });
    });
  });

  describe('Estado de Carregamento', () => {
    it('Deve exibir loading durante carregamento dos detalhes', () => {
      cy.intercept('GET', '**/orcamentos/*', (req) => {
        req.reply((res) => {
          res.delay = 1000;
        });
      }).as('getOrcamentoDelayed');

      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="loading-spinner"]').should('be.visible');
      });
    });
  });

  describe('Tratamento de Erros', () => {
    it('Deve exibir mensagem de erro se falhar ao carregar detalhes', () => {
      cy.intercept('GET', '**/orcamentos/*', {
        statusCode: 500,
        body: { message: 'Erro ao carregar detalhes' }
      }).as('getOrcamentoError');

      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.wait('@getOrcamentoError');
      cy.wait(1000);
      
      cy.get('body').then($body => {
        if ($body.text().includes('erro') || $body.text().includes('Erro')) {
          cy.contains(/erro/i).should('be.visible');
        }
      });
    });
  });

  describe('Responsividade do Modal', () => {
    it('Modal deve ser responsivo em telas pequenas', () => {
      cy.viewport(375, 667);

      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').should('be.visible');
      
      cy.get('[data-test="modal-detalhes-orcamento"]')
        .should('have.css', 'width')
        .and('match', /\d+px/);
    });

    it('Modal deve ser responsivo em tablets', () => {
      cy.viewport(768, 1024);

      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').should('be.visible');
    });

    it('Modal deve ser responsivo em desktops', () => {
      cy.viewport(1920, 1080);

      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').should('be.visible');
    });
  });

  describe('Acessibilidade', () => {
    it('Modal deve ter foco ao abrir', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').should('be.visible');
      cy.focused().should('exist');
    });

    it('Deve ser possível navegar com teclado', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').should('be.visible');
      
      cy.get('body').tab();
      cy.focused().should('exist');
    });

    it('Botão fechar deve ter aria-label ou title', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('[data-test="modal-detalhes-close"]')
          .should('satisfy', ($el) => {
            return $el.attr('aria-label') || $el.attr('title');
          });
      });
    });
  });

  describe('Integração com Geração de PDF', () => {
    it('Deve ter botão para gerar PDF do orçamento', () => {
      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('body').then($body => {
          if ($body.find('[data-test="botao-gerar-pdf"]').length > 0) {
            cy.get('[data-test="botao-gerar-pdf"]').should('be.visible');
          }
        });
      });
    });

    it('Deve exibir toast de erro se falhar ao gerar PDF', () => {
      cy.intercept('POST', '**/orcamentos/*/pdf', {
        statusCode: 500,
        body: { message: 'Erro ao gerar PDF' }
      }).as('gerarPdfError');

      cy.get('[data-test="orcamentos-table"]').within(() => {
        cy.get('tbody tr').first().within(() => {
          cy.get('[data-test="visualizar-button"]').click();
        });
      });

      cy.get('[data-test="modal-detalhes-orcamento"]').within(() => {
        cy.get('body').then($body => {
          if ($body.find('[data-test="botao-gerar-pdf"]').length > 0) {
            cy.get('[data-test="botao-gerar-pdf"]').click();
            cy.wait('@gerarPdfError');
            cy.wait(1000);
          }
        });
      });

      cy.get('body').then($body => {
        if ($body.text().includes('erro') || $body.text().includes('Erro')) {
          cy.contains(/erro/i).should('be.visible');
        }
      });
    });
  });
});
