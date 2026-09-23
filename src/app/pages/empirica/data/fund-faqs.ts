/**
 * fund-faqs.ts — Fechamento de Fundo: Perguntas & Respostas por fundo
 *
 * answer suporta markdown-lite:
 *   **bold**          → <strong>
 *   [texto](url)      → <a target="_blank">
 *   \n\n              → nova linha/parágrafo
 * answerImage         → imagem exibida após o texto (ex: gráfico de liquidez)
 */

export interface FaqItem {
  question: string;
  answer: string;
  answerImage?: string;
}

export interface FaqBanner {
  href: string;
  label: string;
}

export interface FundFaq {
  fundTitle: string;
  pageTitle: string;
  pageSubtitle?: string;
  /** Banners linkados exibidos no topo do conteúdo */
  banners?: FaqBanner[];
  items: FaqItem[];
  /** Texto de encerramento após o último item (markdown-lite) */
  closing?: string;
}

export const FUND_FAQS: Record<string, FundFaq> = {

  /* ── Empírica Lótus — Resultado da AGC ──────────────────────────────────── */
  'empirica-lotus-agc-resultado': {
    fundTitle: 'Empírica Lótus',
    pageTitle: 'Resultado da Assembleia de Fechamento',
    pageSubtitle: 'Resultado da AGC',
    items: [
      {
        question: 'A Assembleia Extraordinária de Cotistas (AGC), realizada em 20/09/2023, aprovou o Plano de Ação proposto pela Empírica?',
        answer:
          'Sim, o Plano de Ação foi aprovado na AGC realizada no dia 20/09/2023, por maioria de votos.',
      },
      {
        question: 'Onde encontro o comunicado oficial sobre o resultado da AGC?',
        answer:
          'Acesse o site [https://sistemas.cvm.gov.br/](https://sistemas.cvm.gov.br/);\n\nClique em "Consulta a Fundos";\n\nClique em "Fundos de Investimentos";\n\nDigite **17.251.743/0001-37** em "CNPJ";\n\nClique em "continuar";\n\nClique em "EMPÍRICA LOTUS FUNDO DE INVESTIMENTO EM COTAS DE FUNDOS DE INVESTIMENTO MULTIMERCADO CRÉDITO PRIVADO".',
      },
      {
        question: 'Na apuração dos votos, foi levada em consideração a quantidade de cotas detidas por cada Cotista, ou foi atribuído o mesmo peso ao voto de cada um dos Cotistas?',
        answer:
          'Nos termos do Art. 71 da Instrução CVM nº 555 de 2014, cada cota equivale a 1 (um) voto sendo, portanto, levada em consideração a quantidade de cotas detida por cada Cotista.',
      },
      {
        question: 'Qual foi o resultado das deliberações da AGC?',
        answer:
          'O Plano de Ação do item (i) da ordem do dia foi aprovado por 96,94% dos votos e a **ordem cronológica** de prioridade para pagamento dos resgates foi aprovada por 61,39% dos votos.',
      },
      {
        question: 'Como funcionará o resgate por ordem cronológica?',
        answer:
          'Os pedidos de resgate efetuados até a data de fechamento do Fundo serão considerados prioritários e os resgates serão realizados em ordem cronológica, conforme manifestação anteriormente enviada ao Distribuidor do Fundo e comunicada à Administradora, sendo considerados comorientes (ou seja, realizados em uma mesma data e horário) todos os pedidos de resgate solicitados em um mesmo dia (logo, não haverá ordem por horário).\n\nOs pedidos de resgate solicitados no âmbito da AGC, cuja data de solicitação será considerada como a data da realização da Assembleia (20/09/23), serão considerados comorientes para fins de apuração de ordem de prioridade.',
      },
      {
        question: 'Quando serão realizados os pagamentos dos resgates?',
        answer:
          'O primeiro pagamento de resgate será realizado a partir de outubro/2023.\n\nOs pagamentos subsequentes sempre no 17º (décimo sétimo) dia útil de cada mês, considerando a cotização do 15º (décimo quinto) dia útil do mesmo mês.\n\nOs resgates serão realizados até o limite das disponibilidades estabelecidas pela Gestora. Na hipótese de insuficiência de recursos para pagamento da totalidade dos pedidos de resgates solicitados pelos cotistas em uma mesma data, tais resgates serão postergados para os meses subsequentes. No resgate por ordem cronológica, não há pagamento parcial de resgates.',
      },
      {
        question: 'Como o Cotista poderá acompanhar o cronograma de pagamentos dos resgates, para saber quando chegará a sua vez de receber o pagamento do resgate solicitado?',
        answer:
          'A **Empírica**, gestora do fundo, divulgará mensalmente um comunicado trazendo uma tabela com o volume de resgates a serem liquidados em cada data, conforme as solicitações de resgate realizadas antes do fechamento do Fundo e na AGC, mais o saldo restante e o caixa disponível naquele mês para cobrir os pagamentos.\n\nDigamos que o Fundo possuísse R$ 25 milhões de caixa para pagar os resgates no início de outubro: todos os resgates com liquidação programada até o dia 14/09/2023 seriam liquidados integralmente no 17º dia útil do mês. O resgate do dia 15/09/2023 não seria liquidado em outubro, dado que o Fundo não possuiria os recursos disponíveis para cobrir a totalidade dos pagamentos. Como não haverá resgates parciais, esse pagamento seria postergado para novembro.',
      },
      {
        question: 'Qual o volume total de resgates solicitados?',
        answer:
          'Estamos aguardando o Administrador do Fundo disponibilizar a informação e atualizaremos este documento assim que possível.',
      },
      {
        question: 'Existe alguma previsão de prazo para quitar todo o volume de resgates solicitado? O Gestor do Fundo poderá levar quanto tempo quiser para vender ativos e gerar Caixa? Não existe um prazo limite comprometido com os Cotistas que solicitaram resgate?',
        answer:
          'Não existe prazo máximo para liquidar o pagamento de todos os resgates solicitados.\n\nA área de Gestão da **Empírica** possui um controle e monitoramento do pagamento das amortizações programadas dos fundos investidos pelo **Empírica Lótus** e estará envidando os melhores esforços para realizar a venda dos ativos a um preço considerado justo, de forma a atender o melhor interesse financeiro dos investidores.\n\nA estimativa é de aproximadamente 12 meses, contados da realização da AGC.',
      },
      {
        question: 'Os Cotistas que não solicitaram resgate, mas que vierem a desejar fazê-lo no futuro, deverão aguardar a quitação de todos os pagamentos pendentes dos resgates já solicitados?',
        answer:
          'Os cotistas que não solicitaram resgate até a data da AGC deverão aguardar a reabertura do Fundo para novas solicitações de resgates. Ainda não há prazo para que o Fundo seja reaberto para novos pedidos de resgate.',
      },
      {
        question: 'Por que as aplicações no Fundo não serão retomadas, de forma a aumentar o Caixa e assim poder quitar os resgates mais rapidamente?',
        answer:
          'Conforme disposto no parágrafo 4º do Art. 39 da Instrução CVM nº 555 de 2014, o Fundo deve permanecer fechado para aplicações até a sua reabertura para aplicações e resgates ordinários.',
      },
      {
        question: 'Quando o Fundo será reaberto para aplicações e resgates ordinários de cotas?',
        answer:
          'Isso ocorrerá após o pagamento integral dos resgates que foram solicitados até a AGC. Após a reabertura do Fundo, as aplicações e resgates observarão os prazos e procedimentos previstos no regulamento do Fundo.',
      },
      {
        question: 'Como o Fundo conseguirá se manter rentável para os Cotistas que não solicitaram resgates, ou aqueles que ainda estarão aguardando seus resgates?',
        answer:
          'O objetivo é manter uma carteira diversificada e com ativos saudáveis e rentáveis, buscando manter a boa performance histórica do Fundo. A área de Gestão da **Empírica** está envidando os melhores esforços para realizar a venda dos ativos para quitar os resgates já solicitados a um valor considerado justo, sempre observando preservar o melhor interesse financeiro de todos os investidores.',
      },
      {
        question: 'Onde acessar para obter mais informações?',
        answer:
          '[Plano de Ação — Perguntas & Respostas](https://investimentos.empirica.com.br/lotus-di-plano-de-acao-perguntas-e-respostas)\n\n[Informações do Fundo](https://empirica.com.br/renda-fixa/empirica-lotus-fic-fim-cp/)\n\n[Registro na CVM](https://cvmweb.cvm.gov.br/swb/default.asp?sg_sistema=fundosreg)',
      },
    ],
    closing:
      'Nossa área de Distribuição & Relações com Investidores ficará à disposição pelo e-mail [distribuicao@empirica.com.br](mailto:distribuicao@empirica.com.br) para prestar maiores informações que porventura não tiverem sido esclarecidas nos comunicados sobre o Plano de Ação, Desempenho do Fundo e Resultado da AGC e Comunicado do Gestor, disponíveis em nosso site.',
  },

  /* ── Empírica Lótus — Plano de Ação ─────────────────────────────────────── */
  'empirica-lotus-plano-acao': {
    fundTitle: 'Empírica Lótus',
    pageTitle: 'Plano de Ação',
    pageSubtitle: 'Perguntas & Respostas',
    items: [
      {
        question: 'Qual é a abrangência do Plano de Ação proposto?',
        answer:
          'Ele abrange todos os Cotistas do **Empírica Lótus**, incluindo aqueles que solicitaram resgates antes do fechamento do Fundo e que ainda não tiveram seus pedidos de resgate convertidos (e, portanto, não foram pagos) e aqueles que não solicitaram resgates.',
      },
      {
        question: 'Quais opções estão sendo propostas aos Cotistas?',
        answer:
          'Considerando que todos os pedidos de resgate de cotas solicitados mas não convertidos antes do fechamento do Fundo foram cancelados, os Cotistas que solicitaram resgate de cotas **antes da data do fechamento do Fundo** poderão optar por:\n\n**Manter o cancelamento** do pedido de resgate, decorrente do fechamento do Fundo, ou seja, seus resgates estarão cancelados;\n\n**Reativar parcial ou integralmente** o pedido de resgate que haviam solicitado antes do fechamento do fundo.\n\nSe o Cotista não se **manifestar formalmente por manter o cancelamento**, será presumido que ele está reafirmando o pedido de resgate solicitado anteriormente.\n\nOs **Cotistas que não solicitaram resgate** de cotas antes da data do fechamento do Fundo poderão pedir o resgate de cotas, total ou parcialmente, via manifestação de voto e intenção de resgate no âmbito da Assembleia Geral de Cotistas (AGC).',
      },
      {
        question: 'Caso eu não tenha solicitado resgate de cotas antes de fechamento do Fundo, poderei solicitar agora?',
        answer:
          'Sim. O Cotista poderá solicitar o resgate total ou parcial até a data da AGC, conforme previsto no Edital de Convocação.',
      },
      {
        question: 'O que acontece se eu não tiver solicitado resgate antes do fechamento do Fundo e não encaminhar a minha intenção de resgate?',
        answer:
          'Suas cotas serão mantidas no Fundo e somente poderão ser resgatadas após a reabertura para aplicações e resgates, conforme prazos e procedimentos previstos no regulamento do Fundo.\n\nSerão desconsiderados os pedidos de resgate (i) solicitados após a Assembleia e até a reabertura do Fundo; ou (ii) que contenham informações incompletas e/ou incompatíveis com a posição detida pelo respectivo Cotista.',
      },
      {
        question: 'Quando o Fundo será reaberto para aplicações e resgates ordinários de cotas?',
        answer:
          'Isso ocorrerá após o pagamento integral dos resgates solicitados antes da data de fechamento do Fundo ou no âmbito da AGC.\n\nApós a reabertura do Fundo, as aplicações e resgates observarão os prazos e procedimentos previstos no seu regulamento.',
      },
      {
        question: 'Durante o período em que o resgate ficou suspenso, vai haver cobrança de taxa de administração?',
        answer:
          'Sim. Embora o Fundo esteja fechado para resgates, as atividades do Fundo estão em funcionamento normalmente.',
      },
      {
        question: 'Quando serão pagos os resgates mantidos e solicitados?',
        answer:
          'Os pedidos de resgate serão pagos conforme ordem de prioridade definida na AGC e em regime de caixa, ou seja, a disponibilidade de caixa para os referidos pagamentos será apurada, pela Gestora, por meio da soma dos recursos provenientes de amortizações e resgates dos fundos investidos pelo Fundo e da venda de ativos integrantes da sua carteira, descontadas as reservas, provisões e encargos.\n\nO pagamento em regime de caixa permitirá que a Gestora venda os ativos integrantes da carteira buscando obter valores justos e de forma não forçada ou depreciada.\n\nDurante o período de pagamento dos resgates, o Fundo permanecerá fechado para aplicações.\n\nO **primeiro pagamento** de resgates será realizado **a partir de 10 de outubro de 2023**.',
      },
      {
        question: 'Haverá alguma ordem de prioridade para o pagamento dos resgates de cotas?',
        answer:
          'A ordem de prioridade será deliberada pela AGC, por meio da manifestação de votos dos Cotistas.',
      },
      {
        question: 'Quais são as alternativas de ordem de prioridade a serem votadas pelo Cotista no âmbito da AGC?',
        answer:
          '**Resgate pro rata:** realização do pagamento dos resgates extraordinários de maneira proporcional ao valor do pedido de resgate efetuado por cada um dos Cotistas, com relação à totalidade dos pedidos solicitados, simultaneamente entre todos os Cotistas e independentemente da data em que enviaram seu pedido de resgate (isto é, sem distinção entre os pedidos de resgates solicitados antes ou depois do fechamento do Fundo);\n\n**Resgate por ordem cronológica:** realização do pagamento dos resgates extraordinários em ordem cronológica, considerando que **(a)** para os pedidos de resgate efetuados até a data de fechamento do Fundo, tais pedidos serão considerados prioritários e os resgates serão realizados em ordem cronológica, conforme manifestação anteriormente enviada ao Distribuidor do Fundo e comunicada à Administradora, sendo considerados comorientes todos os pedidos de resgate solicitados em um mesmo dia (logo, não haverá ordem por horário); e **(b)** para os pedidos de resgate solicitados no âmbito da AGC, cuja data de solicitação será considerada como a data de realização da Assembleia, esses pedidos serão considerados comorientes para fins de apuração de ordem de prioridade.',
      },
      {
        question: 'Em quais datas serão realizados a cotização e o pagamento dos resgates?',
        answer:
          'O **primeiro pagamento** de resgate será realizado a partir do dia **10 de outubro de 2023** e os pagamentos subsequentes sempre no **17º (décimo sétimo) dia útil** de cada mês, considerando a cotização do **15º (décimo quinto) dia útil** do mesmo mês.\n\nNo caso de **resgate pro rata**, os resgates serão realizados até o limite da disponibilidade de caixa estabelecida pela Gestora, observada a possibilidade de resgate parcial entre os Cotistas. Na hipótese de insuficiência de recursos para o pagamento da totalidade dos pedidos de resgate devidos a todos os cotistas em uma mesma data, o pagamento do saldo não resgatado será automaticamente postergado para os meses subsequentes.\n\nNo caso de **resgate por ordem cronológica**, os resgates serão realizados até o limite das disponibilidades estabelecidas pela Gestora. Na hipótese de insuficiência de recursos para pagamento da totalidade dos pedidos de resgates solicitados pelos cotistas em uma mesma data, tais resgates serão postergados para os meses subsequentes. No caso de resgate por ordem cronológica, não haverá pagamento parcial de resgate.',
      },
      {
        question: 'Quais são as alternativas para o Cotista que não aprovar o Plano de Ação?',
        answer:
          'Ele poderá votar pelas seguintes alternativas: (a) substituição da Administradora do Fundo; (b) substituição da Gestora do Fundo; (c) reabertura do Fundo para resgate; (d) manutenção do fechamento do Fundo para resgate; (e) possibilidade do pagamento de resgate em ativos financeiros; (f) cisão do Fundo; ou (g) liquidação do Fundo.\n\nCaso o Cotista tenha interesse em que a Gestora apresente uma nova versão do Plano de Ação, ele deverá reprovar os itens descritos acima.',
      },
    ],
    closing:
      'A **Empírica** entende que o fechamento do Fundo foi necessário por razões específicas do mercado, que estão melhor detalhadas no [Comunicado do Gestor](https://empirica.com.br/wp-content/uploads/2023/08/Comunicado-fechamento-Empirica-Lotus.pdf) e nas [Perguntas & Respostas sobre o fechamento](https://investimentos.empirica.com.br/lotus-di-perguntas-e-respostas), disponibilizados em seu website. A Gestora estará à disposição dos cotistas para o esclarecimento de dúvidas e questionamentos. Os esclarecimentos prestados pela Gestora para um ou mais cotistas permanecerão disponíveis para acesso de todos os investidores no seu website [empirica.com.br](https://empirica.com.br/)\n\n**Ficamos à disposição para maiores esclarecimentos, em nossa área de Distribuição & Relações com Investidores, pelo e-mail** [distribuicao@empirica.com.br](mailto:distribuicao@empirica.com.br)',
  },

  /* ── Empírica Lótus FIF em Cotas de FIM ─────────────────────────────────── */
  'empirica-lotus-fif-em-cotas-de-fim': {
    fundTitle: 'Empírica Lótus',
    pageTitle: 'Fechamento de Fundo',
    pageSubtitle: 'Perguntas & Respostas',
    banners: [
      {
        href: 'https://investimentos.empirica.com.br/lotus-resultado-agc',
        label: 'Resultado da Assembleia',
      },
      {
        href: 'https://investimentos.empirica.com.br/lotus-di-plano-de-acao-perguntas-e-respostas',
        label: 'Plano de Ação',
      },
    ],
    items: [
      {
        question: 'Por que a Empírica decidiu fechar o fundo para resgastes e aplicações?',
        answer:
          'Divulgamos um [Comunicado do Gestor](https://empirica.com.br/wp-content/uploads/2023/08/Comunicado-fechamento-Empirica-Lotus.pdf) sobre o fechamento do Fundo **Empírica Lótus**, trazendo uma explicação detalhada sobre essa decisão, que foi motivada pelo aumento do volume de pedidos de resgate, incompatível com a liquidez do Fundo, como forma de readequá-la e proteger os investidores remanescentes.',
      },
      {
        question: 'Qual foi o motivo do grande volume de resgastes solicitados recentemente pelos investidores do Empírica Lótus?',
        answer:
          'A liquidez do Fundo foi prejudicada pelo grande volume de resgates resultantes do "efeito contaminação" gerado pelo fechamento do **Empírica Lótus IPCA** em 20/06/23, que fica bem demonstrada no gráfico abaixo - onde é possível ver a situação de liquidez do **Empírica Lótus** nas semanas anterior e posterior ao fechamento do Fundo:',
        answerImage:
          'https://d335luupugsy2.cloudfront.net/cms/files/489456/1693417901/$fkglxxxpa1m',
      },
      {
        question: 'Por que o fechamento do Empírica Lótus teve por objetivo proteger os investidores?',
        answer:
          'Ao longo dos últimos 60 dias a equipe de Gestão da **Empírica** não conseguiu realizar as vendas necessárias de ativos a preços considerados justos, dado o ambiente mais adverso e com menor liquidez do mercado. Esses preços desvalorizados poderiam proporcionar impactos negativos para os investidores que não solicitaram resgates, e que permaneceriam no Fundo.\n\nA medida, que faz parte das boas práticas ditadas pela CVM/Anbima, é uma iniciativa responsável por parte da **Empírica** para com os investidores e seguirá um conjunto de ritos previstos na legislação do mercado de capitais. Recomendamos a leitura do conteúdo divulgado pelo site [Como Investir](https://comoinvestir.anbima.com.br/noticia/entenda-fundos-fecham-resgates/) da Anbima.',
      },
      {
        question: 'Quando o fundo será reaberto para resgates e aplicações?',
        answer:
          'Em conformidade com a regulamentação aplicável, os cotistas serão convocados para uma Assembleia Geral de Cotistas (AGC), na qual a **Empírica** apresentará um Plano de Ação para a reabertura do Fundo.',
      },
      {
        question: 'Quando será realizada a Assembleia Geral de Cotistas?',
        answer:
          'A AGC será realizada no dia 20/09/23, em observância ao rito estabelecido na regulamentação da Comissão de Valores Mobiliários (CVM). O Administrador do Fundo, **BTG Pactual**, encaminhará a Convocação da AGC para as plataformas de distribuição, que então a encaminharão aos respectivos investidores, dentro do prazo regulamentar.',
      },
      {
        question: 'O que acontecerá com os resgates solicitados?',
        answer:
          'Resgates solicitados e convertidos antes do fechamento do Fundo: serão pagos.\n\nResgates solicitados antes do fechamento do Fundo, mas não convertidos: estão cancelados.\n\nResgates solicitados após o fechamento do Fundo: o recebimento de pedidos de resgates está suspenso até a reabertura do Fundo.\n\nA **Empírica** apresentará um Plano de Ação na Assembleia Geral de Cotistas, tanto para a conversão e pagamento dos resgates já solicitados, quanto para a reabertura do Fundo.',
      },
      {
        question: 'A suspensão dos resgates pelo fechamento do fundo significa atraso no pagamento sujeito a multa?',
        answer:
          'Não. A multa por atraso no pagamento de resgates prevista no Art. 37, V da Instrução CVM Nº 555 não é aplicável em caso de fechamento do fundo, quando decorrente de pedidos de resgates incompatíveis com a sua liquidez, motivo pelo qual o **Empírica Lótus** foi fechado para resgates e aplicações.',
      },
      {
        question: 'A Empírica não poderia ter gerado liquidez no fundo há mais tempo para não ter chegado a esta situação?',
        answer:
          'A **Empírica** tem políticas e procedimentos de gerenciamento do risco de liquidez, que levam em consideração a concentração de cotistas, o histórico de resgates e testes de estresse. No entanto, a liquidez do Fundo foi prejudicada pelo grande volume de resgates que ocorreram devido ao "efeito contágio" do fechamento do **Empírica Lótus IPCA**.',
      },
      {
        question: 'Qual é a avaliação do risco de crédito dos ativos da carteira do Empírica Lótus? Há ativos com alto risco de deterioração relevante que possam impactar a rentabilidade do Fundo?',
        answer:
          'Conforme comentado anteriormente, o fechamento do Fundo foi motivado somente por questões de liquidez. Os ativos investidos continuam performando dentro do esperado.',
      },
      {
        question: 'Outros fundos geridos pela Empírica também podem ser fechados?',
        answer:
          'O fechamento do **Empírica Lótus** foi uma decisão decorrente do grande volume de pedidos de resgate, incompatível com a liquidez do Fundo, motivada pelo "efeito contágio" do fechamento do **Empírica Lótus IPCA**. Não vemos motivo para os investidores pedirem resgates dos outros fundos geridos pela Empírica. No entanto, caso os demais fundos recebam um grande volume de resgates também incompatíveis com sua liquidez, a Empírica precisará tomar a decisão nos mesmos moldes adotados para o fechamento do **Empírica Lótus IPCA** e **Empírica Lótus**, com o objetivo de proteger os investidores.',
      },
      {
        question: 'A Empírica tem algum risco de continuidade em decorrência do fechamento do Empírica Lótus e do Empírica Lótus IPCA?',
        answer:
          'Não. A Empírica é uma gestora sólida, sem endividamento, lucrativa e com margens saudáveis, com aproximadamente R$ 9 bilhões sob gestão, com um portfólio diversificado de aproximadamente 60 fundos de investimento, entre FIDC, FIC FIM, FII e produtos de crédito imobiliário.',
      },
    ],
    closing:
      '**Ficamos à disposição para maiores esclarecimentos, em nossa área de Distribuição & Relações com Investidores, pelo e-mail **[distribuicao@empirica.com.br](mailto:distribuicao@empirica.com.br)',
  },

  /* ── Empírica Lótus IPCA — Fechamento de Fundo ───────────────────────────── */
  'empirica-lotus-ipca-fif-em-cotas-de-fim': {
    fundTitle: 'Empírica Lótus IPCA',
    pageTitle: 'Fechamento de Fundo',
    pageSubtitle: 'Perguntas & Respostas',
    items: [
      {
        question: 'Por que a Empírica decidiu fechar o fundo para resgates e aplicações?',
        answer:
          'Divulgamos uma Nota de Esclarecimento sobre o fechamento do Fundo **Empírica Lótus IPCA** com a explicação detalhada sobre essa decisão, que foi motivada devido ao aumento do volume de pedidos de resgates incompatível à liquidez do Fundo, com o objetivo de proteger os investidores.',
      },
      {
        question: 'Qual foi o motivo do grande volume de resgates solicitados recentemente pelos investidores do Empírica Lótus IPCA?',
        answer:
          'A liquidez do fundo foi prejudicada pelo grande volume de resgates intensificado nos últimos dias, devido aos ruídos sobre o FIDC Energia Solar (FIDC Insole). Após um trabalho de comunicação intenso conseguimos esclarecer a real situação desse fundo para todos os assessores de investimento, demonstrando que não existe motivo para pânico.\n\nDe todo modo, desde setembro de 2022 tivemos resgates em função dos três meses de deflação que prejudicaram a rentabilidade do fundo. No início do ano, depois do evento das Lojas Americanas, os resgates se intensificaram, assim como em toda a indústria de fundos de renda fixa, impactando bastante na gestão de liquidez do fundo, até a nossa decisão de fechá-lo para resgates.\n\nCabe destacar que, durante todo o período acima, o Gestor conseguiu implementar um modelo de gestão de liquidez diferenciado e muito ativo, apesar do cenário adverso, possibilitando liquidar mais de R$ 600 milhões de resgates sem gerar qualquer perda para os investidores que permaneceram no fundo.',
      },
      {
        question: 'Por que o fechamento do Empírica Lótus IPCA teve por objetivo proteger os investidores?',
        answer:
          'Para honrar o pagamento de um grande volume repentino de resgates, a Empírica precisa realizar uma venda forçada dos ativos da carteira do fundo. Considerando que o **Empírica Lótus IPCA** investe em ativos de baixa liquidez, cotas de FIDC, essa venda forçada traria prejuízo aos cotistas do fundo.',
      },
      {
        question: 'O que acontecerá com os resgates solicitados?',
        answer:
          '**Resgates solicitados antes do fechamento do Fundo:** a conversão e o pagamento estão suspensos.\n\n**Resgates solicitados após o fechamento do Fundo:** o recebimento de pedidos de resgates está suspenso até a reabertura.\n\nA Empírica apresentará para a Assembleia Geral de Cotistas um plano de ação para a conversão e pagamento dos resgates já solicitados e para a reabertura do Fundo.',
      },
      {
        question: 'A suspensão dos resgates pelo fechamento do fundo significa atraso no pagamento sujeito a multa?',
        answer:
          'Não. A multa por atraso no pagamento de resgates prevista no Art. 37, V da Instrução CVM Nº 555 não é aplicável em caso de fechamento do fundo, quando decorrente de pedidos de resgates incompatíveis com a sua liquidez, motivo pelo qual o **Empírica Lótus IPCA** foi fechado para resgates e aplicações.',
      },
      {
        question: 'Quando o fundo será reaberto para resgates e aplicações?',
        answer:
          'Em conformidade com a regulamentação aplicável, os cotistas serão convocados para uma Assembleia Geral de Cotistas (AGC), para a qual a Empírica apresentará um plano de ação para a reabertura do Fundo.',
      },
      {
        question: 'A Empírica não poderia ter gerado liquidez no fundo há mais tempo para não ter chegado a esta situação?',
        answer:
          'A Empírica tem políticas e procedimentos de gerenciamento do risco de liquidez, que levam em consideração a concentração de cotistas, histórico de resgates e testes de estresse. Conforme informado na Nota de Esclarecimento, todos os resgates solicitados após os eventos de deflação, aumento da taxa Selic e escândalos corporativos (Americanas e Light) foram pagos. No entanto, a liquidez do fundo foi prejudicada pelo grande volume de resgates intensificado nos últimos dias, devido aos ruídos sobre o FIDC Energia Solar (FIDC Insole).',
      },
      {
        question: 'Quando será realizada a Assembleia Geral de Cotistas?',
        answer:
          'A AGC será realizada no dia 17 de julho de 2023, em observância ao rito estabelecido na regulamentação da Comissão de Valores Mobiliários (CVM). Os cotistas receberão uma convocação com maiores informações.',
      },
      {
        question: 'A rentabilidade negativa de 19/06/2023 pode ser recuperada?',
        answer:
          'Sim. Trata-se de um impacto na cota do Fundo, decorrente de uma provisão para devedores duvidosos (PDD) da carteira do FIDC Insole investido pelo **Empírica Lótus IPCA**, com boa probabilidade de reversão.',
      },
      {
        question: 'O fundo ainda poderá ter rentabilidade negativa adicional decorrente do FIDC Insole?',
        answer:
          'Sim. O Administrador do FIDC tem a atribuição de refletir no valor das cotas o valor justo dos ativos de sua carteira e calcular a PDD, conforme metodologia por ele definida. Não obstante, considerando que a Insole Energia Solar está reestruturando seu passivo e deverá ingressar com um pedido e um plano de recuperação judicial, há uma boa probabilidade de reversão da PDD a ela atribuída na carteira do FIDC Insole.',
      },
      {
        question: 'Qual é a alocação do Empírica Lótus IPCA no FIDC Insole?',
        answer:
          'Nossa alocação em Insole é de aproximadamente **16% do PL do Fundo**, sendo 12,8% em cotas Sênior, com maior proteção contra eventuais provisionamentos no curto prazo e maior probabilidade de recuperação.',
      },
      {
        question: 'O evento da Insole pode vir a impactar a cota sênior do FIDC?',
        answer:
          'No pior cenário, em que nada evolua em relação às ações que estão sendo tomadas junto à Insole, existe a possibilidade de impacto na cota Sênior do FIDC. Ressaltamos que, em nossa avaliação, esse cenário é muito remoto de acontecer.',
      },
      {
        question: 'Quais são as medidas que estão sendo adotadas pela Empírica junto à Insole?',
        answer:
          'Estamos acompanhando a companhia na sua estratégia do plano de recuperação judicial e em suas novas fontes de financiamento.',
      },
      {
        question: 'O que acontece se a Insole não se recuperar?',
        answer:
          'Considerando os esforços da Insole na apresentação de um plano de recuperação judicial, acreditamos que há uma grande perspectiva de recuperação da empresa. No entanto, simulando o pior cenário, com base na metodologia de provisionamento do Administrador do fundo, o impacto adicional do FIDC Insole na rentabilidade do **Empírica Lótus IPCA**, com alta probabilidade, não impactaria o capital do investidor, ou seja, não geraria uma rentabilidade negativa no ano para o investidor.',
      },
      {
        question: 'A Empírica tem algum risco de continuidade em decorrência do fechamento do Empírica Lótus IPCA?',
        answer:
          'Não. A Empírica é uma gestora sólida, sem endividamento, lucrativa e com margens saudáveis, com aproximadamente R$ 9 bilhões sob gestão, com um portfólio diversificado de aproximadamente 60 fundos de investimento sob gestão.',
      },
      {
        question: 'A Empírica possui recursos próprios investidos no FIDC Insole?',
        answer:
          'Não. Somos estruturadores e gestores do FIDC. A Empírica tem uma Política de Negociação de Valores Mobiliários de Sócios e Colaboradores que veda a aplicação de recursos pessoais em (i) cotas de fundos de investimento em direitos creditórios geridos pela Empírica; e/ou (ii) cotas de fundos de investimento com público-alvo restrito e/ou exclusivo.',
      },
      {
        question: 'Além do Empírica Lótus IPCA, há outros fundos geridos pela Empírica com exposição ao FIDC Insole?',
        answer:
          'Apenas o **Empírica Lótus HY**, **Empírica Lótus Impacto** e **Empírica Lótus**, entretanto estes dois últimos têm uma baixíssima exposição ao FIDC Insole e alocações apenas em cotas Sênior. O Empírica Lótus HY possui uma exposição a cotas Subordinadas Mezanino de 5,98%, Empírica Lótus Impacto 4,72% a cotas Sênior e Empírica Lótus 0,28%, sendo 0,12% a cotas Sênior.',
      },
      {
        question: 'Qual é a avaliação do risco de crédito dos demais ativos da carteira do Empírica Lótus IPCA?',
        answer:
          'Os demais ativos seguem com suas carteiras dentro do esperado. A única exceção é o FIDC Empírica a55 SaaS, ao qual possuímos uma exposição menor do que 1% do patrimônio, sendo que 0,66% estão concentrados em cotas Sênior. Esse fundo está sendo monitorado diariamente e o risco de impacto da cota Sênior é baixíssimo.',
      },
      {
        question: 'Há outros ativos com alto risco de deterioração relevante que possam impactar a rentabilidade do fundo?',
        answer:
          'Não existe hoje nenhuma operação de tamanho relevante dentro do fundo que vislumbramos impactos significativos nos próximos meses. O outro ativo com um potencial relevante de deterioração representa menos de 0,30% do Patrimônio Líquido do fundo hoje.',
      },
      {
        question: 'A sequência de retornos abaixo do CDI do Empírica Lótus IPCA, entre agosto/2022 e março/2023, se deve unicamente ao carrego de IPCA mais baixo nesse período, ou a resgates massivos no fundo?',
        answer:
          'Se deve exclusivamente ao carrego do IPCA mais baixo nesse período.',
      },
      {
        question: 'Os outros fundos geridos pela Empírica também podem ser fechados?',
        answer:
          'O fechamento do fundo foi uma decisão isolada para o **Empírica Lótus IPCA** devido ao grande volume de pedido de resgates, incompatível com a liquidez do fundo. Não vemos motivo para os investidores pedirem resgates dos outros fundos geridos pela Empírica em decorrência do fechamento do **Empírica Lótus IPCA**. No entanto, caso os demais fundos recebam um grande volume de resgates também incompatíveis com a liquidez do respectivo fundo, a Empírica deverá tomar a decisão de fechamento para resgates nos mesmos moldes adotados.',
      },
      {
        question: 'O aumento no volume de resgates do Empírica Lótus IPCA pode comprometer as operações dos demais FIDC da carteira?',
        answer:
          'Não. Os FIDC investidos pelo **Empírica Lótus IPCA** são fundos fechados, sem possibilidade de resgate. A liquidez necessária para a realização dos pagamentos de resgate decorre da venda das cotas dos FIDC investidos no mercado secundário ou de amortizações programadas de cotas.',
      },
    ],
    closing:
      '**Ficamos à disposição para maiores esclarecimentos, em nossa área de Distribuição & Relações com Investidores, pelo e-mail **[distribuicao@empirica.com.br](mailto:distribuicao@empirica.com.br)',
  },

  /* ── Empírica Lótus IPCA — Plano de Ação ────────────────────────────────── */
  'empirica-lotus-ipca-plano-acao': {
    fundTitle: 'Empírica Lótus IPCA',
    pageTitle: 'Plano de Ação',
    items: [
      {
        question: 'Qual é a abrangência do Plano de Ação proposto?',
        answer:
          'Ele abrange todos os Cotistas do **Empírica Lótus IPCA**, incluindo aqueles que solicitaram resgates antes do fechamento do Fundo e que ainda não tiveram seus pedidos de resgate processados (e, portanto, não foram pagos).',
      },
      {
        question: 'Que opções estão sendo propostas aos Cotistas?',
        answer:
          'Os Cotistas que solicitaram resgate de cotas antes da data do fechamento do Fundo poderão optar por:\n\n(i) Cancelar seu pedido de resgate, total ou parcialmente;\n\n(ii) Manter seu pedido de resgate já efetuado; ou\n\n(iii) Pedir o resgate total, se o pedido anterior for parcial.\n\nOs Cotistas que não solicitaram resgate de cotas antes da data do fechamento do Fundo poderão pedir o resgate de cotas, total ou parcialmente.',
      },
      {
        question: 'Caso eu tenha solicitado resgate de cotas antes do fechamento do Fundo, o que acontece se eu não encaminhar a minha intenção de cancelamento ou manutenção de resgate?',
        answer:
          'Os resgates de cotas solicitados antes do fechamento do Fundo serão presumidos como mantidos, ou seja, não haverá o cancelamento do resgate anteriormente solicitado.',
      },
      {
        question: 'Caso eu não tenha solicitado resgate de cotas antes de fechamento do Fundo, poderei solicitar agora?',
        answer:
          'Sim, até o término do prazo para encaminhamento da intenção de resgate, total ou parcial, previsto no Edital de Convocação.',
      },
      {
        question: 'O que acontece se eu não tiver solicitado resgate antes do fechamento do Fundo e não encaminhar a minha intenção de resgate?',
        answer:
          'Suas cotas serão mantidas no Fundo e somente poderão ser resgatadas após a reabertura deste para aplicações e resgates, conforme prazos e procedimentos previstos no regulamento do Fundo.\n\nSerão desconsiderados os pedidos de resgate (i) solicitados após a Assembleia e até a reabertura do Fundo; ou (ii) que contenham informações incompletas e/ou incompatíveis com a posição detida pelo respectivo Cotista.',
      },
      {
        question: 'Quando o Fundo será reaberto para aplicações e resgates ordinários de cotas?',
        answer:
          'Isso ocorrerá após o pagamento integral dos resgates solicitados antes da data de fechamento do Fundo ou no âmbito da Assembleia Geral de Cotistas (AGC). Após a reabertura do Fundo, as aplicações e resgates observarão os prazos e procedimentos previstos no regulamento do mesmo.',
      },
      {
        question: 'Durante o período em que o resgate ficou suspenso, vai haver cobrança de taxa de administração?',
        answer:
          'Sim. Embora o fundo esteja fechado para resgates, as atividades do fundo estão em funcionamento normal.',
      },
      {
        question: 'Quando serão pagos os resgates mantidos e solicitados?',
        answer:
          'Os pedidos de resgate serão pagos conforme ordem de prioridade definida na AGC e em regime de caixa, ou seja, a disponibilidade de caixa para os referidos pagamentos será apurada pela Gestora por meio da soma dos recursos provenientes de amortizações e resgates dos fundos investidos pelo Fundo e da venda de ativos integrantes da sua carteira, descontadas as reservas, provisões e encargos do Fundo.\n\nO pagamento em regime de caixa permitirá que a Gestora venda os ativos integrantes da carteira buscando obter valores melhores e de forma não forçada.\n\nO primeiro pagamento de resgate será realizado no dia **12 de setembro de 2023**.',
      },
      {
        question: 'Haverá alguma ordem de prioridade para o pagamento dos resgates de cotas?',
        answer:
          'A ordem de prioridade será deliberada pela AGC, por meio da manifestação de votos dos Cotistas.',
      },
      {
        question: 'Quais são as alternativas de ordem de prioridade a serem votadas pelo Cotista no âmbito da AGC?',
        answer:
          '**(i) Resgate pro rata:** realização do resgate de maneira proporcional ao valor do pedido de resgate efetuado por cada um dos Cotistas, com relação à totalidade dos pedidos solicitados, simultaneamente entre todos os Cotistas e independentemente da data em que enviaram seu pedido de resgate.\n\n**(ii) Resgate por ordem cronológica:** para os pedidos efetuados até a data de fechamento do Fundo, tais pedidos serão considerados prioritários e os resgates serão realizados em ordem cronológica, sendo considerados comorientes todos os pedidos solicitados em um mesmo dia.',
      },
      {
        question: 'Em quais datas serão realizados a cotização e o pagamento dos resgates?',
        answer:
          'O primeiro pagamento de resgate será realizado no dia **12 de setembro de 2023** e os pagamentos subsequentes sempre no 7º (sétimo) dia útil de cada mês, considerando a cotização do 5º (quinto) dia útil do mesmo mês.',
      },
      {
        question: 'Quais são as alternativas para o Cotista que não aprovar o Plano de Ação?',
        answer:
          'Ele poderá votar pelas seguintes alternativas: (a) substituição da Administradora do Fundo; (b) substituição da Gestora do Fundo; (c) reabertura do Fundo para resgate; (d) manutenção do fechamento do Fundo para resgate; (e) possibilidade do pagamento de resgate em ativos financeiros; (f) cisão do Fundo; ou (g) liquidação do Fundo.',
      },
      {
        question: 'Onde posso obter mais informações sobre o Plano de Ação e esclarecer dúvidas adicionais?',
        answer:
          'A Gestora estará à disposição dos cotistas para o esclarecimento de dúvidas e questionamentos. Os esclarecimentos prestados permanecerão disponíveis para acesso de todos os investidores no site [empirica.com.br](https://empirica.com.br/)',
      },
    ],
    closing:
      '**Ficamos à disposição para maiores esclarecimentos, em nossa área de Distribuição & Relações com Investidores, pelo e-mail **[distribuicao@empirica.com.br](mailto:distribuicao@empirica.com.br)',
  },

  /* ── Empírica Lótus IPCA — Resultado da AGC ─────────────────────────────── */
  'empirica-lotus-ipca-agc-resultado': {
    fundTitle: 'Empírica Lótus IPCA',
    pageTitle: 'Resultado da Assembleia de Fechamento',
    pageSubtitle: 'Resultado da AGC',
    items: [
      {
        question: 'A Assembleia Extraordinária de Cotistas (AGC), realizada em 17/07/2023, aprovou o Plano de Ação proposto pela Empírica?',
        answer:
          'Sim, o Plano de Ação foi aprovado na AGC realizada no dia **17/07/2023**, por maioria de votos.',
      },
      {
        question: 'Onde encontro o comunicado oficial sobre o resultado da AGC?',
        answer:
          'Acesse o site [https://sistemas.cvm.gov.br/](https://sistemas.cvm.gov.br/);\n\nClique em "Consulta a Fundos";\n\nClique em "Fundos de Investimentos";\n\nDigite **22.652.091/0001-82** em "CNPJ";\n\nClique em "continuar";\n\nClique em "EMPÍRICA LÓTUS IPCA FI EM COTAS DE FUNDOS DE INVESTIMENTO MULTIMERCADO CRÉDITO PRIVADO".',
      },
      {
        question: 'Na apuração dos votos, foi levada em consideração a quantidade de cotas detidas por cada Cotista, ou foi atribuído o mesmo peso ao voto de cada um dos Cotistas?',
        answer:
          'Nos termos do Art. 71 da Instrução CVM nº 555 de 2014, cada cota equivale a 1 (um) voto sendo, portanto, levada em consideração a quantidade de cotas detida por cada Cotista.',
      },
      {
        question: 'Quantos cotistas votaram?',
        answer:
          '**2.431 votos**, representando **43,05%** do fundo.',
      },
      {
        question: 'Que ordem de prioridade foi aprovada para fins de recebimento dos resgates?',
        answer:
          'Na AGC, por maioria de votos, a ordem de prioridade de resgates aprovada foi o resgate **PRO RATA**.',
      },
      {
        question: 'Como funcionará o resgate pro rata?',
        answer:
          'Ele será realizado de maneira proporcional ao valor do pedido de resgate efetuado por cada um dos Cotistas, com relação à totalidade dos pedidos solicitados, simultaneamente entre todos os Cotistas e independentemente da data em que enviaram sua solicitação.\n\nOs resgates serão pagos em regime de caixa, ou seja, a disponibilidade de caixa para os referidos pagamentos será apurada pela Gestora, por meio da soma dos recursos provenientes de amortizações e resgates dos fundos investidos, além da venda de ativos integrantes da carteira do Fundo.\n\nPor exemplo, supondo um volume total de resgates de R$ 100 milhões e que no dia 12/09/2023 o fundo possua um caixa líquido de R$ 10 milhões, todos os Cotistas receberão **10% do valor resgatado**.',
      },
      {
        question: 'Quando será realizado o primeiro pagamento de resgate?',
        answer:
          'Conforme o Plano de Ação aprovado na AGC, ele será realizado no dia **12/09/2023**.',
      },
      {
        question: 'Quando serão realizados os pagamentos subsequentes?',
        answer:
          'A cotização dos pedidos ocorrerá no **5º (quinto) dia útil** de cada mês, com pagamento no **7º (sétimo) dia útil**. Os resgates serão realizados até o limite da disponibilidade de caixa estabelecido pela Gestora, havendo a possibilidade de resgate parcial entre os Cotistas caso haja insuficiência de recursos.',
      },
      {
        question: 'Como o Cotista vai poder acompanhar o cronograma de pagamentos dos resgates?',
        answer:
          'A Empírica, gestora do fundo, soltará um Comunicado todos os meses informando o saldo total de resgates, saldo pago e saldo restante.',
      },
      {
        question: 'Qual o volume total de resgates solicitados?',
        answer:
          'O volume total de resgates corresponde a **59,24% do PL do fundo**, ou **R$ 565 milhões** considerando a cota do dia 29/07/2023.',
      },
      {
        question: 'Existe alguma previsão de prazo para quitar todo o volume de resgates solicitado?',
        answer:
          'Não existe prazo mínimo para liquidar todos os resgates solicitados. A área de Gestão da Empírica está envidando os melhores esforços para realizar a venda dos ativos, sempre observando o melhor interesse financeiro dos investidores. A nossa previsão neste momento é de aproximadamente **10 a 12 meses** de prazo.',
      },
      {
        question: 'O que acontecerá se o Gestor não conseguir gerar caixa suficiente para honrar todos os resgates solicitados?',
        answer:
          'Não vemos como possível essa situação.',
      },
      {
        question: 'Os Cotistas que não solicitaram resgate, mas que vierem a desejar fazê-lo no futuro, deverão aguardar a quitação de todos os pagamentos pendentes?',
        answer:
          'Os cotistas que não solicitaram resgate até a data da AGC deverão aguardar a reabertura do Fundo para novas solicitações de resgates. Ainda não há prazo para que o Fundo seja reaberto para novos pedidos de resgate.',
      },
      {
        question: 'Houve um montante relevante de cotistas que resolveram permanecer no Fundo?',
        answer:
          '**40,76%** dos cotistas decidiram permanecer no Fundo.',
      },
      {
        question: 'Por que as aplicações no Fundo não serão retomadas, de forma a aumentar o caixa e quitar os resgates mais rapidamente?',
        answer:
          'Conforme disposto no parágrafo 4º do Art. 39 da Instrução CVM nº 555 de 2014, o Fundo deve permanecer fechado para aplicações enquanto perdurar o período de suspensão de resgates.',
      },
      {
        question: 'Quando o Fundo será reaberto para aplicações e resgates ordinários de cotas?',
        answer:
          'Isso ocorrerá após o pagamento integral dos resgates que foram solicitados até a AGC. Após a reabertura do Fundo, as aplicações e resgates observarão os prazos e procedimentos previstos no regulamento do Fundo.',
      },
      {
        question: 'Como o Fundo conseguirá se manter rentável para os Cotistas que não solicitaram resgates?',
        answer:
          'A área de Gestão da Empírica está envidando os melhores esforços para realizar a venda dos ativos, sempre observando o melhor interesse financeiro dos investidores, bem como possui um controle e monitoramento do pagamento das amortizações programadas dos fundos investidos pelo **Empírica Lótus IPCA**. Importante informar também que a Gestora continua atuando de forma ativa para recuperação do FIDC Energia Solar.',
      },
      {
        question: 'O Comunicado do Gestor traz três cenários distintos (Otimista/Base/Pessimista). Quais são as premissas por trás de cada um?',
        answer:
          '**Cenário Pessimista:** nada é alterado em relação à situação atual e a PDD do FIDC Energia Solar migra para 100%.\n\n**Cenário Base:** a Insole Energia Solar distribui a ação de recuperação judicial e recebe aportes suficientes para homologar contratos instalados, atingindo 70% de entregas performadas até dezembro de 2023, fazendo a PDD cair para 50%.\n\n**Cenário Otimista:** a Insole performa todos os contratos instalados até dezembro de 2023, fazendo a PDD cair para 35%.',
      },
    ],
    closing:
      '**Ficamos à disposição para maiores esclarecimentos, em nossa área de Distribuição & Relações com Investidores, pelo e-mail **[distribuicao@empirica.com.br](mailto:distribuicao@empirica.com.br)',
  },

};
