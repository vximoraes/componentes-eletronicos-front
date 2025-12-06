# Plano de Teste - Notificações

**Estoque Inteligente - Sistema de Gestão de Componentes Eletrônicos**

## 1 - Introdução

O Estoque Inteligente é um sistema web de gestão de componentes eletrônicos. O sistema foi criado para gerenciar o ciclo completo de componentes eletrônicos, incluindo cadastro, controle de estoque, movimentações (entradas e saídas), gerenciamento de fornecedores, orçamentos e geração de relatórios. Conta com funcionalidades de autenticação, gerenciamento de usuários, controle de permissões e recursos de exportação de dados. 

Este documento foca especificamente nos testes da funcionalidade de **Notificações**, que alerta os usuários sobre mudanças de status de estoque dos componentes em tempo real.

## 2 - Arquitetura

O sistema utiliza Next.js 15 com App Router como framework principal para o frontend, que possui uma arquitetura orientada a componentes com React 19. A aplicação implementa Server-Side Rendering (SSR) e Client-Side Rendering (CSR) conforme necessário.

**Stack Tecnológica:**
- **Frontend:** Next.js 15, React 19, TypeScript
- **Estilização:** TailwindCSS 4
- **Gerenciamento de Estado:** React Query (TanStack Query v5)
- **Validação de Formulários:** React Hook Form + Zod
- **Autenticação:** NextAuth.js v4
- **UI Components:** Radix UI
- **Notificações em Tempo Real:** Server-Sent Events (SSE)
- **Notificações Toast:** React Toastify
- **Testes E2E:** Cypress
- **Containerização:** Docker

Para o armazenamento, consulta e alteração de dados da aplicação, o sistema consome uma API REST que disponibiliza endpoints para todas as entidades do sistema (componentes, fornecedores, orçamentos, usuários, movimentações, etc.). A comunicação é feita através de requisições HTTP com autenticação via Bearer Token, retornando dados em formato JSON.

**Fluxo de Notificações:**
1. Movimentação de estoque (entrada/saída) → API processa
2. Sistema verifica mudança de status do componente
3. Se houve mudança de status → Notificação gerada
4. SSE (Server-Sent Events) envia notificação em tempo real
5. Frontend atualiza UI e exibe notificação ao usuário

**Regras de Status de Estoque:**
- **Em Estoque:** Quantidade >= 5 unidades (estoque mínimo)
- **Baixo Estoque:** Quantidade entre 1 e 4 unidades
- **Indisponível:** Quantidade = 0 unidades


## 3 - Categorização dos Requisitos em Funcionais x Não Funcionais

Requisito Funcional    | Requisito Não Funcional |
-----------|--------|
RF001 – O sistema deve permitir o cadastro de usuários pelo admin: nome, e-mail único e senha segura, que será redefinida pelo usuário através do e-mail. | NF001 – O sistema deve exibir mensagens de feedback (toast notifications)
RF002 – O sistema deve permitir que usuários cadastrados acessem suas contas existentes para gerenciar seus componentes, utilizando autenticação segura via JWT. | NF002 – O sistema deve implementar proteção de rotas autenticadas
RF003 – O sistema deve permitir gerenciar componentes com campos essenciais, validando categoria/localização e nome único; ajuste de quantidade só por movimentação. | NF003 – O sistema deve ser acessível via navegadores modernos
RF004 – **O sistema deve gerar alertas automáticos (estoque abaixo do mínimo, indisponibilidade, entradas/saídas), registrá-los e exibí-los aos usuários em tempo real.** | NF004 – O sistema deve atualizar notificações em tempo real via SSE
RF005 – O sistema deve detalhar componentes e atualizar estoque em tempo real. | NF005 – Notificações devem ser persistidas no banco de dados
RF006 – O sistema deve possuir mecanismos de busca e filtragem por nome, status, categoria, localização e fornecedor, permitindo consultas rápidas e precisas. | NF006 – O sistema deve distinguir visualmente notificações lidas e não lidas
RF007 – O sistema deve permitir a criação de orçamentos, informando nome e componentes com seus devidos campos. |
RF008 – O sistema deve permitir gerenciar categorias, localizações e fornecedores. |
RF009 – O sistema deve permitir visualizar e emitir relatórios de estoque, movimentações e orçamentos. |


### Casos de Teste

Funcionalidades   | Comportamento Esperado | Verificações |  Critérios de Aceite  |
-----------|--------|--------|--------| 
**Cadastro de Componente e Geração de Notificação** | ● Ao cadastrar um novo componente "Componente Teste Notificações" com estoque mínimo de 5 unidades e realizar uma entrada de 10 unidades, o sistema deve gerar uma notificação automática. <br> ● A notificação deve aparecer no ícone de sino no cabeçalho. <br> ● Deve ser possível visualizar a notificação ao clicar no ícone. | ● Componente cadastrado com sucesso <br> ● Entrada de estoque registrada (10 unidades) <br> ● Notificação criada automaticamente <br> ● Pelo menos 1 notificação visível no dropdown <br> ● Contador de notificações atualizado | ● Sistema deve criar notificação somente quando houver mudança de status <br> ● Notificação deve ser exibida em tempo real via SSE <br> ● Interface deve mostrar indicador visual de notificações não lidas

Funcionalidades   | Comportamento Esperado | Verificações |  Critérios de Aceite  |
-----------|--------|--------|--------| 
**Validação de Mensagem de Notificação por Status** | ● Ao realizar uma movimentação que mude o status do componente, o sistema deve gerar notificação com mensagem apropriada. <br> ● Se status final for "Em Estoque" (≥5 unidades): exibir "{nome} está em estoque ({qtd} unidades)" <br> ● Se status final for "Baixo Estoque" (1-4 unidades): exibir "{nome} está com estoque baixo ({qtd} unidades)" <br> ● Se status final for "Indisponível" (0 unidades): exibir "{nome} está indisponível ({qtd} unidades)" <br> ● O sistema deve detectar automaticamente o status inicial e realizar movimentação contrária para gerar mudança de status. | ● Status inicial identificado corretamente <br> ● Movimentação apropriada realizada (entrada ou saída) <br> ● Status alterado após movimentação <br> ● Notificação gerada com mensagem correta <br> ● Quantidade exibida na notificação corresponde à quantidade real <br> ● Mensagem formatada de acordo com o status | ● Notificação só é gerada quando há mudança de status (não em movimentações dentro do mesmo status) <br> ● Mensagem deve ser clara e informativa <br> ● Quantidade deve ser exibida corretamente <br> ● Sistema deve validar regras: Em Estoque (≥5), Baixo Estoque (1-4), Indisponível (0)

Funcionalidades   | Comportamento Esperado | Verificações |  Critérios de Aceite  |
-----------|--------|--------|--------| 
**Marcar Notificação Individual como Vista** | ● Ao clicar em uma notificação não lida, o indicador visual de "não lida" (ponto azul) deve desaparecer. <br> ● O usuário deve poder visualizar notificações e marcar como vistas individualmente. <br> ● Após clicar no indicador de não lida, ele deve ser removido do DOM. | ● Notificação exibida com indicador visual de "não lida" <br> ● Ao clicar no indicador, ele desaparece <br> ● Estado de "vista" persistido <br> ● Notificação permanece na lista, mas sem indicador | ● Indicador visual claro para notificações não lidas <br> ● Clique no indicador deve marcar como lida <br> ● Mudança deve ser refletida imediatamente na UI <br> ● Estado deve ser persistido no backend

Funcionalidades   | Comportamento Esperado | Verificações |  Critérios de Aceite  |
-----------|--------|--------|--------| 
**Marcar Todas as Notificações como Visualizadas** | ● Ao clicar no botão "Marcar todas como visualizadas", todas as notificações não lidas devem ser marcadas como vistas. <br> ● O sistema deve realizar múltiplas movimentações de estoque para gerar diferentes notificações: <br> &nbsp;&nbsp;- Entrada de 15 unidades (status: Em Estoque) <br> &nbsp;&nbsp;- Saída deixando 3 unidades (status: Baixo Estoque) <br> &nbsp;&nbsp;- Saída total (status: Indisponível) <br> ● Deve haver pelo menos 2 notificações não lidas antes de clicar no botão. <br> ● Após clicar, nenhum indicador de "não lida" deve existir. | ● Pelo menos 2 notificações não lidas geradas <br> ● Botão "Marcar todas como visualizadas" visível e funcional <br> ● Ao clicar, todos os indicadores de "não lida" desaparecem <br> ● Notificações permanecem na lista, mas sem indicadores <br> ● Mudança refletida em tempo real | ● Sistema deve suportar marcação em massa <br> ● Todas as notificações não lidas devem ser afetadas <br> ● Interface deve atualizar instantaneamente <br> ● Contador de notificações não lidas deve ser zerado <br> ● Pode haver notificações já lidas misturadas, mas sempre haverá múltiplas não lidas para o teste


## 4 - Estratégia de Teste

### Escopo de Testes

O plano de testes abrange todas as funcionalidades de notificações descritas na tabela acima, focando em:

- **Geração automática de notificações** baseada em mudanças de status de estoque
- **Visualização de notificações** em tempo real via SSE
- **Marcação de notificações** como lidas (individual e em massa)
- **Validação de mensagens** de acordo com os diferentes status de estoque
- **Regras de negócio** para geração de notificações (somente em mudança de status)

Serão executados testes em todos os níveis conforme a descrição abaixo:

**Testes Unitários:** O código terá uma cobertura de 60% de testes unitários, que são de responsabilidade dos desenvolvedores. Focos específicos:
- Funções de formatação de mensagens de notificação
- Lógica de determinação de status baseado em quantidade
- Validação de regras de mudança de status

**Testes de Integração:** Serão executados testes de integração nos endpoints de notificações:
- GET /api/notificacoes (listagem)
- PATCH /api/notificacoes/:id (marcar como lida)
- PATCH /api/notificacoes/marcar-todas-lidas (marcação em massa)
- SSE endpoint para notificações em tempo real

**Testes Automatizados E2E:** Serão realizados testes end-to-end completos cobrindo todos os 4 casos de teste descritos:
1. Cadastro de componente e geração de notificação
2. Validação de mensagem por status
3. Marcar notificação individual como vista
4. Marcar todas as notificações como visualizadas

**Testes Manuais:** Todas as funcionalidades de notificações serão testadas manualmente pelo time de qualidade, incluindo:
- Testes de notificações em tempo real com múltiplos usuários simultâneos
- Validação de persistência de estado de notificações
- Testes de edge cases (múltiplas movimentações rápidas, mudanças de status consecutivas)

**Versão Beta:** Será lançada uma versão beta para 20 usuários pré-cadastrados antes do release, com foco em:
- Experiência de uso de notificações em cenários reais
- Performance de SSE com múltiplos usuários
- Feedback sobre clareza das mensagens e UI


### Ambiente e Ferramentas

Os testes serão feitos no ambiente de homologação, que contém as mesmas configurações do ambiente de produção com uma massa de dados gerada previamente pelo time de qualidade.

As seguintes ferramentas serão utilizadas no teste:

Ferramenta | Time | Descrição 
-----------|--------|--------
**Cypress** | Qualidade | Framework para testes E2E automatizados das notificações
**Postman** | Qualidade | Ferramenta para testes de API (endpoints de notificações)
**Jest/React Testing Library** | Desenvolvimento | Framework utilizada para testes unitários de componentes React
**EventSource Monitor** | Qualidade | Ferramenta para monitorar conexões SSE em tempo real


## 5 - Classificação de Bugs

Os Bugs serão classificados com as seguintes severidades:

ID | Nível de Severidade | Descrição 
-----------|--------|--------
1 | **Blocker** | ● Notificações não são geradas após movimentações de estoque <br> ● SSE não funciona, impedindo notificações em tempo real <br> ● Sistema trava ao abrir dropdown de notificações <br> ● Bloqueia a entrega
2 | **Grave** | ● Notificação gerada com mensagem incorreta (status errado) <br> ● Marcação de "lida" não persiste após refresh da página <br> ● Contador de notificações não atualiza após marcar como lida <br> ● Botão "Marcar todas como visualizadas" não funciona
3 | **Moderada** | ● Notificação é gerada mesmo sem mudança de status <br> ● Delay excessivo (>3s) na exibição de notificações <br> ● Indicador de não lida não desaparece imediatamente ao clicar <br> ● Mensagem de notificação não formatada corretamente
4 | **Pequena** | ● Erro ortográfico em mensagens de notificação <br> ● Pequenos erros de alinhamento no dropdown de notificações <br> ● Animação do ícone de sino com pequenos glitches <br> ● Espaçamento inconsistente entre itens de notificação


## 6 - Definição de Pronto

Será considerada pronta a funcionalidade de notificações quando:

1. **Todos os 4 casos de teste automatizados passarem** sem erros no Cypress
2. **Testes de integração dos endpoints de notificações** retornarem 100% de sucesso
3. **Não apresentarem bugs com severidade acima de Moderada** (Blocker e Grave devem ser 0)
4. **Testes manuais validarem**:
   - Notificações em tempo real funcionando com múltiplos usuários
   - Persistência de estado (lida/não lida) após refresh
   - Mensagens corretas para todos os status de estoque
   - Performance adequada (notificações aparecem em <2s)
5. **Passarem por validação de negócio** de responsabilidade do time de produto, verificando:
   - Clareza das mensagens de notificação
   - Usabilidade da interface de notificações
   - Regras de geração de notificações atendem aos requisitos
6. **Cobertura de código >= 60%** nos componentes relacionados a notificações
7. **Feedback positivo de pelo menos 80% dos usuários beta** sobre a funcionalidade de notificações
