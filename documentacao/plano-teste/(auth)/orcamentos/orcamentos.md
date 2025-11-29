# Plano de Teste - Tela de Orçamentos

**Estoque Inteligente - Sistema de Gestão de Componentes Eletrônicos**

## 1 - Introdução

A tela de Orçamentos permite ao usuário gerenciar orçamentos de projetos que utilizam componentes eletrônicos. Possibilita criar, visualizar, editar, excluir orçamentos e exportar em formato PDF. Cada orçamento contém uma lista de componentes com seus respectivos fornecedores, quantidades e valores, calculando automaticamente o total do orçamento.

## 2 - Arquitetura

A tela utiliza Next.js 15 com App Router e React 19 para renderização client-side. O gerenciamento de estado é feito com React Query (TanStack Query v5) que controla cache, refetch e estados de loading. A comunicação com o backend é feita através de requisições HTTP autenticadas com JWT via NextAuth.js, retornando dados paginados em formato JSON. A validação de formulários utiliza React Hook Form + Zod, e as notificações são exibidas com React Toastify.

**Fluxo de Dados:**
1. Cliente solicita dados → React Query verifica cache
2. Se não houver cache válido → Requisição HTTP com Bearer Token
3. API retorna JSON paginado
4. React Query atualiza cache e estado
5. Interface é atualizada automaticamente

## 3 - Categorização dos Requisitos em Funcionais x Não Funcionais

Requisito Funcional | Requisito Não Funcional
-----------|--------
RF001 – O sistema deve permitir o cadastro de usuários pelo admin: nome, e-mail único e senha segura, que será redefinida pelo usuário através do e-mail. | NF001 – O sistema deve exibir mensagens de feedback (toast notifications)
RF002 – O sistema deve permitir que usuários cadastrados acessem suas contas existentes para gerenciar seus componentes, utilizando autenticação segura via JWT. | NF002 – O sistema deve implementar proteção de rotas autenticadas
RF003 – O sistema deve permitir gerenciar componentes com campos essenciais, validando categoria/localização e nome único; ajuste de quantidade só por movimentação. | NF003 – O sistema deve ser acessível via navegadores modernos
RF004 – O sistema deve gerar alertas automáticos (estoque abaixo do mínimo, indisponibilidade, entradas/saídas), registrá-los e exibí-los aos usuários. | 
RF005 – O sistema deve detalhar componentes e atualizar  estoque em tempo real.
RF006 – O sistema deve possuir mecanismos de busca e filtragem por nome, status, categoria, localização e fornecedor, permitindo consultas rápidas e precisas.
RF007 – O sistema deve permitir a criação de orçamentos, informando nome e componentes com seus devidos campos.
RF008 – O sistema deve permitir gerenciar categorias, localizações e fornecedores.
RF009 – O sistema deve permitir visualizar e emitir relatórios de estoque, movimentações e orçamentos.

## 4 - Estratégia de Teste

### Escopo de Testes

O plano de testes abrange todas as funcionalidades da tela de Orçamentos, incluindo listagem, pesquisa, cadastro, edição, exclusão, visualização de detalhes, exportação de PDF e gerenciamento de componentes do orçamento (seleção, fornecedor, quantidade, valor).

Serão executados testes em todos os níveis conforme a descrição abaixo:

**Testes Unitários:** O código terá uma cobertura de 60% de testes unitários, de responsabilidade dos desenvolvedores.

**Testes de Integração:** Serão executados testes de integração nos endpoints de orçamentos, componentes de orçamento e fornecedores, de responsabilidade do time de qualidade.

**Testes Automatizados:** Serão realizados testes end-to-end com Cypress cobrindo os fluxos principais: listagem, cadastro, edição, exclusão e exportação de PDF.

**Testes Manuais:** Todas as funcionalidades serão testadas manualmente pelo time de qualidade seguindo a documentação de Cenários de teste deste TestPlan.

**Versão Beta:** Será lançada uma versão beta para 20 usuários pré-cadastrados antes do release.

### 4.1 Ambiente e Ferramentas

Os testes serão feitos no ambiente de homologação, que contém as mesmas configurações do ambiente de produção com uma massa de dados gerada previamente pelo time de qualidade.

As seguintes ferramentas serão utilizadas no teste:

---
Ferramenta | Time | Descrição
-----------|------|----------
Cypress | Qualidade | Framework para testes end-to-end automatizados
Postman | Qualidade | Ferramenta para realização de testes de API
Jest | Desenvolvimento | Framework utilizada para testes unitários
React Query DevTools | Desenvolvimento | Ferramenta para debug de queries e cache

### 4.2 Casos de Teste

#### Orçamentos

---
Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite
-----------|--------|--------|--------
Listagem de Orçamentos | ● Ao entrar na tela, o usuário deve visualizar todos os orçamentos cadastrados em formato de tabela. <br> ● A tabela deve exibir colunas: Nome, Descrição, Total e Ações. <br> ● O total deve ser exibido em formato monetário (R$ X,XX). |  ● Colunas com informações corretas <br> ● Formatação monetária aplicada | ● Orçamentos carregados corretamente com suas devidas informações
Pesquisa | ● Ao digitar no campo de pesquisa, deve filtrar orçamentos por nome em tempo real. <br> ● Deve exibir mensagem "Nenhum orçamento encontrado para sua pesquisa." quando não encontrar resultados. <br> ● Ao limpar o campo, deve voltar a exibir todos os orçamentos. | ● Pesquisa em tempo real funcional <br> ● Mensagem quando não há resultados <br> ● Limpar campo restaura listagem | ● Resultados corretos de busca
Adicionar Orçamento | ● Ao clicar em "Adicionar", deve redirecionar para tela de cadastro. <br> ● Formulário com campos: Nome* (máx 100) e Descrição (máx 200, opcional). <br> ● Contadores de caracteres funcionais. <br> ● Tabela de itens do orçamento com colunas: Nome, Fornecedor, Quantidade, Valor Unitário, Subtotal, Ações. <br> ● Total geral calculado automaticamente. <br> ● Após salvar, redirecionar para listagem com toast "Orçamento criado com sucesso!". | ● Nome obrigatório e não vazio <br> ● Máximo 100 caracteres para nome <br> ● Máximo 200 caracteres para descrição <br> ● Contadores de caracteres funcionais <br> ● Pelo menos um componente obrigatório <br> ● Total calculado corretamente <br> ● Toast de confirmação | ● Orçamento cadastrado com sucesso <br> ● Todas as validações funcionando <br> ● Experiência fluida
Seleção de Componentes | ● Ao clicar em "Adicionar componente", deve abrir modal de seleção. <br> ● Modal permite seleção múltipla de componentes. <br> ● Campo de pesquisa para filtrar componentes por nome. <br> ● Componentes exibidos em grid de cards com imagem, nome e categoria. <br> ● Indicador visual dos componentes selecionados (borda azul). <br> ● Contador de componentes selecionados no header do modal. <br> ● Scroll infinito no modal para carregar mais componentes. <br> ● Botão "Adicionar X componentes" habilitado quando há seleção. | ● Modal abre e fecha corretamente <br> ● Seleção múltipla funcional <br> ● Pesquisa filtra componentes <br> ● Visual de seleção claro <br> ● Contador atualiza em tempo real <br> ● Scroll infinito funcional <br> ● Componentes adicionados à tabela | ● Seleção intuitiva <br> ● Múltiplos componentes de uma vez
Seleção de Fornecedor | ● Cada componente deve ter dropdown para selecionar fornecedor. <br> ● Dropdown abre ao clicar no campo. <br> ● Campo de pesquisa dentro do dropdown para filtrar fornecedores. <br> ● Scroll infinito para carregar mais fornecedores. <br> ● Ao selecionar, nome do fornecedor é exibido no campo. <br> ● Fornecedor é obrigatório para salvar o orçamento. | ● Dropdown abre e fecha corretamente <br> ● Pesquisa de fornecedores funcional <br> ● Scroll infinito no dropdown <br> ● Fornecedor selecionado exibido <br> ● Validação de obrigatoriedade | ● Seleção clara e rápida <br> ● Fornecedor obrigatório validado
Quantidade do Componente | ● Campo de quantidade com valor inicial 1. <br> ● Botões + e - para incrementar/decrementar. <br> ● Mínimo 1, máximo 999.999.999. <br> ● Botão - desabilitado quando quantidade = 1. <br> ● Subtotal recalculado automaticamente ao alterar. <br> ● Campo permite digitação direta. | ● Valor inicial 1 <br> ● Botões + e - funcionais <br> ● Limite mínimo 1 respeitado <br> ● Limite máximo respeitado <br> ● Subtotal atualizado <br> ● Digitação direta funciona | ● Quantidade sempre válida <br> ● Cálculos corretos
Valor Unitário | ● Campo numérico para informar valor unitário. <br> ● Aceita valores decimais (2 casas). <br> ● Valor mínimo: 0. <br> ● Subtotal = quantidade × valor unitário. <br> ● Total do orçamento atualizado automaticamente. | ● Campo aceita decimais <br> ● Valor mínimo 0 <br> ● Subtotal calculado corretamente <br> ● Total atualizado em tempo real | ● Valores sempre válidos <br> ● Cálculos precisos
Remover Componente | ● Botão de lixeira para remover componente da tabela. <br> ● Ao remover, total do orçamento é recalculado. <br> ● Se remover todos, exibir mensagem "Nenhum componente adicionado.". | ● Botão de remoção funcional <br> ● Total recalculado <br> ● Mensagem quando lista vazia | ● Remoção sem confirmação <br> ● Cálculos atualizados
Validações no Cadastro | ● Nome é obrigatório, exibir erro se vazio. <br> ● Pelo menos um componente deve ser adicionado. <br> ● Todos componentes devem ter fornecedor selecionado. <br> ● Mensagens de erro via toast. <br> ● Botão "Salvar" desabilitado durante processamento. | ● Erro se nome vazio <br> ● Erro se sem componentes <br> ● Erro se componente sem fornecedor <br> ● Toasts de erro claros <br> ● Estado de loading no botão | ● Validações claras <br> ● Não permite salvar inválido
Editar Orçamento | ● Ao clicar em "Editar" na listagem, redirecionar para tela de edição. <br> ● Campos pré-preenchidos com dados atuais. <br> ● Mesmas validações do cadastro. <br> ● Pode adicionar novos componentes. <br> ● Pode remover componentes existentes. <br> ● Pode alterar fornecedor, quantidade e valor de componentes. <br> ● Ao salvar, exibir toast "Orçamento atualizado com sucesso!" e redirecionar. | ● Dados carregados corretamente <br> ● Validações mantidas <br> ● Adição de componentes funciona <br> ● Remoção de componentes funciona <br> ● Alteração de valores funciona <br> ● Toast de confirmação <br> ● Redirecionamento após salvar | ● Edição completa funcional <br> ● Dados persistidos corretamente
Excluir Orçamento | ● Ao clicar em "Excluir" na listagem, abrir modal de confirmação. <br> ● Modal exibe nome do orçamento. <br> ● Opções: "Cancelar" e "Excluir". <br> ● Ao confirmar, orçamento é inativado (soft delete). <br> ● Exibir toast "Orçamento excluído com sucesso!". <br> ● Lista atualizada automaticamente. | ● Modal de confirmação claro <br> ● Nome do orçamento exibido <br> ● Botão "Excluir" em vermelho <br> ● Cancelamento funciona <br> ● Inativação funcional <br> ● Toast de confirmação <br> ● Listagem atualizada | ● Confirmação obrigatória <br> ● Feedback apropriado <br> ● Orçamento não mais exibido
Visualizar Detalhes | ● Ao clicar no ícone de olho, abrir modal de detalhes. <br> ● Modal exibe nome do orçamento no header. <br> ● Exibe descrição (se houver). <br> ● Exibe total em destaque (azul). <br> ● Tabela de componentes: Nome, Qtd, Valor Unit., Subtotal. <br> ● Exibe datas de criação e atualização. <br> ● Modal fecha ao clicar fora, no X ou tecla ESC. | ● Modal abre corretamente <br> ● Nome e descrição exibidos <br> ● Total em destaque <br> ● Tabela de componentes completa <br> ● Datas formatadas (dd/mm/aaaa hh:mm) <br> ● Fechamento por múltiplas formas | ● Informações completas <br> ● Visual claro e organizado
Cancelar Operação | ● Botão "Cancelar" nas telas de adicionar e editar. <br> ● Ao clicar, redirecionar para listagem sem salvar. <br> ● Dados não são persistidos. | ● Botão cancelar funcional <br> ● Redirecionamento correto <br> ● Dados descartados | ● Navegação clara <br> ● Sem efeitos colaterais
Tratamento de Erros | ● Exibir mensagem de erro se falhar ao carregar orçamentos. <br> ● Toast de erro se falhar ao criar/editar/excluir. <br> ● Toast de erro se falhar ao gerar PDF. <br> ● Mensagens claras e específicas. | ● Erro na listagem exibido <br> ● Toast de erro nas operações <br> ● Mensagens descritivas | ● Usuário informado sobre falhas <br> ● Possibilidade de tentar novamente

## 5 - Classificação de Bugs

Os Bugs serão classificados com as seguintes severidades:

ID | Nivel de Severidade | Descrição
-----------|--------|--------
1 | Blocker | ● Bug que impede completamente o uso da funcionalidade ou causa crash na aplicação. <br>● Exemplos: Listagem não carrega, botão Salvar não funciona, aplicação trava ao abrir modal, perda de dados. <br>● Bloqueia a entrega.
2 | Grave | ● Funcionalidade não funciona como o esperado ou produz resultados incorretos. <br>● Exemplos: Status calculado errado, quantidade não atualiza após entrada, filtros não aplicam, cálculos incorretos.
3 | Moderada | ● Funcionalidade funciona mas não atinge certos critérios de aceitação, mas sua funcionalidade em geral não é afetada. <br>● Exemplos: Mensagem de sucesso não exibida, loading não aparece, paginação com números errados, validação inconsistente.
4 | Pequena | ● Quase nenhum impacto na funcionalidade porém atrapalha a experiência. <br>● Exemplos: Erro ortográfico, pequenos erros de UI, desalinhamento de ícone, cor ligeiramente diferente.

## 6 - Definição de Pronto

Será considerada pronta as funcionalidades que passarem pelas verificações e testes descritas neste TestPlan, não apresentarem bugs com a severidade acima de Moderada, e passarem por uma validação de negócio de responsabilidade do time de produto.
