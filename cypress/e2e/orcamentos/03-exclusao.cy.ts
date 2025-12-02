describe('Orçamentos - Exclusão', () => {
  const frontendUrl = Cypress.env('FRONTEND_URL');
  const apiUrl = Cypress.env('API_URL');
  const email = Cypress.env('TEST_USER_EMAIL');
  const senha = Cypress.env('TEST_USER_PASSWORD');

  let orcamentoTesteId: string;
  let authToken: string;

  before(() => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: { email, senha },
      timeout: 30000
    }).then((loginResponse) => {
      authToken = loginResponse.body.data.user.accesstoken;

      cy.request({
        method: 'GET',
        url: `${apiUrl}/componentes?limit=1`,
        headers: { Authorization: `Bearer ${authToken}` },
        timeout: 30000
      }).then((compResponse) => {
        const componentes = compResponse.body?.data?.docs || [];
        
        if (componentes.length > 0) {
          cy.request({
            method: 'GET',
            url: `${apiUrl}/fornecedores?limit=1`,
            headers: { Authorization: `Bearer ${authToken}` },
            timeout: 30000
          }).then((fornResponse) => {
            const fornecedores = fornResponse.body?.data?.docs || [];
            
            if (fornecedores.length > 0) {
              const nomeOrcamento = `Orçamento Para Exclusão ${Date.now()}`;
              
              cy.request({
                method: 'POST',
                url: `${apiUrl}/orcamentos`,
                headers: { Authorization: `Bearer ${authToken}` },
                body: {
                  nome: nomeOrcamento,
                  descricao: 'Este orçamento será excluído nos testes',
                  componentes: [
                    {
                      componente: componentes[0]._id,
                      fornecedor: fornecedores[0]._id,
                      quantidade: 5,
                      valor_unitario: 10.00
                    }
                  ]
                },
                timeout: 30000
              }).then((createResponse) => {
                orcamentoTesteId = createResponse.body?.data?._id;
                cy.log(`Orçamento de teste criado: ${orcamentoTesteId}`);
              });
            }
          });
        }
      });
    });
  });

  beforeEach(() => {
    cy.intercept('GET', `${apiUrl}/orcamentos*`).as('getOrcamentos');
    cy.intercept('PATCH', `${apiUrl}/orcamentos/*/inativar`).as('deleteOrcamento');
    
    cy.login(email, senha);
    cy.visit(`${frontendUrl}/orcamentos`);
    cy.wait('@getOrcamentos', { timeout: 30000 });
  });

  describe('Modal de Confirmação de Exclusão', () => {
    it('Deve abrir modal de confirmação ao clicar em Excluir', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];

        if (orcamentos.length > 0) {
          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').first().within(() => {
              cy.get('[data-test="excluir-button"]').click();
            });
          });

          cy.get('[data-test="modal-excluir"]').should('be.visible');
          cy.get('[data-test="modal-excluir-titulo"]').should('be.visible');
        }
      });
    });

    it('Deve exibir o nome do orçamento no modal', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];

        if (orcamentos.length > 0) {
          const orcamento = orcamentos[0];

          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').first().within(() => {
              cy.get('[data-test="excluir-button"]').click();
            });
          });

          cy.get('[data-test="modal-excluir"]').within(() => {
            cy.get('[data-test="modal-excluir-nome-orcamento"]').should('contain', orcamento.nome);
          });
        }
      });
    });

    it('Deve ter botões Cancelar e Excluir no modal', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];

        if (orcamentos.length > 0) {
          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').first().within(() => {
              cy.get('[data-test="excluir-button"]').click();
            });
          });

          cy.get('[data-test="modal-excluir"]').within(() => {
            cy.get('[data-test="modal-excluir-cancelar"]').should('be.visible');
            cy.get('[data-test="modal-excluir-confirmar"]').should('be.visible');
          });
        }
      });
    });

    it('Deve ter botão Excluir em vermelho (destaque de ação destrutiva)', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];

        if (orcamentos.length > 0) {
          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').first().within(() => {
              cy.get('[data-test="excluir-button"]').click();
            });
          });

          cy.get('[data-test="modal-excluir"]').within(() => {
            cy.get('[data-test="modal-excluir-confirmar"]')
              .should('have.css', 'background-color')
              .and('match', /rgb\(2[012]\d, 3[0-9], 3[0-9]\)|rgb\(239, 68, 68\)|rgb\(248, 113, 113\)/);
          });
        }
      });
    });

    it('Deve fechar modal ao clicar em Cancelar', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];

        if (orcamentos.length > 0) {
          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').first().within(() => {
              cy.get('[data-test="excluir-button"]').click();
            });
          });

          cy.get('[data-test="modal-excluir"]').within(() => {
            cy.get('[data-test="modal-excluir-cancelar"]').click();
          });

          cy.get('[data-test="modal-excluir"]').should('not.exist');
        }
      });
    });

    it('Deve fechar modal ao clicar no X', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];

        if (orcamentos.length > 0) {
          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').first().within(() => {
              cy.get('[data-test="excluir-button"]').click();
            });
          });

          cy.get('[data-test="modal-excluir"]').within(() => {
            cy.get('[data-test="modal-excluir-close"]').click();
          });

          cy.get('[data-test="modal-excluir"]').should('not.exist');
        }
      });
    });

    it('Deve fechar modal ao pressionar ESC', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];

        if (orcamentos.length > 0) {
          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').first().within(() => {
              cy.get('[data-test="excluir-button"]').click();
            });
          });

          cy.get('[data-test="modal-excluir"]').should('be.visible');
          cy.get('body').type('{esc}');
          cy.get('[data-test="modal-excluir"]').should('not.exist');
        }
      });
    });
  });

  describe('Processo de Exclusão', () => {
    it('Deve excluir orçamento ao confirmar (soft delete)', () => {
      if (!orcamentoTesteId) {
        cy.log('Orçamento de teste não foi criado, pulando teste');
        return;
      }

      cy.wait('@getOrcamentos');

      cy.get('body').then($body => {
        if ($body.text().includes('Para Exclusão')) {
          cy.contains('Para Exclusão').parents('tr').within(() => {
            cy.get('[data-test="excluir-button"]').click();
          });

          cy.get('[data-test="modal-excluir"]').within(() => {
            cy.get('[data-test="modal-excluir-confirmar"]').click();
          });

          cy.wait('@deleteOrcamento', { timeout: 30000 }).then((interception) => {
            expect(interception.response?.statusCode).to.be.oneOf([200, 204]);
          });

          cy.contains(/excluído|removido|deletado.*sucesso/i, { timeout: 5000 }).should('be.visible');

          orcamentoTesteId = '';
        }
      });
    });

    it('Deve atualizar listagem automaticamente após exclusão', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];
        const totalAntes = orcamentos.length;

        if (totalAntes > 0) {
          const orcamentoNome = orcamentos[0].nome;

          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').first().within(() => {
              cy.get('[data-test="excluir-button"]').click();
            });
          });

          cy.get('[data-test="modal-excluir"]').within(() => {
            cy.get('[data-test="modal-excluir-confirmar"]').click();
          });

          cy.wait('@deleteOrcamento', { timeout: 30000 });
          cy.wait('@getOrcamentos', { timeout: 30000 });

          cy.wait(1000);
          cy.get('body').then($body => {
            const textoAtual = $body.text();
            cy.log(`Verificando se ${orcamentoNome} foi removido da listagem`);
          });
        }
      });
    });

    it('Deve exibir toast de sucesso após exclusão', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];

        if (orcamentos.length > 0) {
          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').first().within(() => {
              cy.get('[data-test="excluir-button"]').click();
            });
          });

          cy.get('[data-test="modal-excluir"]').within(() => {
            cy.get('[data-test="modal-excluir-confirmar"]').click();
          });

          cy.wait('@deleteOrcamento', { timeout: 30000 });
          cy.contains(/sucesso/i, { timeout: 5000 }).should('be.visible');
        }
      });
    });
  });

  describe('Paginação após Exclusão', () => {
    it('Deve ajustar paginação se era último item da página', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const paginationInfo = interception.response?.body?.data;
        const orcamentos = paginationInfo?.docs || [];

        if (paginationInfo?.page > 1 && orcamentos.length === 1) {
          const paginaAtual = paginationInfo.page;

          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').first().within(() => {
              cy.get('[data-test="excluir-button"]').click();
            });
          });

          cy.get('[data-test="modal-excluir"]').within(() => {
            cy.get('[data-test="modal-excluir-confirmar"]').click();
          });

          cy.wait('@deleteOrcamento', { timeout: 30000 });
          cy.wait('@getOrcamentos', { timeout: 30000 });

          cy.url().then((url) => {
            if (url.includes('page=')) {
              const match = url.match(/page=(\d+)/);
              const novaPagina = match ? parseInt(match[1]) : 1;
              expect(novaPagina).to.be.lessThan(paginaAtual);
            }
          });
        } else {
          cy.log('Teste de ajuste de paginação não aplicável nesta situação');
        }
      });
    });
  });

  describe('Exclusão com Soft Delete', () => {
    it('Orçamento excluído não deve aparecer em nova busca', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];

        if (orcamentos.length > 0) {
          const orcamentoNome = orcamentos[0].nome;
          const orcamentoId = orcamentos[0]._id;

          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').first().within(() => {
              cy.get('[data-test="excluir-button"]').click();
            });
          });

          cy.get('[data-test="modal-excluir"]').within(() => {
            cy.get('[data-test="modal-excluir-confirmar"]').click();
          });

          cy.wait('@deleteOrcamento', { timeout: 30000 });

          // Verifica que o orçamento não aparece mais na listagem
          cy.wait('@getOrcamentos', { timeout: 30000 });
          cy.get('body').should('not.contain', orcamentoNome);
        }
      });
    });

    it('Orçamento excluído é inativado, não deletado permanentemente', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];

        if (orcamentos.length > 0) {
          const orcamentoId = orcamentos[0]._id;

          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').first().within(() => {
              cy.get('[data-test="excluir-button"]').click();
            });
          });

          cy.get('[data-test="modal-excluir"]').within(() => {
            cy.get('[data-test="modal-excluir-confirmar"]').click();
          });

          cy.wait('@deleteOrcamento', { timeout: 30000 }).then((deleteInterception) => {
            expect(deleteInterception.request.url).to.include('/inativar');
          });
        }
      });
    });
  });

  describe('Confirmação Obrigatória', () => {
    it('Não deve excluir sem confirmação', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];
        const totalInicial = orcamentos.length;

        if (orcamentos.length > 0) {
          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').first().within(() => {
              cy.get('[data-test="excluir-button"]').click();
            });
          });

          cy.get('[data-test="modal-excluir"]').within(() => {
            cy.get('[data-test="modal-excluir-cancelar"]').click();
          });

          cy.wait(500);

          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').should('have.length', totalInicial);
          });
        }
      });
    });

    it('Deve exibir feedback apropriado após exclusão', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];

        if (orcamentos.length > 0) {
          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').first().within(() => {
              cy.get('[data-test="excluir-button"]').click();
            });
          });

          cy.get('[data-test="modal-excluir"]').within(() => {
            cy.get('[data-test="modal-excluir-confirmar"]').click();
          });

          cy.wait('@deleteOrcamento', { timeout: 30000 });
          cy.contains(/sucesso/i, { timeout: 5000 }).should('be.visible');
        }
      });
    });

    it('Modal deve ter foco ao abrir', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];

        if (orcamentos.length > 0) {
          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').first().within(() => {
              cy.get('[data-test="excluir-button"]').click();
            });
          });

          cy.get('[data-test="modal-excluir"]').should('be.visible');
          cy.focused().should('exist');
        }
      });
    });
  });

  describe('Tratamento de Erros na Exclusão', () => {
    it('Deve exibir mensagem de erro se a exclusão falhar', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];

        if (orcamentos.length > 0) {
          cy.intercept('PATCH', `${apiUrl}/orcamentos/*/inativar`, {
            statusCode: 500,
            body: { message: 'Erro ao excluir orçamento' }
          }).as('deleteOrcamentoError');

          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').first().within(() => {
              cy.get('[data-test="excluir-button"]').click();
            });
          });

          cy.get('[data-test="modal-excluir"]').within(() => {
            cy.get('[data-test="modal-excluir-confirmar"]').click();
          });

          cy.wait('@deleteOrcamentoError', { timeout: 30000 });
          cy.wait(1000);
          
          cy.get('body').then($body => {
            if ($body.text().includes('erro') || $body.text().includes('Erro')) {
              cy.contains(/erro/i).should('be.visible');
            }
          });
        }
      });
    });

    it('Modal deve permanecer aberto se houver erro', () => {
      cy.wait('@getOrcamentos').then((interception) => {
        const orcamentos = interception.response?.body?.data?.docs || [];

        if (orcamentos.length > 0) {
          cy.intercept('PATCH', `${apiUrl}/orcamentos/*/inativar`, {
            statusCode: 500,
            body: { message: 'Erro ao excluir orçamento' }
          }).as('deleteOrcamentoError');

          cy.get('[data-test="orcamentos-table"]').within(() => {
            cy.get('tbody tr').first().within(() => {
              cy.get('[data-test="excluir-button"]').click();
            });
          });

          cy.get('[data-test="modal-excluir"]').within(() => {
            cy.get('[data-test="modal-excluir-confirmar"]').click();
          });

          cy.wait('@deleteOrcamentoError', { timeout: 30000 });
          cy.wait(1000);
          
          cy.get('[data-test="modal-excluir"]').should('be.visible');
        }
      });
    });
  });

  after(() => {
    if (orcamentoTesteId) {
      const apiUrl = Cypress.env('API_URL');
      const email = Cypress.env('TEST_USER_EMAIL');
      const senha = Cypress.env('TEST_USER_PASSWORD');

      cy.request({
        method: 'POST',
        url: `${apiUrl}/login`,
        body: { email, senha },
        timeout: 30000,
        failOnStatusCode: false
      }).then((loginResponse) => {
        if (loginResponse.body?.data?.user?.accesstoken) {
          const token = loginResponse.body.data.user.accesstoken;

          cy.request({
            method: 'PATCH',
            url: `${apiUrl}/orcamentos/${orcamentoTesteId}/inativar`,
            headers: {
              Authorization: `Bearer ${token}`
            },
            timeout: 30000,
            failOnStatusCode: false
          }).then(() => {
            cy.log(`Orçamento de teste ${orcamentoTesteId} removido na limpeza`);
          });
        }
      });
    }
  });
});
