Briefing UX
Funcionalidades de SEO na Área Logada (CMS)
Documento de especificação para design e prototipação

Versão: 1.0  |  Data: Junho/2025  |  Status: Para revisão e aprovação

1. Contexto e Objetivo
Estamos desenvolvendo um site institucional com uma área logada para que o time interno possa editar e manter o conteúdo do site de forma autônoma, sem depender de desenvolvimento técnico.
Dentro dessa área logada, precisamos de um módulo dedicado ao gerenciamento de SEO (Search Engine Optimization) — o conjunto de configurações que determina como o site aparece no Google e demais buscadores.
Este documento especifica todas as funcionalidades de SEO que devem estar disponíveis nessa área, organizadas por prioridade, para orientar o design das telas e fluxos.
A plataforma de desenvolvimento ainda está sendo definida. As funcionalidades descritas aqui são agnósticas de tecnologia e devem servir como base de requisitos independente da escolha final (WordPress, Webflow, plataforma própria etc.).

2. Princípios de UX para o módulo de SEO
Como o time que vai usar o painel não tem conhecimento técnico em SEO, o design deve seguir estes princípios:
•	Linguagem simples: evitar jargões técnicos nos labels e instruções. Ex: usar 'Título que aparece no Google' em vez de 'Title Tag'.
•	Orientação contextual: cada campo deve ter uma descrição breve do que é e por que importa, acessível sem sair da tela.
•	Feedback em tempo real: contadores de caracteres, alertas de campo vazio, pré-visualização do resultado.
•	Separação clara: distinguir visualmente as configurações por página das configurações globais do site.
•	Estado vazio orientado: quando um campo ainda não foi preenchido, mostrar uma sugestão ou placeholder útil, não apenas um campo em branco.

3. Módulo 1: SEO por Página
Estas configurações devem aparecer dentro de cada página/post editável do site, em uma seção dedicada ao SEO (separada das configurações de conteúdo).
Legenda de prioridade:
ESSENCIAL	Impacto direto no rankeamento. Deve estar na v1.
RECOMENDADO	Melhora consistência e distribuição. Prever na v1 ou v1.1.
AVANÇADO	Diferencial competitivo. Pode ser faseado para v2.

Prioridade	Funcionalidade	O que deve fazer
ESSENCIAL	Título para o Google (Title Tag)	Campo de texto com contador de caracteres (máx. 60). Exibir alerta visual quando o texto ultrapassar o limite. Preencher automaticamente com o título da página como sugestão inicial, permitindo edição.
ESSENCIAL	Descrição para o Google (Meta Description)	Campo de texto longo com contador (máx. 160 caracteres). Exibir estado de 'muito curto' (abaixo de 120) e 'muito longo' (acima de 160) com cores diferentes.
ESSENCIAL	URL amigável (Slug)	Campo editável para definir a URL da página. Gerar automaticamente a partir do título, convertendo para letras minúsculas e substituindo espaços por hifens. Alertar se a URL já existir no site.
ESSENCIAL	Alt text das imagens	Ao inserir uma imagem, exibir campo obrigatório (ou com alerta) para o texto alternativo. Mostrar lista de imagens sem alt text na página.
ESSENCIAL	Pré-visualização do resultado no Google (SERP Preview)	Mostrar em tempo real como a página vai aparecer nos resultados do Google (título, URL e descrição), para desktop e mobile, enquanto o usuário edita os campos.
RECOMENDADO	Configurações para redes sociais (Open Graph)	Campos para título, descrição e imagem que serão exibidos ao compartilhar a página no WhatsApp, LinkedIn, Twitter etc. Mostrar pré-visualização do card de compartilhamento.
RECOMENDADO	URL canônica (Canonical)	Campo para indicar a URL 'original' de um conteúdo, evitando penalizações por conteúdo duplicado. Exibir apenas para usuários avançados ou em modo expandido.
RECOMENDADO	Controle de indexação (Noindex)	Toggle simples (ligado/desligado) para impedir que uma página apareça nos resultados do Google. Exibir alerta de confirmação ao ativar, pois é uma ação de alto impacto.
RECOMENDADO	Alerta de estrutura de títulos (H1/H2)	Verificar se a página tem exatamente um H1, se a hierarquia de títulos está correta e exibir alertas visuais em caso de problema.
AVANÇADO	Dados estruturados (Schema Markup)	Gerador de JSON-LD para tipos comuns: Artigo, FAQ, Produto, Avaliação. Interface guiada com campos simples, sem necessidade de editar código.

4. Módulo 2: Configurações Globais de SEO
Estas configurações afetam o site inteiro e devem estar em uma seção separada, acessível pelo menu de configurações do painel — não dentro de uma página específica.

Prioridade	Funcionalidade	O que deve fazer
ESSENCIAL	Sitemap XML	Gerar e atualizar automaticamente o arquivo sitemap.xml sempre que uma página for publicada, editada ou removida. Exibir a URL do sitemap e botão para reenviar ao Google.
ESSENCIAL	Arquivo robots.txt	Editor de texto simples para o robots.txt, com explicação de cada instrução em linguagem acessível. Incluir validador básico para evitar bloqueios acidentais de páginas importantes.
ESSENCIAL	Gerenciador de redirecionamentos (301)	Interface para criar, editar e remover redirecionamentos de URLs antigas para novas. Campos: 'URL de origem' e 'URL de destino'. Importação via planilha é um diferencial.
RECOMENDADO	Integração com Google Search Console	Exibir dados básicos (cliques, impressões, posição média) direto no painel. Ao menos exibir link rápido e instruções de verificação de propriedade.
RECOMENDADO	Painel de performance (Core Web Vitals)	Mostrar os indicadores de velocidade e experiência do usuário que o Google usa como fator de rankeamento: LCP, CLS e FID. Com indicação visual de status (bom, atenção, ruim).
AVANÇADO	Relatório de links internos	Listar páginas com poucos ou nenhum link interno apontando para elas, permitindo identificar oportunidades de melhoria na estrutura do site.
AVANÇADO	SEO padrão por tipo de conteúdo	Definir templates de title e meta description para tipos de página (ex: todas as páginas de produto seguem o padrão 'Nome do Produto | Marca'). Usar variáveis dinâmicas.

5. Fluxo sugerido na interface
Ao editar qualquer página, o módulo de SEO deve ser acessível em um painel lateral ou em uma aba dedicada dentro do editor. Sugestão de organização:
Aba / seção SEO dentro do editor de página:
•	Pré-visualização do resultado no Google (sempre visível no topo, atualiza em tempo real)
•	Título para o Google — campo com contador
•	Descrição para o Google — campo com contador
•	URL da página — campo editável
•	Configurações para redes sociais (Open Graph) — expansível / colapsável
•	Configurações avançadas (canonical, noindex, schema) — expansível / colapsável
Menu de configurações globais (acesso separado):
•	Sitemap — visualizar URL e forçar atualização
•	Redirecionamentos — gerenciar lista
•	robots.txt — editar
•	Performance — visualizar Core Web Vitals
•	Integrações — Google Search Console, Analytics

6. Critérios de aceitação
Para cada funcionalidade marcada como ESSENCIAL, os seguintes critérios devem ser atendidos antes da entrega:
•	Todos os campos têm label claro e descrição de ajuda contextual
•	Contadores de caracteres atualizam em tempo real
•	Alertas visuais distinguem estados: vazio, ideal, excedido
•	Pré-visualização do SERP reflete o que será exibido no Google
•	As configurações são salvas separadamente do conteúdo da página (não precisa republicar o conteúdo para salvar SEO)
•	A interface funciona em telas de 1280px ou mais largas
•	Campos críticos (title, meta, slug) são validados antes de publicar

7. Glossário rápido
Para referência da equipe ao longo do projeto:
Termo técnico	O que significa na prática
Title Tag	Título da página que aparece na aba do navegador e como link azul no Google.
Meta Description	Texto de descrição que aparece abaixo do título nos resultados do Google.
Slug / URL amigável	A parte final da URL de uma página. Ex: /servicos/consultoria
Alt text	Descrição de uma imagem para pessoas com deficiência visual e para o Google Imagens.
SERP Preview	Simulação de como a página aparecerá na página de resultados do Google.
Open Graph	Protocolo que define título, imagem e descrição ao compartilhar links em redes sociais.
Canonical	Indica ao Google qual é a versão 'oficial' de uma URL quando há páginas duplicadas.
Noindex	Instrução para o Google não exibir aquela página nos resultados de busca.
Redirecionamento 301	Encaminha visitantes e o Google de uma URL antiga para uma nova, transferindo o histórico.
Sitemap XML	Arquivo que lista todas as páginas do site para facilitar o rastreamento pelo Google.
robots.txt	Arquivo que diz ao Google quais partes do site ele pode ou não acessar.
Core Web Vitals	Métricas de velocidade e experiência do usuário usadas pelo Google como critério de rankeamento.
Schema Markup	Código que ajuda o Google a entender o tipo de conteúdo da página (produto, artigo, FAQ etc.).

8. Próximos passos
Após aprovação deste documento, sugerimos o seguinte caminho:
1.	Revisão e alinhamento do escopo entre UX, produto e desenvolvimento
2.	Wireframes dos módulos ESSENCIAIS (por página e configurações globais)
3.	Validação das telas com o time de conteúdo (usuários finais do painel)
4.	Definição da plataforma de desenvolvimento
5.	Protótipo de alta fidelidade + handoff para desenvolvimento
6.	Planejar módulos RECOMENDADOS e AVANÇADOS para versões futuras

Dúvidas ou ajustes neste documento podem ser tratados diretamente com o responsável pelo produto antes de iniciar a fase de wireframes.
