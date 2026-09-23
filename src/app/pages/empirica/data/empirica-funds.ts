/**
 * empirica-funds.ts — Dados centralizados dos fundos SRM Empírica
 * Fonte: srmempirica-site-map.md + CSV srm_empirica_cms__1__
 * Nunca inventar conteúdo: campos sem dados = string vazia → UI mostra aviso.
 */

export type FundCategory = 'fidc' | 'fif' | 'fii' | 'fip';

export interface FundInfo {
  slug: string;
  /** Nome exibido no botão card da listagem */
  shortName: string;
  /** Nome legal completo exibido na página do fundo */
  fullName: string;
  category: FundCategory;
  cnpj?: string;
  regulamentacao?: string;
  gestao?: string;
  politicaInvestimento?: string;
  rentabilidade?: string;
  publicoAlvo?: string;
  tributacao?: string;
  taxaAdministracao?: string;
  taxaPerformance?: string;
  taxaCarencia?: string;
  /** Texto completo exibido no modal "Condições de Enquadramento" */
  enquadramentoText?: string;
}

// ─── Gestão padrão (todos os fundos) ─────────────────────────────────────────
const GESTAO  = 'SRM Empírica Gestão de Crédito Ltda.';
const PUBLICO = 'Investidores Qualificados e/ou Investidores Profissionais.';

// ─── Textos do modal "Condições de Enquadramento" ────────────────────────────
const ENQ_FIDC =
  'Se mantido o enquadramento da alocação mínima tributária em ativos que configurem como direitos creditórios (67% do patrimônio líquido do fundo) e como entidade de investimento, conforme previsto na Lei 14.754 de 12 de dezembro de 2023 e Resolução CMN N° 5.111, de 21 de dezembro de 2023, o fundo estará enquadrado no Regime Específico dos Fundos Não Sujeitos à Tributação Periódica e, portanto, a alíquota de 15% na distribuição de rendimentos, amortização ou resgate de cotas será a regra. Se houver o desenquadramento do Regime Específico dos Fundos Não Sujeitos à Tributação Periódica, o fundo estará sujeito ao IRRF de 15% quando tratar-se de um fundo de longo prazo* ou 20% quando tratar-se de um fundo de curto prazo*, os rendimentos das aplicações, neste caso, ficarão sujeitos à retenção do IRRF na fonte, nas seguintes datas: (i) no último dia útil dos meses de maio e novembro; ou (ii) na data da distribuição de rendimentos, da amortização ou do resgate de cotas, caso ocorra antes. Além disso, no momento da distribuição de rendimentos, amortização ou regate de cotas, deverá ser recolhida a alíquota complementar, caso cabível. (*) conforme definição das Leis n° 11.033 de 21 de dezembro de 2004 e n° 11.053 de 29 de dezembro de 2004, respectivamente.';

const ENQ_FIF =
  'A aplicação do Regime Específico dos Fundos Não Sujeitos à Tributação Periódica está condicionada ao enquadramento de 95% do patrimônio líquido do fundo em fundos de investimento sujeitos ao Regime Específico dos Fundos Não Sujeitos à Tributação Periódica, nos termos da Lei 14.754 de 12 de dezembro de 2023. Se não enquadrado: IRRF de 15% (longo prazo) ou 20% (curto prazo), com retenção no último dia útil dos meses de maio e novembro; ou na data da distribuição de rendimentos, da amortização ou do resgate de cotas, caso ocorra antes. Além disso, no momento da distribuição de rendimentos, amortização ou resgate de cotas, deverá ser recolhida a alíquota complementar (diferença entre a alíquota do come-cotas e a alíquota efetiva da tabela regressiva no tempo de 22,5% a 15%).';

// ─── FIDC — 28 fundos ────────────────────────────────────────────────────────
export const FIDC_FUNDS: FundInfo[] = [
  {
    slug: 'befly-fidc-responsabilidade-limitada',
    shortName: 'BEFLY FIDC RESPONSABILIDADE LIMITADA',
    fullName: 'BEFLY FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS RESPONSABILIDADE LIMITADA',
    category: 'fidc',
    cnpj: '59.356.952/0001-95',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    politicaInvestimento:
      'Aquisição predominante de direitos creditórios elegíveis oriundos de operações de pagamento, cedidos diretamente pelo cedente, adquiridos de forma integral e discricionária conforme legislação vigente.',
    rentabilidade:
      'A rentabilidade estará descrita nos suplementos de cada emissão de Cotas Sêniores.',
    publicoAlvo: PUBLICO,
    tributacao: '15% sobre distribuição de rendimentos; amortização ou resgate de cotas.',
    taxaAdministracao:
      '0,24% a.a. (PL até R$50M) ou 0,20% a.a. (acima de R$50M); mínimo mensal R$13.200,00.',
    taxaPerformance: 'Não aplicável.',
    taxaCarencia: 'Não aplicável.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'condoconta-fidc',
    shortName: 'CONDOCONTA FIDC',
    fullName: 'CONDOCONTA FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS – NÃO PADRONIZADOS',
    category: 'fidc',
    cnpj: '44.395.545/0001-10',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: 'Investidores Profissionais.',
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'dotz-fidc-responsabilidade-limitada',
    shortName: 'DOTZ FIDC RESPONSABILIDADE LIMITADA',
    fullName: 'DOTZFIN FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS – RESPONSABILIDADE LIMITADA',
    category: 'fidc',
    cnpj: '59.827.367/0001-26',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: 'Investidores Qualificados.',
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'empirica-lotus-plus-fic-fidc',
    shortName: 'EMPÍRICA LÓTUS PLUS FIC FIDC',
    fullName:
      'EMPÍRICA LOTUS PLUS FUNDO DE INVESTIMENTO EM COTAS DE FUNDOS DE INVESTIMENTOS EM DIREITOS CREDITÓRIOS',
    category: 'fidc',
    cnpj: '20.147.269/0001-02',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: 'Investidores Profissionais.',
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fidc-bizcapital-empirica-pme-responsabilidade-limitada',
    shortName: 'FIDC BIZCAPITAL EMPÍRICA PME RESPONSABILIDADE LIMITADA',
    fullName: 'FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS BIZCAPITAL EMPÍRICA PME',
    category: 'fidc',
    cnpj: '31.368.812/0001-18',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    politicaInvestimento: 'Alocação mínima de 67% em direitos creditórios conforme Lei 14.754.',
    publicoAlvo: PUBLICO,
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fidc-bizcapital-finpass-pme-responsabilidade-limitada',
    shortName: 'FIDC BIZCAPITAL FINPASS PME RESPONSABILIDADE LIMITADA',
    fullName: 'FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS BIZCAPITAL FINPASS PME',
    category: 'fidc',
    cnpj: '42.432.319/0001-36',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: 'Investidores Qualificados.',
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fidc-empirica-a55-saas',
    shortName: 'FIDC EMPÍRICA A55 SAAS',
    fullName: 'FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS EMPIRICA A55 SAAS',
    category: 'fidc',
    cnpj: '28.849.649/0001-09',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: PUBLICO,
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fidc-empirica-futuro-previdencia-consignado-publico-iii',
    shortName: 'FIDC EMPÍRICA FUTURO PREVIDÊNCIA CONSIGNADO PÚBLICO III RESPONSABILIDADE LIMITADA',
    fullName:
      'FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS FUTURO CONSIGNADO PÚBLICO III RESPONSABILIDADE LIMITADA',
    category: 'fidc',
    cnpj: '55.072.790/0001-02',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    politicaInvestimento:
      'Mínimo 67% do patrimônio em direitos creditórios conforme Lei 14.754.',
    publicoAlvo: 'Investidores Qualificados.',
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fidc-empirica-imobiliario',
    shortName: 'FIDC EMPÍRICA IMOBILIÁRIO',
    fullName: 'FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS EMPÍRICA IMOBILIÁRIO',
    category: 'fidc',
    cnpj: '25.235.009/0001-02',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: PUBLICO,
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fidc-empirica-imobiliario-multi',
    shortName: 'FIDC EMPÍRICA IMOBILIÁRIO MULTI',
    fullName: 'FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS EMPÍRICA IMOBILIÁRIO MULTI',
    category: 'fidc',
    cnpj: '26.812.976/0001-52',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: PUBLICO,
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fidc-empirica-launchpad',
    shortName: 'FIDC EMPÍRICA LAUNCHPAD',
    fullName: 'FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS EMPÍRICA LAUNCHPAD',
    category: 'fidc',
    cnpj: '42.739.077/0001-28',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: 'Investidores Profissionais.',
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fic-fidc-empirica-lotus-hy',
    shortName: 'FIC FIDC EMPÍRICA LÓTUS HY',
    fullName:
      'FUNDO DE INVESTIMENTO EM COTAS DE FUNDOS DE INVESTIMENTOS EM DIREITOS CREDITÓRIOS EMPÍRICA LÓTUS HY',
    category: 'fidc',
    cnpj: '40.905.548/0001-03',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: 'Investidores Profissionais.',
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fidc-empirica-mezzo-saude',
    shortName: 'FIDC EMPÍRICA MEZZO SAÚDE',
    fullName: 'FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS EMPÍRICA MEZZO SAÚDE',
    category: 'fidc',
    cnpj: '34.475.955/0001-17',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: PUBLICO,
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fidc-empirica-noverde-credito-pessoal',
    shortName: 'FIDC EMPÍRICA NOVERDE CRÉDITO PESSOAL',
    fullName: 'FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS EMPÍRICA NOVERDE CRÉDITO PESSOAL',
    category: 'fidc',
    cnpj: '26.758.072/0001-96',
    regulamentacao: 'Resolução CVM 175, de 23 de dezembro de 2022',
    gestao: GESTAO,
    publicoAlvo: PUBLICO,
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fidc-empirica-oportuna-precatorios-federais',
    shortName: 'FIDC EMPÍRICA OPORTUNA PRECATÓRIOS FEDERAIS RESPONSABILIDADE LIMITADA',
    fullName:
      'FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS EMPÍRICA OPORTUNA PRECATÓRIOS FEDERAIS',
    category: 'fidc',
    cnpj: '23.076.742/0001-04',
    regulamentacao: 'Resolução CVM 175, de 23 de dezembro de 2022',
    gestao: GESTAO,
    publicoAlvo: PUBLICO,
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fidc-empirica-premier-capital-multisetorial-longo-prazo',
    shortName: 'FIDC EMPÍRICA PREMIER CAPITAL MULTISETORIAL LONGO PRAZO',
    fullName:
      'FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS EMPÍRICA PREMIER CAPITAL MULTISETORIAL LONGO PRAZO',
    category: 'fidc',
    cnpj: '23.669.183/0001-38',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: 'Investidores Qualificados e/ou Profissionais.',
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fidc-empirica-recebiveis-imobiliarios',
    shortName: 'FIDC EMPÍRICA RECEBÍVEIS IMOBILIÁRIOS',
    fullName:
      'FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS EMPÍRICA RECEBÍVEIS IMOBILIÁRIOS',
    category: 'fidc',
    cnpj: '38.948.969/0001-61',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: PUBLICO,
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fidc-energia-solar',
    shortName: 'FIDC ENERGIA SOLAR',
    fullName: 'FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS ENERGIA SOLAR',
    category: 'fidc',
    cnpj: '34.508.740/0001-55',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: PUBLICO,
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fidc-home-equity',
    shortName: 'FIDC HOME EQUITY',
    fullName: 'FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS EMPÍRICA HOME EQUITY',
    category: 'fidc',
    cnpj: '17.334.148/0001-65',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    politicaInvestimento: 'Alocação mínima de 67% em direitos creditórios.',
    publicoAlvo: PUBLICO,
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fidc-loteamento',
    shortName: 'FIDC LOTEAMENTO',
    fullName: 'FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS LOTEAMENTO',
    category: 'fidc',
    cnpj: '27.467.600/0001-10',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: 'Investidores Qualificados e/ou Profissionais.',
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fidc-open-pme-segmento-financeiro',
    shortName: 'FIDC OPEN PME I',
    fullName:
      'FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS OPEN PME I RESPONSABILIDADE LIMITADA',
    category: 'fidc',
    cnpj: '52.306.146/0001-63',
    regulamentacao: 'Resolução CVM 175',
    gestao: GESTAO,
    politicaInvestimento:
      'Aquisição de direitos creditórios elegíveis e/ou ativos financeiros conforme regulamento.',
    rentabilidade: 'De acordo com cada emissão.',
    publicoAlvo: 'Investidores Qualificados e Profissionais.',
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    taxaAdministracao:
      '0,20% a.a. (PL até R$100M) ou 0,15% (acima de R$100M); mínimo R$20.000,00/mês.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fidc-pagbem',
    shortName: 'FIDC PAGBEM',
    fullName: 'FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS PAGBEM',
    category: 'fidc',
    cnpj: '31.368.761/0001-24',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    politicaInvestimento:
      'Proporcionar valorização de cotas através de aplicação em direitos creditórios e ativos financeiros conforme critérios do Regulamento.',
    publicoAlvo: 'Investidores Profissionais.',
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'fidc-premier',
    shortName: 'FIDC PREMIER',
    fullName: 'FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS PREMIER',
    category: 'fidc',
    cnpj: '23.293.595/0001-16',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: 'Investidores Qualificados e/ou Profissionais.',
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'gran-empirica-lotus-fic-fidc',
    shortName: 'GRAN EMPÍRICA LÓTUS FIC FIDC',
    fullName:
      'GRAN EMPÍRICA LÓTUS FUNDO DE INVESTIMENTO EM COTAS DE FUNDOS DE INVESTIMENTOS EM DIREITOS CREDITÓRIOS',
    category: 'fidc',
    cnpj: '41.574.684/0001-12',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: 'Investidores Profissionais.',
    tributacao:
      'IRRF 15% (distribuições) sob Regime Específico; ou 15%/20% conforme prazo se desenquadrado.',
    enquadramentoText: ENQ_FIDC,
  },
  {
    slug: 'qi-ei-fic-fidc',
    shortName: 'QI EI FIC FIDC',
    fullName:
      'QI EI FUNDO DE INVESTIMENTO EM COTAS DE FUNDOS DE INVESTIMENTOS EM DIREITOS CREDITÓRIOS',
    category: 'fidc',
    cnpj: '31.353.300/0001-88',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: 'Investidores Qualificados.',
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    enquadramentoText: ENQ_FIDC,
  },
];

// ─── FIF — 6 fundos ──────────────────────────────────────────────────────────
export const FIF_FUNDS: FundInfo[] = [
  {
    slug: 'ei-ie-fif-em-cotas-de-fim',
    shortName: 'EI IE FIF EM COTAS DE FIM',
    fullName:
      'EI IE FUNDO DE INVESTIMENTO FINANCEIRO EM COTAS DE FUNDO DE INVESTIMENTOS MULTIMERCADO',
    category: 'fif',
    cnpj: '34.582.493/0001-37',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    politicaInvestimento:
      'Investir preponderantemente, direta ou indiretamente, em FIDCs e fundos de crédito.',
    publicoAlvo: 'Investidores Profissionais.',
    tributacao:
      'Condicional ao enquadramento de 95% dos ativos; IRRF de 15% a 22,5% conforme classificação.',
    enquadramentoText: ENQ_FIF,
  },
  {
    slug: 'empirica-lotus-fif-em-cotas-de-fim',
    shortName: 'EMPÍRICA LÓTUS FIF EM COTAS DE FIM',
    fullName:
      'EMPÍRICA LÓTUS FUNDO DE INVESTIMENTO FINANCEIRO EM COTAS DE FUNDOS DE INVESTIMENTO MULTIMERCADO',
    category: 'fif',
    cnpj: '17.251.743/0001-37',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: 'Investidores Qualificados.',
    rentabilidade: 'CDI + spread (conforme emissão).',
    tributacao: 'IRRF 15% (Regime Específico) ou 15%–20% conforme prazo.',
    taxaAdministracao: '0,10% a.a. sobre PL.',
    taxaPerformance: '20% sobre o que exceder 100% do CDI (semestral).',
    taxaCarencia: 'D+90 corrido (conversão) / D+1 útil (pagamento).',
    enquadramentoText: ENQ_FIF,
  },
  {
    slug: 'empirica-pagaya-us-consumer-fif-multimercado',
    shortName: 'EMPÍRICA PAGAYA US CONSUMER FIF MULTIMERCADO',
    fullName:
      'EMPIRICA PAGAYA US CONSUMER LENDING FUNDO DE INVESTIMENTO FINANCEIRO MULTIMERCADO',
    category: 'fif',
    cnpj: '40.698.601/0001-34',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    politicaInvestimento:
      'Ganhos de capital via operações em mercados de juros, índices de preço, câmbio e dívida; usando derivativos, hedge, arbitragem e alavancagem.',
    publicoAlvo: 'Investidor Profissional.',
    tributacao:
      '15% retido na fonte sobre distribuições; resgates ou amortizações.',
    enquadramentoText: ENQ_FIF,
  },
  {
    slug: 'empirica-soberano-fif-renda-fixa',
    shortName: 'EMPÍRICA SOBERANO FIF RENDA FIXA',
    fullName: 'EMPIRICA SOBERANO FUNDO DE INVESTIMENTO FINANCEIRO RENDA FIXA',
    category: 'fif',
    cnpj: '17.249.303/0001-45',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    politicaInvestimento:
      'Operações em títulos públicos federais e compromissadas lastreadas, acompanhando variações do CDI.',
    publicoAlvo: 'Investidores em geral.',
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    taxaCarencia: 'D+0 (conversão) / D+0 (pagamento).',
    enquadramentoText: ENQ_FIF,
  },
  {
    slug: 'empirica-lotus-ipca-fif-em-cotas-de-fim',
    shortName: 'EMPÍRICA LÓTUS IPCA FIF EM COTAS DE FIM',
    fullName:
      'EMPÍRICA LÓTUS IPCA FUNDO DE INVESTIMENTO FINANCEIRO EM COTAS DE FUNDOS DE INVESTIMENTO MULTIMERCADO',
    category: 'fif',
    cnpj: '22.652.091/0001-82',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: 'Investidores Qualificados.',
    rentabilidade: 'IPCA + spread (conforme emissão).',
    tributacao:
      '15% (longo prazo) ou 20% (curto prazo); 15% retido sob Regime Específico.',
    taxaAdministracao: '0,10% a.a. sobre PL.',
    taxaPerformance: 'Não aplicável.',
    taxaCarencia: 'D+120 corrido (conversão) / D+1 útil (pagamento).',
    enquadramentoText: ENQ_FIF,
  },
  {
    slug: 'empirica-fx-usd-4-fif-multimercado',
    shortName: 'EMPÍRICA FX USD 4 FIF MULTIMERCADO',
    fullName: 'EMPÍRICA FX USD 4 FUNDO DE INVESTIMENTO FINANCEIRO MULTIMERCADO',
    category: 'fif',
    cnpj: '41.881.188/0001-01',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    politicaInvestimento:
      'Aplicar recursos em ativos financeiros de renda fixa de diferentes naturezas; estratégias vendidas até 5x o PL em dólares americanos.',
    publicoAlvo: 'Investidores Qualificados.',
    tributacao: '15% na distribuição de rendimentos; amortização ou resgate de cotas.',
    taxaCarencia: 'D+0 corridos (conversão) / D+1 útil (pagamento).',
    enquadramentoText: ENQ_FIF,
  },
];

// ─── FII — 1 fundo ───────────────────────────────────────────────────────────
export const FII_FUNDS: FundInfo[] = [
  {
    slug: 'empirica-recebiveis-imobiliarios-fii-responsabilidade-limitada',
    shortName: 'EMPÍRICA RECEBÍVEIS IMOBILIÁRIOS FII RESPONSABILIDADE LIMITADA',
    fullName:
      'EMPÍRICA RECEBÍVEIS IMOBILIÁRIOS FUNDO DE INVESTIMENTO IMOBILIÁRIO RESPONSABILIDADE LIMITADA',
    category: 'fii',
    cnpj: '45.188.124/0001-80',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    publicoAlvo: 'Investidores Qualificados.',
    rentabilidade: 'Rendimentos da carteira imobiliária.',
    tributacao:
      'Rendimentos da carteira não sujeitos ao IR (exceto ganhos em aplicações financeiras específicas); isenção conforme Lei 8.668/1993.',
  },
];

// ─── FIP — 1 fundo ───────────────────────────────────────────────────────────
export const FIP_FUNDS: FundInfo[] = [
  {
    slug: 'empirica-nv-fip-multiestrategia-responsabilidade-limitada',
    shortName: 'EMPÍRICA NV FIP MULTIESTRATÉGIA RESPONSABILIDADE LIMITADA',
    fullName:
      'EMPÍRICA NV FUNDO DE INVESTIMENTO EM PARTICIPAÇÕES MULTIESTRATÉGIA RESPONSABILIDADE LIMITADA',
    category: 'fip',
    cnpj: '27.894.553/0001-82',
    regulamentacao: 'RCVM 175',
    gestao: GESTAO,
    politicaInvestimento:
      'Valorização do capital via aquisição de ativos-alvo, participando do processo decisório das sociedades investidas.',
    publicoAlvo: 'Investidor Profissional.',
    tributacao:
      'IRRF 15% em distribuições (Regime Específico) ou 15%–20% conforme prazo; com alíquota complementar até 22,5%.',
    enquadramentoText: ENQ_FIDC,
  },
];

// ─── Index geral ──────────────────────────────────────────────────────────────
export const ALL_FUNDS: FundInfo[] = [
  ...FIDC_FUNDS,
  ...FIF_FUNDS,
  ...FII_FUNDS,
  ...FIP_FUNDS,
];

export function getFundsByCategory(category: FundCategory): FundInfo[] {
  switch (category) {
    case 'fidc': return FIDC_FUNDS;
    case 'fif':  return FIF_FUNDS;
    case 'fii':  return FII_FUNDS;
    case 'fip':  return FIP_FUNDS;
    default:     return [];
  }
}

export function getFundBySlug(category: FundCategory, slug: string): FundInfo | undefined {
  return getFundsByCategory(category).find(f => f.slug === slug);
}

export const CATEGORY_META: Record<FundCategory, { label: string; code: string; description: string; breadcrumb: string }> = {
  fidc: {
    code: 'FIDC',
    label: 'Fundo de Investimento em Direitos Creditórios',
    description: 'Pioneiros no mercado de FIDCs. Especialistas em operações não óbvias de crédito estruturado.',
    breadcrumb: 'FIDC',
  },
  fif: {
    code: 'FIF',
    label: 'Fundo de Investimento Financeiro',
    description: 'Fundos High Grade e High Yield com abordagem focada em crédito privado e diversificação setorial.',
    breadcrumb: 'FIF',
  },
  fii: {
    code: 'FII',
    label: 'Fundo de Investimento Imobiliário',
    description: 'Fundos imobiliários corporativos, high-end e monousuário, com estruturas Built-to-Suit e Sale-Lease-Back.',
    breadcrumb: 'FII',
  },
  fip: {
    code: 'FIP',
    label: 'Fundo de Investimento em Participações',
    description: 'Private equity, corporate venture capital e club deal com captação no Brasil e offshore.',
    breadcrumb: 'FIP',
  },
};
