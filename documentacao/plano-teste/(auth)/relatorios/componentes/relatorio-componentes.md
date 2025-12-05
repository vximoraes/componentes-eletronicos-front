# Plano de Teste - Relatórios de Componentes

**Estoque Inteligente - Sistema de Gestão de Componentes Eletrônicos**

## 1 - Introdução

Este documento descreve o plano de testes para a funcionalidade de Relatórios de Componentes do sistema Estoque Inteligente. A tela de relatórios permite visualizar, filtrar, pesquisar e exportar dados dos componentes eletrônicos cadastrados no sistema.

## 2 - Arquitetura

O sistema utiliza Next.js 15 com App Router como framework principal para o frontend, que possui uma arquitetura orientada a componentes com React 19. A aplicação implementa Server-Side Rendering (SSR) e Client-Side Rendering (CSR) conforme necessário.

**Stack Tecnológica:**
- **Frontend:** Next.js 15, React 19, TypeScript
- **Estilização:** TailwindCSS 4
- **Gerenciamento de Estado:** React Query (TanStack Query v5)
- **Validação de Formulários:** React Hook Form + Zod
- **Autenticação:** NextAuth.js v4
- **UI Components:** Radix UI
- **Notificações:** React Toastify
- **Testes E2E:** Cypress
- **Containerização:** Docker

## 3 - Categorização dos Requisitos em Funcionais x Não Funcionais

| Requisito Funcional | Requisito Não Funcional |
|---------------------|-------------------------|
| RF001 – O sistema deve exibir uma tabela com os componentes cadastrados contendo código, nome, quantidade, status e localização. | NF001 – O sistema deve exibir mensagens de feedback (toast notifications) |
| RF002 – O sistema deve permitir filtrar componentes por status (Em Estoque, Baixo Estoque, Indisponível). | NF002 – O sistema deve implementar proteção de rotas autenticadas |
| RF003 – O sistema deve permitir filtrar componentes por categoria. | NF003 – O sistema deve ser acessível via navegadores modernos |
| RF004 – O sistema deve exibir cards de estatísticas com total de componentes, em estoque, baixo estoque e indisponíveis. | |
| RF005 – O sistema deve permitir pesquisar componentes pelo nome. | |
| RF006 – O sistema deve permitir selecionar componentes individualmente ou todos de uma vez através de checkboxes. | |
| RF007 – O sistema deve permitir exportar os componentes selecionados em formato PDF ou CSV. | |

## 4 - Casos de Teste

| Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite |
|-----------------|------------------------|--------------|---------------------|
| Cabeçalhos da Tabela | ● Ao acessar a tela de relatórios de componentes, os cabeçalhos da tabela devem estar visíveis e com as nomenclaturas corretas. | ● Cabeçalho "CÓDIGO" visível <br> ● Cabeçalho "COMPONENTE" visível <br> ● Cabeçalho "QUANTIDADE" visível <br> ● Cabeçalho "STATUS" visível <br> ● Cabeçalho "LOCALIZAÇÃO" visível <br> ● Checkbox de seleção geral visível | ● Todos os cabeçalhos devem estar presentes e legíveis <br> ● Checkbox funcional para seleção |
| Campos das Linhas | ● Ao acessar a tela, todas as linhas de componentes devem exibir os campos corretamente. | ● Campo código visível em cada linha <br> ● Campo nome visível em cada linha <br> ● Campo quantidade visível em cada linha <br> ● Campo localização visível em cada linha | ● Pelo menos uma linha de componente deve existir <br> ● Todos os campos devem ser visíveis |
| Checkboxes de Seleção | ● Ao clicar no checkbox mãe (selecionar todos), todos os checkboxes individuais devem ser ativados. <br> ● Ao clicar novamente, todos devem ser desativados. | ● Checkbox mãe inicia desmarcado <br> ● Ao marcar checkbox mãe, todos os itens são selecionados <br> ● Ao desmarcar checkbox mãe, todos os itens são desmarcados | ● Comportamento sincronizado entre checkbox mãe e filhos |
| Filtro por Status | ● Ao aplicar o filtro de status, somente componentes com o status selecionado devem ser exibidos. | ● Botão de filtros visível <br> ● Dropdown de status visível <br> ● Opções de status disponíveis (Em Estoque, Baixo Estoque, Indisponível) <br> ● Tag de filtro aplicado visível | ● Resultados filtrados correspondem ao status selecionado <br> ● Tag de filtro exibe o status aplicado |
| Filtro por Categoria | ● Ao aplicar o filtro de categoria, somente componentes da categoria selecionada devem ser exibidos. | ● Botão de filtros visível <br> ● Dropdown de categoria visível <br> ● Opções de categorias disponíveis | ● Resultados filtrados correspondem à categoria selecionada <br> ● Tag de filtro exibe a categoria aplicada |
| Estatísticas | ● Ao acessar a tela, os cards de estatísticas devem exibir as informações corretas. | ● Card "Total de componentes" visível <br> ● Card "Em estoque" visível <br> ● Card "Baixo estoque" visível <br> ● Card "Indisponível" visível | ● Todos os 4 cards de estatísticas devem estar presentes <br> ● Textos descritivos corretos em cada card |
| Pesquisa por Nome | ● Ao digitar o nome de um componente no campo de busca, somente componentes correspondentes devem ser exibidos. | ● Campo de busca visível <br> ● Resultados filtrados pelo nome digitado | ● Componentes exibidos correspondem ao termo pesquisado |
| Botão Exportar Desabilitado | ● O botão de exportar deve estar desabilitado quando nenhum componente estiver selecionado. | ● Botão de exportar visível <br> ● Botão desabilitado sem seleção | ● Botão não permite interação sem seleção |
| Botão Exportar Habilitado | ● O botão de exportar deve estar habilitado quando ao menos um componente estiver selecionado. | ● Selecionar ao menos um componente <br> ● Botão de exportar habilitado | ● Botão permite interação com seleção |
| Exportar PDF - Campo Vazio | ● Não deve ser possível exportar um PDF se o campo de nome do arquivo estiver vazio. | ● Modal de exportação visível <br> ● Campo de nome limpo <br> ● Formato PDF selecionado <br> ● Botão de exportar desabilitado | ● Sistema impede exportação sem nome de arquivo |
| Exportar CSV - Campo Vazio | ● Não deve ser possível exportar um CSV se o campo de nome do arquivo estiver vazio. | ● Modal de exportação visível <br> ● Campo de nome limpo <br> ● Formato CSV selecionado <br> ● Botão de exportar desabilitado | ● Sistema impede exportação sem nome de arquivo |
| Exportar PDF com Sucesso | ● Deve ser possível exportar um arquivo PDF quando um componente estiver selecionado e o nome do arquivo for preenchido. | ● Componente selecionado <br> ● Modal de exportação aberto <br> ● Nome do arquivo preenchido <br> ● Formato PDF selecionado | ● Arquivo PDF gerado com sucesso <br> ● Nome do arquivo contém o nome informado e a data atual |
| Exportar CSV com Sucesso | ● Deve ser possível exportar um arquivo CSV quando um componente estiver selecionado e o nome do arquivo for preenchido. | ● Componente selecionado <br> ● Modal de exportação aberto <br> ● Nome do arquivo preenchido <br> ● Formato CSV selecionado | ● Arquivo CSV gerado com sucesso <br> ● Nome do arquivo contém o nome informado e a data atual |

## 5 - Estratégia de Teste

### Escopo de Testes

O plano de testes abrange todas as funcionalidades descritas na tabela de casos de teste acima, incluindo visualização de dados, filtragem, pesquisa, seleção e exportação de componentes.

Serão executados testes em todos os níveis conforme a descrição abaixo:

- **Testes Unitários:** O código terá uma cobertura de 60% de testes unitários, que são de responsabilidade dos desenvolvedores.
- **Testes de Integração:** Serão executados testes de integração em todos os endpoints, e esses testes serão de responsabilidade do time de qualidade.
- **Testes Automatizados:** Serão realizados testes end-to-end (E2E) utilizando Cypress para validar todos os casos de teste descritos.
- **Testes Manuais:** Todas as funcionalidades serão testadas manualmente pelo time de qualidade seguindo a documentação de Cenários de teste.

### Ambiente e Ferramentas

Os testes serão feitos no ambiente de homologação, e contém as mesmas configurações do ambiente de produção com uma massa de dados gerada previamente pelo time de qualidade.

As seguintes ferramentas serão utilizadas no teste:

| Ferramenta | Time | Descrição |
|------------|------|-----------|
| Cypress | Qualidade | Ferramenta para testes end-to-end |
| Jest | Desenvolvimento | Framework utilizada para testes unitários |
| React Testing Library | Desenvolvimento | Biblioteca para testes de componentes React |

## 6 - Classificação de Bugs

Os Bugs serão classificados com as seguintes severidades:

| ID | Nível de Severidade | Descrição |
|----|---------------------|-----------|
| 1 | Blocker | ● Bug que bloqueia o teste de uma função ou feature causa crash na aplicação. <br> ● Botão não funciona impedindo o uso completo da funcionalidade. <br> ● Bloqueia a entrega. |
| 2 | Grave | ● Funcionalidade não funciona como o esperado <br> ● Input incomum causa efeitos irreversíveis |
| 3 | Moderada | ● Funcionalidade não atinge certos critérios de aceitação, mas sua funcionalidade em geral não é afetada <br> ● Mensagem de erro ou sucesso não é exibida |
| 4 | Pequena | ● Quase nenhum impacto na funcionalidade porém atrapalha a experiência <br> ● Erro ortográfico <br> ● Pequenos erros de UI |

## 7 - Definição de Pronto

Será considerada pronta as funcionalidades que passarem pelas verificações e testes descritas neste Plano de Teste, não apresentarem bugs com a severidade acima de Minor, e passarem por uma validação de negócio de responsabilidade do time de produto.
