# Plano de Teste - Relatórios de Orçamentos

**Estoque Inteligente - Sistema de Gestão de Componentes Eletrônicos**

## 1 - Introdução

Este documento descreve o plano de testes para a funcionalidade de Relatórios de Orçamentos do sistema Estoque Inteligente. A tela de relatórios permite visualizar, filtrar por valor e período, pesquisar e exportar dados dos orçamentos cadastrados no sistema.

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
| RF001 – O sistema deve exibir uma tabela com os orçamentos cadastrados contendo código, nome, descrição, itens, valor total e data. | NF001 – O sistema deve exibir mensagens de feedback (toast notifications) |
| RF002 – O sistema deve permitir filtrar orçamentos por valor mínimo e máximo. | NF002 – O sistema deve implementar proteção de rotas autenticadas |
| RF003 – O sistema deve permitir filtrar orçamentos por período (data inicial e data final). | NF003 – O sistema deve ser acessível via navegadores modernos |
| RF004 – O sistema deve ajustar automaticamente datas futuras para a data atual ao aplicar filtros. | |
| RF005 – O sistema deve ajustar a data final para a data inicial quando a data final for menor que a data inicial. | |
| RF006 – O sistema deve exibir cards de estatísticas com total de orçamentos, valor total, maior orçamento e menor orçamento. | |
| RF007 – O sistema deve permitir pesquisar orçamentos pelo nome. | |
| RF008 – O sistema deve permitir selecionar orçamentos individualmente ou todos de uma vez através de checkboxes. | |
| RF009 – O sistema deve permitir exportar os orçamentos selecionados em formato PDF ou CSV. | |

## 4 - Casos de Teste

| Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite |
|-----------------|------------------------|--------------|---------------------|
| Cabeçalhos da Tabela | ● Ao acessar a tela de relatórios de orçamentos, os cabeçalhos da tabela devem estar visíveis e com as nomenclaturas corretas. | ● Cabeçalho "CÓDIGO" visível <br> ● Cabeçalho "NOME" visível <br> ● Cabeçalho "DESCRIÇÃO" visível <br> ● Cabeçalho "ITENS" visível <br> ● Cabeçalho "VALOR TOTAL" visível <br> ● Cabeçalho "DATA" visível <br> ● Checkbox de seleção geral visível | ● Todos os cabeçalhos devem estar presentes e legíveis <br> ● Checkbox funcional para seleção |
| Campos das Linhas | ● Ao acessar a tela, todas as linhas de orçamentos devem exibir os campos corretamente. | ● Campo código visível em cada linha <br> ● Campo nome visível em cada linha <br> ● Campo descrição visível em cada linha <br> ● Campo itens visível em cada linha <br> ● Campo valor total visível em cada linha <br> ● Campo data visível em cada linha | ● Pelo menos uma linha de orçamento deve existir <br> ● Todos os campos devem ser visíveis |
| Checkboxes de Seleção | ● Ao clicar no checkbox mãe (selecionar todos), todos os checkboxes individuais devem ser ativados. <br> ● Ao clicar novamente, todos devem ser desativados. | ● Checkbox mãe inicia desmarcado <br> ● Ao marcar checkbox mãe, todos os itens são selecionados <br> ● Ao desmarcar checkbox mãe, todos os itens são desmarcados | ● Comportamento sincronizado entre checkbox mãe e filhos |
| Pesquisa por Nome | ● Ao digitar o nome de um orçamento no campo de busca, somente orçamentos correspondentes devem ser exibidos. | ● Campo de busca visível <br> ● Resultados filtrados pelo nome digitado | ● Orçamentos exibidos correspondem ao termo pesquisado |
| Estatísticas | ● Ao acessar a tela, os cards de estatísticas devem exibir as informações corretas. | ● Card "Total de orçamentos" visível <br> ● Card "Valor total" visível <br> ● Card "Maior orçamento" visível <br> ● Card "Menor orçamento" visível | ● Todos os 4 cards de estatísticas devem estar presentes <br> ● Textos descritivos corretos em cada card |
| Filtro por Valor Mínimo | ● Ao aplicar o filtro de valor mínimo, somente orçamentos com valor igual ou maior ao informado devem ser exibidos. | ● Botão de filtros visível <br> ● Campo de valor mínimo visível e vazio inicialmente <br> ● Filtro aplicado corretamente | ● Resultados filtrados possuem valor >= ao valor informado |
| Filtro por Valor Máximo | ● Ao aplicar o filtro de valor máximo, somente orçamentos com valor igual ou menor ao informado devem ser exibidos. | ● Botão de filtros visível <br> ● Campo de valor máximo visível e vazio inicialmente <br> ● Filtro aplicado corretamente | ● Resultados filtrados possuem valor <= ao valor informado |
| Filtro por Data Inicial | ● Ao aplicar o filtro de data inicial, somente orçamentos com data igual ou maior à selecionada devem ser exibidos. | ● Dropdown de período visível <br> ● Opção "Personalizado" disponível <br> ● Campo de data inicial visível <br> ● Tag de filtro exibe a data aplicada | ● Resultados filtrados possuem data >= à data informada <br> ● Filtro pode ser removido pela tag |
| Filtro por Data Final | ● Ao aplicar o filtro de data final, somente orçamentos com data igual ou menor à selecionada devem ser exibidos. | ● Dropdown de período visível <br> ● Opção "Personalizado" disponível <br> ● Campo de data final visível <br> ● Tag de filtro exibe a data aplicada | ● Resultados filtrados possuem data <= à data informada <br> ● Filtro pode ser removido pela tag |
| Ajuste de Data Futura | ● Ao selecionar uma data futura no filtro, o sistema deve automaticamente ajustar para a data atual. | ● Data futura inserida no campo <br> ● Filtro aplicado <br> ● Tag exibe a data atual | ● Data futura é convertida para data de hoje <br> ● Sistema não permite consultas com datas futuras |
| Ajuste de Data Final < Data Inicial | ● Ao informar uma data final menor que a data inicial, o sistema deve ajustar a data final para ser igual à data inicial. | ● Data inicial maior que data final informadas <br> ● Filtro aplicado <br> ● Ambas as tags exibem a mesma data | ● Data final é ajustada para ser igual à data inicial <br> ● Sistema mantém consistência nas datas |
| Ajuste de Ambas Datas Futuras | ● Ao informar ambas as datas como futuras, o sistema deve ajustar ambas para a data atual. | ● Data inicial futura informada <br> ● Data final futura informada <br> ● Filtro aplicado | ● Ambas as datas são ajustadas para hoje <br> ● Tags exibem a data atual |
| Botão Exportar Desabilitado | ● O botão de exportar deve estar desabilitado quando nenhum orçamento estiver selecionado. | ● Botão de exportar visível <br> ● Botão desabilitado sem seleção | ● Botão não permite interação sem seleção |
| Botão Exportar Habilitado | ● O botão de exportar deve estar habilitado quando ao menos um orçamento estiver selecionado. | ● Selecionar ao menos um orçamento <br> ● Botão de exportar habilitado | ● Botão permite interação com seleção |
| Exportar PDF - Campo Vazio | ● Não deve ser possível exportar um PDF se o campo de nome do arquivo estiver vazio. | ● Modal de exportação visível <br> ● Campo de nome limpo <br> ● Formato PDF selecionado <br> ● Botão de exportar desabilitado | ● Sistema impede exportação sem nome de arquivo |
| Exportar CSV - Campo Vazio | ● Não deve ser possível exportar um CSV se o campo de nome do arquivo estiver vazio. | ● Modal de exportação visível <br> ● Campo de nome limpo <br> ● Formato CSV selecionado <br> ● Botão de exportar desabilitado | ● Sistema impede exportação sem nome de arquivo |
| Exportar PDF com Sucesso | ● Deve ser possível exportar um arquivo PDF quando um orçamento estiver selecionado e o nome do arquivo for preenchido. | ● Orçamento selecionado <br> ● Modal de exportação aberto <br> ● Nome do arquivo preenchido <br> ● Formato PDF selecionado | ● Arquivo PDF gerado com sucesso <br> ● Nome do arquivo contém o nome informado e a data atual |
| Exportar CSV com Sucesso | ● Deve ser possível exportar um arquivo CSV quando um orçamento estiver selecionado e o nome do arquivo for preenchido. | ● Orçamento selecionado <br> ● Modal de exportação aberto <br> ● Nome do arquivo preenchido <br> ● Formato CSV selecionado | ● Arquivo CSV gerado com sucesso <br> ● Nome do arquivo contém o nome informado e a data atual |

## 5 - Estratégia de Teste

### Escopo de Testes

O plano de testes abrange todas as funcionalidades descritas na tabela de casos de teste acima, incluindo visualização de dados, filtragem por valor e período, validação de datas, pesquisa, seleção e exportação de orçamentos.

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
