# Plano de Teste

**Estoque Inteligente - Sistema de Gestão de Componentes Eletrônicos**

## 1 - Introdução

O Estoque Inteligente é um sistema web de gestão de componentes eletrônicos. O sistema foi criado para gerenciar o ciclo completo de componentes eletrônicos, incluindo cadastro, controle de estoque, movimentações (entradas e saídas), gerenciamento de fornecedores, orçamentos e geração de relatórios. Conta com funcionalidades de autenticação, gerenciamento de usuários, controle de permissões e recursos de exportação de dados. 

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

Para o armazenamento, consulta e alteração de dados da aplicação, o sistema consome uma API REST que disponibiliza endpoints para todas as entidades do sistema (componentes, fornecedores, orçamentos, usuários, movimentações, etc.). A comunicação é feita através de requisições HTTP com autenticação via Bearer Token, retornando dados em formato JSON.

**Fluxo de Arquitetura:**
1. Cliente (Next.js App) → Requisição HTTP com Token JWT
2. API REST → Processa e valida requisição
3. Retorna resposta JSON com dados paginados
4. Cliente atualiza estado e UI usando React Query


## 3 - Categorização dos Requisitos em Funcionais x Não Funcionais

   Requisito Funcional    | Requisito Não Funcional |
-----------|--------|
RF001 – O sistema deve permitir o cadastro de usuários via convite por e-mail | NF001 – O sistema deve ser desenvolvido em Next.js 15 com React 19 |
RF002 – O sistema deve permitir que o usuário realize login com e-mail e senha | NF002 – O sistema deve utilizar TypeScript para type safety |
RF003 – O sistema deve permitir recuperação de senha via e-mail | NF003 – O sistema deve ser responsivo para mobile, tablet e desktop |
RF004 – O sistema deve permitir ativação de conta via link enviado por e-mail | NF004 – O sistema deve ser acessível via navegadores modernos (Chrome, Firefox, Edge, Safari) |
RF005 – O sistema deve permitir o cadastro de componentes eletrônicos | NF005 – O sistema deve implementar autenticação JWT via NextAuth |
RF006 – O sistema deve permitir a edição de componentes eletrônicos | NF006 – O sistema deve validar dados com Zod antes do envio |
RF007 – O sistema deve permitir a exclusão de componentes eletrônicos | NF007 – O sistema deve implementar paginação infinita para listas grandes |
RF008 – O sistema deve permitir o cadastro de categorias para componentes | NF008 – O sistema deve exibir mensagens de feedback (toast notifications) |
RF009 – O sistema deve permitir o gerenciamento de localizações de estoque | NF009 – O sistema deve ser containerizável via Docker |
RF010 – O sistema deve permitir registro de entrada de componentes no estoque | NF010 – O sistema deve implementar cache com React Query |
RF011 – O sistema deve permitir registro de saída de componentes do estoque | NF011 – A senha deve ter no mínimo 8 caracteres com: 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial |
RF012 – O sistema deve calcular automaticamente o status do componente (Em Estoque, Baixo Estoque, Indisponível) | NF012 – O sistema deve implementar skeleton loading para melhor UX |
RF013 – O sistema deve permitir o cadastro de fornecedores | NF013 – Todos os formulários devem ter validação em tempo real |
RF014 – O sistema deve permitir a edição de fornecedores | NF014 – O sistema deve implementar proteção de rotas autenticadas |
RF015 – O sistema deve permitir a exclusão de fornecedores | NF015 – O sistema deve ter suporte a testes E2E com Cypress |
RF016 – O sistema deve permitir o cadastro de orçamentos com múltiplos componentes e fornecedores | |
RF017 – O sistema deve permitir a edição de orçamentos | |
RF018 – O sistema deve permitir a exclusão de orçamentos | |
RF019 – O sistema deve calcular automaticamente o total de orçamentos | |
RF020 – O sistema deve permitir filtrar componentes por categoria e status | |
RF021 – O sistema deve permitir pesquisar componentes, fornecedores, orçamentos e usuários | |
RF022 – O sistema deve gerar relatórios de componentes em PDF e CSV | |
RF023 – O sistema deve permitir seleção múltipla de itens para exportação | |
RF024 – O sistema deve exibir estatísticas (total, em estoque, baixo estoque, indisponível) | |
RF025 – O sistema deve permitir gerenciamento de usuários (admin) | |
RF026 – O sistema deve permitir reenvio de convite para usuários não ativados | |
RF027 – O sistema deve permitir visualização e edição de perfil do usuário | |
RF028 – O sistema deve permitir upload de foto de perfil | |
RF029 – O sistema deve exibir histórico de movimentações | |


### Casos de Teste

Funcionalidades   | Comportamento Esperado | Verificações |  Critérios de Aceite  |
-----------|--------|--------|--------| 
Cadastro |  ● Ao digitar email, nome completo, usuário e senha irá efetuar um cadastro na plataforma e o usuário deverá ser redirecionado para a tela de login. <br> ● Deve indicar o campo obrigatório a ser corrigido pelo usuário. | ●	Senha min 8 caracteres e no máximo 18 <br> ●	Todos os campos devem ser obrigatórios. <br>●	Exibir uma mensagem de confirmação em caso positivo. <br>●	Redirecionar o usuario para tela de login. <br>●	Exibir a mensagem de falha em caso de usuário existente.  <br>●	Exibir mensagem de falha em caso de confirmação de senha não ser igual <br>●	Exibir mensagem de falha no caso de campo obrigatório incompleto. | |

Funcionalidades   | Comportamento Esperado | Verificações |  Critérios de Aceite  |
-----------|--------|--------|--------| 
Login |  ● Ao digitar seu usuário e senha corretamente o usuário irá logar na plataforma. <br>● Ao tentar se logar e falhar 3 vezes consecutivas o usuário terá que esperar 15 minutos para tentar logar novamente. <br>● O sistema deve aceitar usuários que já está logado em outro device se logar novamente. | ●	Login no Sistema com sucesso <br>●	Usuario Inválido <br>●	Usuário não preencher campo obrigatório <br>●	Senha Incorreta <br>●	Senha Incorreta 3 vezes | ●	Ter acessibilidade no sistema  <br>●	Redimensionar a Tela


Funcionalidades   | Comportamento Esperado | Verificações |  Critérios de Aceite  |
-----------|--------|--------|--------| 
Lista de Fotos | Ao entrar na tela inicial o usuário irá ver uma lista com todas as fotos. <br> ● Deve ser exibido um ícone de coração no canto direito. <br>● Deve o ícone de coração deve exibir uma animação e trocar para a cor vermelha.<br> ● Deve ser exibido uma caixa de texto para o usuário escrever o comentário. | |

Funcionalidades   | Comportamento Esperado | Verificações |  Critérios de Aceite  |
-----------|--------|--------|--------| 
Comentario em Fotos | Ao clicar nos detalhes das fotos o usuário poderá fazer um comentário. <br>Deve ser exibido uma caixa de texto para o usuário escrever o comentário. <br>Deve ser exibido o nome do usuário <br>Deve ser exibido o texto “Comentar” na barra de texto para orientar o usuário. <br> Deve ter limite de 140 por comentário | ●	Limite de 140 caracteres. <br>●	Nome do usuario. <br>●	Comentários anteriores.|

Funcionalidades   | Comportamento Esperado | Verificações |  Critérios de Aceite  |
-----------|--------|--------|--------| 
Detalhes da fotos |	Serão exibidos os detalhes da foto: <br>- Foto <br>- Curtidas <br>- Comentarios  <br>- Opção de remoção da foto <br>Usuário deve conseguir curtir uma mensagem ao clicar no ícone de “coração”<br>O ícone de coração deve mudar de cor <br>Usuário que teve sua mensagem curtida deve receber uma notificação <br>Deve ser exibido uma caixa de texto para o usuário escrever o comentário. | ●	Número correto de curtidas e comentários. <br>●	Opção de remoção de fotos. <br>●	Possibilidade de curtir e comentar nas fotos. |

Funcionalidades   | Comportamento Esperado | Verificações |  Critérios de Aceite  |
-----------|--------|--------|--------| 
Remover foto | ●Ao clicar no item em excluir a foto deverá ser removida <br> ●Deve aparecer uma caixa de confirmação perguntando se usuário deseja mesmo excluir o stories <br> ●O usuário deve ter a opção de cancelar exclusão <br> ● O usuário deve confirmar a exclusão. | ●	Exclusão da foto <br>●	Acessar a foto após a remoção. <br>●Mensagem de confirmação em caso positivo. <br>●	Mensagem de cancelamento.|

Funcionalidades   | Comportamento Esperado | Verificações |  Critérios de Aceite  |
-----------|--------|--------|--------| 
Pesquisa | ● Ao digitar um texto na barra de pesquisa deverá aparecer as fotos correspondentes. <br>● Devem ser exibidas sugestões ao clicar na caixa de texto e a medida que o usuário digita. <br> ● Deve ser exibida uma mensagem caso não haja fotos correspondentes a pesquisa do usuário.| ●	Pesquisa encontrou os resultados  esperados <br>●	Pesquisa não encontrou resultados <br>●	Sugestões de Pesquisa |







## 4 - Estratégia de Teste

●	Escopo de Testes

O plano de testes abrange todas as  funcionalidades descritas na tabela acima. Esse plano de testes exclui a funcionalidade de upload de fotos.

Serão executados testes em todos os níveis conforme a descrição abaixo.

Testes Unitários: o código terá uma cobertura de 60% de testes unitários, que são de responsabilidade dos desenvolvedores.
Testes de Integração: Serão executados testes de integração em todos os endpoints, e esses testes serão de responsabilidade do time de qualidade.
Testes Automatizados: Serão realizados testes end-to-end na funcionalidade de Login.
Testes Manuais: Todas as funcionalidades serão testadas manualmente pelo time de qualidade seguindo a documentação de Cenários de teste e destes TestPlan. 
Versão Beta: Será lançada uma versão beta para 20 usuários pré-cadastrados antes do release. 



●	Ambiente e Ferramentas

Os testes serão feitos do ambiente de homologação, e contém as mesmas configurações do ambiente de produção com uma massa de dados gerada previamente pelo time de qualidade.

As seguintes ferramentas serão utilizadas no teste:

Ferramenta | 	Time |	Descrição 
-----------|--------|--------
POSTMAN	| Qualidade|	Ferramenta para realização de testes de API
Jasmine|	Desenvolvimento |Framework utilizada para testes unitários
Selenium|	Qualidade|	Ferramenta para testes end-to-end


## 5 - Classificação de Bugs

Os Bugs serão classificados com as seguintes severidades:

ID 	|Nivel de Severidade |	Descrição 
-----------|--------|--------
1	|Blocker |	●	Bug que bloqueia o teste de uma função ou feature causa crash na aplicação. <br>●	Botão não funciona impedindo o uso completo da funcionalidade. <br>●	Bloqueia a entrega. 
2	|Grave |	●	Funcionalidade não funciona como o esperado <br>●	Input incomum causa efeitos irreversíveis
3	|Moderada |	●	Funcionalidade não atinge certos critérios de aceitação, mas sua funcionalidade em geral não é afetada <br>●	Mensagem de erro ou sucesso não é exibida
4	|Pequena |	●	Quase nenhum impacto na funcionalidade porém atrapalha a experiência  <br>●	Erro ortográfico<br>● Pequenos erros de UI


### 6 - 	Definição de Pronto 
Será considerada pronta as funcionalidades que passarem pelas verificações e testes descritas nestes TestPlan, não apresentarem bugs com a severidade acima de Minor, e passarem por uma validação de negócio de responsabilidade do time de produto.
