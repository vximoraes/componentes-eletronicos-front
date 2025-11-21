# Plano de Teste - Tela de Componentes

**Estoque Inteligente - Sistema de Gestão de Componentes Eletrônicos**

## 1 - Introdução

A tela de Componentes é a funcionalidade central do sistema, responsável por gerenciar o ciclo completo dos componentes eletrônicos. Permite ao usuário visualizar, cadastrar, editar, excluir componentes, além de registrar movimentações de entrada e saída no estoque e consultar localizações onde os componentes estão armazenados.

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
RF005 – O sistema deve permitir o cadastro de componentes eletrônicos | NF007 – O sistema deve implementar paginação dinâmica ajustada ao tamanho da tela
RF006 – O sistema deve permitir a edição de componentes eletrônicos | NF008 – O sistema deve exibir mensagens de feedback (toast notifications)
RF007 – O sistema deve permitir a exclusão de componentes eletrônicos | NF010 – O sistema deve implementar cache com React Query (5 minutos)
RF010 – O sistema deve permitir registro de entrada de componentes no estoque | NF012 – O sistema deve implementar skeleton loading durante carregamento
RF011 – O sistema deve permitir registro de saída de componentes do estoque | NF013 – Todos os formulários devem ter validação em tempo real
RF012 – O sistema deve calcular automaticamente o status do componente (Em Estoque, Baixo Estoque, Indisponível) | NF003 – O sistema deve ser responsivo para mobile, tablet e desktop
RF020 – O sistema deve permitir filtrar componentes por categoria e status | NF014 – O sistema deve implementar proteção de rotas autenticadas
RF021 – O sistema deve permitir pesquisar componentes | NF006 – O sistema deve validar dados com Zod antes do envio
RF024 – O sistema deve exibir estatísticas (total, em estoque, baixo estoque, indisponível) | NF011 – Estoque mínimo e quantidade devem aceitar de 0 a 999.999.999
RF028 – O sistema deve permitir upload de foto do componente | NF004 – O sistema deve ser acessível via navegadores modernos

## 4 - Estratégia de Teste

### Escopo de Testes

O plano de testes abrange todas as funcionalidades da tela de Componentes, incluindo listagem, pesquisa, filtros, estatísticas, cadastro, edição, exclusão, movimentações de entrada e saída, visualização de localizações e upload de imagens.

Serão executados testes em todos os níveis conforme a descrição abaixo:

**Testes Unitários:** O código terá uma cobertura de 60% de testes unitários, de responsabilidade dos desenvolvedores.

**Testes de Integração:** Serão executados testes de integração nos endpoints de componentes, estoques, movimentações e categorias, de responsabilidade do time de qualidade.

**Testes Automatizados:** Serão realizados testes end-to-end com Cypress cobrindo os fluxos principais: listagem, cadastro, edição, exclusão e movimentações.

**Testes Manuais:** Todas as funcionalidades serão testadas manualmente pelo time de qualidade seguindo a documentação de Cenários de teste deste TestPlan.

**Versão Beta:** Será lançada uma versão beta para 20 usuários pré-cadastrados antes do release.

### Ambiente e Ferramentas

Os testes serão feitos no ambiente de homologação, que contém as mesmas configurações do ambiente de produção com uma massa de dados gerada previamente pelo time de qualidade.

As seguintes ferramentas serão utilizadas no teste:

Ferramenta | Time | Descrição
-----------|------|----------
Cypress | Qualidade | Framework para testes end-to-end automatizados
Postman | Qualidade | Ferramenta para realização de testes de API
Jest | Desenvolvimento | Framework utilizada para testes unitários
React Query DevTools | Desenvolvimento | Ferramenta para debug de queries e cache

### Casos de Teste

Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite
-----------|--------|--------|--------
Listagem de Componentes | ● Ao entrar na tela, o usuário deve visualizar todos os componentes cadastrados em formato de cards. <br>● Cada card deve exibir imagem (ou ícone padrão), nome, categoria, quantidade, estoque mínimo e status com badge colorido. <br>● Deve exibir skeleton loading durante o carregamento. <br>● Deve exibir mensagem "Não há componentes cadastrados..." quando não houver componentes. | ● Todos os componentes do usuário são listados <br>● Cards com informações corretas <br>● Status com cores adequadas (verde, amarelo, vermelho) <br>● Skeleton visível durante loading <br>● Mensagem apropriada quando lista vazia <br>● Paginação dinâmica (6 itens mobile, 12 desktop HD, 18 Full HD, 24 em 4K) | ● Componentes carregados em menos de 3 segundos <br>● Layout responsivo <br>● Feedback visual durante carregamento

Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite
-----------|--------|--------|--------
Estatísticas | ● No topo da tela devem ser exibidos 4 cards com estatísticas. <br>● Cards: Total de componentes, Em estoque, Baixo estoque, Indisponível. <br>● Cada card deve ter ícone e cor específica. <br>● No mobile/tablet os cards devem ser colapsáveis através de botão "Estatísticas". <br>● No desktop (xl) os cards devem estar sempre visíveis. <br>● Contadores devem ser atualizados automaticamente após qualquer operação. | ● Total = quantidade total de componentes <br>● Em Estoque = componentes com qtd >= estoque mínimo <br>● Baixo Estoque = componentes com 0 < qtd < estoque mínimo <br>● Indisponível = componentes com qtd = 0 <br>● Contadores sempre corretos <br>● Colapsável no mobile, visível no desktop | ● Estatísticas precisas <br>● Atualização em tempo real <br>● Responsividade funcional

Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite
-----------|--------|--------|--------
Pesquisa | ● Ao digitar no campo de pesquisa, deve filtrar componentes por nome em tempo real. <br>● A pesquisa deve ser case-insensitive (maiúsculas/minúsculas). <br>● Deve exibir mensagem "Nenhum componente encontrado para sua pesquisa." quando não encontrar resultados. <br>● Ao limpar o campo, deve voltar a exibir todos os componentes. <br>● Deve funcionar em conjunto com filtros aplicados. | ● Pesquisa em tempo real funcional <br>● Case-insensitive <br>● Busca por correspondência parcial <br>● Mensagem quando não há resultados <br>● Limpar campo restaura listagem <br>● Compatível com filtros de categoria e status | ● Resultados corretos e rápidos <br>● Resposta em menos de 500ms após parar de digitar

Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite
-----------|--------|--------|--------
Filtros | ● Ao clicar em "Filtros", deve abrir modal com opções de filtro por Categoria e Status. <br>● Categorias devem ser carregadas dinamicamente da API. <br>● Status tem 3 opções fixas: Em Estoque, Baixo Estoque, Indisponível. <br>● Após aplicar, deve exibir tags visuais dos filtros ativos com botão (X) para remover. <br>● Deve ser possível aplicar filtros combinados. <br>● Filtros devem persistir na URL. | ● Modal abre e fecha corretamente <br>● Lista de categorias carregada <br>● Filtros aplicados corretamente <br>● Tags visuais dos filtros ativos <br>● Remoção individual de filtros funciona <br>● Botão "Limpar filtros" remove todos <br>● Filtros na URL (query params) | ● Filtros precisos <br>● Visual claro dos filtros ativos <br>● Persistência na URL

Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite
-----------|--------|--------|--------
Adicionar Componente | ● Ao clicar em "Adicionar", deve redirecionar para tela de cadastro. <br>● Formulário com campos: Nome* (máx 100), Categoria* (dropdown + botão criar), Estoque Mínimo (0-999.999.999), Descrição (máx 200), Imagem (opcional). <br>● Validações em tempo real. <br>● Upload de imagem por clique ou drag and drop. <br>● Após salvar, redirecionar para listagem com toast "Componente criado com sucesso!". | ● Nome obrigatório e não vazio <br>● Categoria obrigatória <br>● Estoque mínimo entre 0 e 999.999.999 <br>● Contadores de caracteres funcionais <br>● Upload de imagem (jpg, png, gif, webp) funcional <br>● Criar categoria durante cadastro funciona <br>● Validações em tempo real <br>● Mensagens de erro claras <br>● Toast de confirmação | ● Componente cadastrado com sucesso <br>● Todas as validações funcionando <br>● Experiência fluida

Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite
-----------|--------|--------|--------
Editar Componente | ● Ao clicar em "Editar" no menu do card, deve redirecionar para tela de edição. <br>● Todos os campos pré-preenchidos com dados atuais. <br>● Mesmas validações do cadastro. <br>● Quantidade não editável diretamente (apenas via movimentações). <br>● Ao salvar, exibir toast "Componente atualizado com sucesso. Porém, a quantidade só pode ser alterada por movimentação." e redirecionar. | ● Dados pré-carregados corretamente <br>● Validações mantidas <br>● Quantidade não editável <br>● Status recalculado se alterar estoque mínimo <br>● Possibilidade de alterar/remover imagem <br>● Toast informativo <br>● Redirecionamento após salvar | ● Componente atualizado corretamente <br>● Status recalculado quando necessário

Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite
-----------|--------|--------|--------
Excluir Componente | ● Ao clicar em "Excluir" no menu, deve abrir modal de confirmação. <br>● Modal deve exibir o nome do componente. <br>● Opções: "Cancelar" e "Excluir". <br>● Ao confirmar, componente é removido permanentemente. <br>● Exibir toast "Componente excluído com sucesso!". <br>● Lista atualizada automaticamente. <br>● Se era o último item da página, voltar para página anterior. | ● Modal de confirmação claro <br>● Nome do componente exibido <br>● Botão "Excluir" em vermelho <br>● Cancelamento funciona <br>● Exclusão permanente <br>● Toast de confirmação <br>● Listagem atualizada <br>● Paginação ajustada <br>● Estatísticas recalculadas | ● Componente excluído permanentemente <br>● Confirmação obrigatória <br>● Feedback apropriado

Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite
-----------|--------|--------|--------
Entrada de Componente | ● Ao clicar em "Entrada" no menu, deve abrir modal. <br>● Formulário com: Localização* (dropdown) e Quantidade* (1-999.999.999). <br>● Ao confirmar, criar movimentação de entrada. <br>● Quantidade total do componente atualizada automaticamente. <br>● Estoque da localização criado ou atualizado. <br>● Status recalculado (pode mudar de Indisponível→Baixo Estoque ou Baixo Estoque→Em Estoque). <br>● Exibir toast "Entrada registrada com sucesso!". <br>● Card mostra loading e depois novos valores. | ● Localização obrigatória <br>● Quantidade obrigatória e > 0 <br>● Máximo 999.999.999 <br>● Movimentação criada <br>● Estoque atualizado/criado <br>● Quantidade total aumentada <br>● Status recalculado corretamente <br>● Toast de confirmação <br>● Loading no card <br>● Estatísticas atualizadas | ● Entrada registrada com sucesso <br>● Estoque atualizado corretamente <br>● Status recalculado automaticamente

Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite
-----------|--------|--------|--------
Saída de Componente | ● Ao clicar em "Saída" no menu, deve abrir modal. <br>● Formulário com: Localização* (dropdown - apenas com estoque) e Quantidade*. <br>● Validar se há estoque suficiente na localização antes de salvar. <br>● Se quantidade > disponível, exibir erro. <br>● Ao confirmar, criar movimentação de saída. <br>● Quantidade total diminuída. <br>● Status recalculado (pode mudar de Em Estoque→Baixo Estoque ou Baixo Estoque→Indisponível). <br>● Exibir toast "Saída registrada com sucesso!". | ● Localização obrigatória <br>● Apenas localizações com estoque <br>● Quantidade obrigatória e > 0 <br>● Validação de estoque suficiente <br>● Mensagem de erro clara <br>● Movimentação criada <br>● Estoque diminuído <br>● Status recalculado <br>● Toast de confirmação <br>● Estatísticas atualizadas | ● Saída registrada com sucesso <br>● Validação de estoque disponível <br>● Não permitir saída maior que disponível

Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite
-----------|--------|--------|--------
Visualizar Localizações | ● Ao clicar no card (área principal), deve abrir modal "Localizações". <br>● Exibir nome e descrição do componente. <br>● Listar todas as localizações com suas respectivas quantidades. <br>● Exibir quantidade total no rodapé. <br>● Se não houver localizações, exibir mensagem apropriada. <br>● Loading durante carregamento. | ● Clicar no card abre modal <br>● Nome e descrição exibidos <br>● Lista de localizações carregada <br>● Quantidade por localização <br>● Quantidade total correta <br>● Mensagem se sem localizações <br>● Loading funcional <br>● Botão fechar funcional | ● Modal informativo <br>● Dados corretos e atualizados <br>● Visual claro

Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite
-----------|--------|--------|--------
Paginação | ● Quando houver mais componentes que cabem na página, exibir controles de paginação no rodapé. <br>● Botões: Anterior (seta), números das páginas, Próxima (seta). <br>● Página atual destacada em azul. <br>● Botões "Anterior" e "Próxima" desabilitados nos limites. <br>● Para muitas páginas (>7), usar reticências (...). <br>● Ao pesquisar ou filtrar, voltar para página 1. | ● Paginação aparece quando necessário <br>● Botões funcionais <br>● Página atual destacada <br>● Botões desabilitados nos limites <br>● Reticências para muitas páginas <br>● Navegação fluida <br>● Cálculo correto de páginas <br>● Reset para página 1 ao pesquisar/filtrar | ● Navegação clara e funcional <br>● Indicadores visuais apropriados

Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite
-----------|--------|--------|--------
Upload de Imagem | ● Campo de imagem opcional no cadastro/edição. <br>● Upload por clique ou drag and drop. <br>● Formatos aceitos: JPG, JPEG, PNG, GIF, WEBP. <br>● Exibir preview miniatura. <br>● Botão (X) para remover imagem. <br>● Feedback visual durante drag. <br>● Rejeitar formatos não suportados. <br>● Na listagem, exibir imagem no card ou ícone padrão. | ● Upload por clique funciona <br>● Upload por drag and drop funciona <br>● Validação de formato <br>● Preview funcional <br>● Remoção de imagem funciona <br>● Feedback visual no drag <br>● Imagem salva no servidor <br>● Exibição correta na listagem <br>● Possibilidade de alterar/remover na edição | ● Upload opcional funcionando <br>● Validação de formato <br>● Boa experiência de usuário

Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite
-----------|--------|--------|--------
Status Automático | ● Status calculado automaticamente pelo backend. <br>● Regras: quantidade = 0 → "Indisponível" (vermelho), 0 < quantidade < estoque_mínimo → "Baixo Estoque" (amarelo), quantidade >= estoque_mínimo → "Em Estoque" (verde). <br>● Atualizado após: criação, entrada, saída, edição de estoque mínimo. <br>● Badge colorido no card. | ● Status correto em todos os cenários <br>● Indisponível quando qtd = 0 <br>● Baixo Estoque quando 0 < qtd < min <br>● Em Estoque quando qtd >= min <br>● Atualização automática <br>● Badge com cores corretas <br>● Sincronização com estatísticas | ● Status sempre correto <br>● Cores intuitivas <br>● Atualização automática

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
