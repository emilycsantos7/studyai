'use strict';

/* =========================================
   StudyAI — Knowledge Engine
   ========================================= */

// --- Category detection ---
const CATEGORY_KEYWORDS = {
  'Matemática': ['equaç','bhaskara','matemática','álgebra','geometria','função','trigonometria','estatística','probabilidade','cálculo','porcentagem','fração','derivada','integral','logaritmo','matriz','vetor','polinômio','progressão','combinatória'],
  'Física': ['newton','física','velocidade','acelera','termodinâmica','óptica','eletrostática','gravitação','cinemática','dinâmica','energia','ondas','eletromagnetismo','mecânica','pressão','temperatura','força'],
  'Química': ['química','estequiometria','termoquímica','tabela periódica','ácido','base','reaç','molar','soluções','gases','orgânica','ligação','elétron','átomo','mol ','óxido'],
  'Biologia': ['fotossíntese','biologia','célula','anatomia','genética','ecologia','evolução','fisiologia','dna','mitose','meiose','organismo','proteína','vírus','bactéria','reino'],
  'História': ['revolução','história','guerra','idade média','império','ditadura','roma','grécia','independência','feudalismo','república','monarquia','fascismo','colonização','escravidão','renascimento'],
  'Geografia': ['geografia','clima','relevo','urbanização','cartografia','geopolítica','biomas','hidrografia','população','migração','globalização','território'],
  'Tecnologia': ['python','programação','javascript','código','algoritmo','banco de dados','inteligência artificial','react','computação','software','hardware','rede','internet','machine learning'],
  'Idiomas': ['inglês','espanhol','português','gramática','redação','literatura','vocabulário','verbos','conjugação','sintaxe','morfologia'],
  'Finanças': ['contabilidade','finanças','juros','investimento','balanço','economia','mercado','imposto','inflação','pib','ativo','passivo','taxa'],
};

function detectCategory(topic) {
  const t = topic.toLowerCase();
  for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    if (kws.some(kw => t.includes(kw))) return cat;
  }
  return 'Geral';
}

function hasFormulas(category) {
  return ['Matemática','Física','Química','Finanças'].includes(category);
}

// --- ID generator ---
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// --- Curated Topics ---
const CURATED_TOPICS = {
  'equações do segundo grau': {
    category: 'Matemática',
    overview: {
      description: 'As equações do segundo grau (ou equações quadráticas) são equações polinomiais onde o maior expoente da variável é 2. Elas aparecem em problemas de física, engenharia, economia e no dia a dia.',
      goals: [
        'Identificar uma equação do segundo grau e seus coeficientes a, b e c',
        'Calcular o discriminante (Δ) e interpretar seus resultados',
        'Aplicar a fórmula de Bhaskara corretamente',
        'Encontrar as raízes reais e complexas da equação',
        'Resolver problemas práticos usando equações quadráticas',
      ],
      prerequisites: ['Operações básicas com números reais', 'Potenciação e radiciação', 'Equações do primeiro grau'],
      modules: ['Conceitos básicos', 'Identificação dos coeficientes', 'Discriminante Δ', 'Fórmula de Bhaskara', 'Exemplos resolvidos', 'Exercícios práticos', 'Revisão com flashcards', 'Teste final'],
    },
    explanations: {
      beginner: 'Uma equação do segundo grau tem a forma **ax² + bx + c = 0**, onde *a*, *b* e *c* são números reais e **a ≠ 0**. Imagine que você quer saber qual número, elevado ao quadrado, somado a outros termos, resulta em zero. A fórmula de Bhaskara nos dá a resposta! Se você jogar uma bola para cima, a trajetória dela forma uma parábola — e a equação do segundo grau descreve exatamente quando ela atinge o solo.',
      advanced: 'A equação quadrática geral ax² + bx + c = 0 possui discriminante Δ = b² − 4ac. Quando Δ > 0, existem duas raízes reais distintas x₁ e x₂. Quando Δ = 0, há uma raiz real dupla x₁ = x₂ = −b/2a. Quando Δ < 0, as raízes são complexas conjugadas: x = (−b ± i√|Δ|) / 2a. As raízes satisfazem as Relações de Girard: x₁ + x₂ = −b/a e x₁·x₂ = c/a, que permitem verificar resultados sem calcular as raízes individualmente.',
      concepts: [
        { label: 'Forma padrão', content: 'ax² + bx + c = 0, com a ≠ 0. O coeficiente "a" determina a abertura da parábola.', type: '' },
        { label: 'Discriminante', content: 'Δ = b² − 4ac. Determina a natureza das raízes sem precisar calculá-las.', type: 'warning' },
        { label: 'Fórmula de Bhaskara', content: 'x = (−b ± √Δ) / 2a. Fornece as duas raízes da equação.', type: 'accent' },
        { label: 'Relações de Girard', content: 'x₁ + x₂ = −b/a e x₁·x₂ = c/a. Úteis para verificação rápida.', type: 'success' },
      ],
      analogy: 'Pense na equação como o arco de uma bola chutada. O coeficiente "a" define se o arco abre para cima ou para baixo. As raízes são os pontos onde a bola toca o chão — pode haver dois pontos (Δ > 0), um ponto (Δ = 0, bola rasante) ou nenhum (Δ < 0, a bola nunca toca).',
      mistakes: [
        'Esquecer de verificar se a ≠ 0 antes de aplicar Bhaskara',
        'Calcular √Δ de um número negativo sem lembrar que o resultado é complexo',
        'Trocar os sinais ao identificar b e c',
        'Dividir apenas o numerador por 2a, esquecendo de dividir a expressão inteira',
        'Não simplificar a raiz quadrada de Δ quando possível',
      ],
      questions: [
        { q: 'Quais são os coeficientes da equação 3x² − 5x + 2 = 0?', a: 'a = 3, b = −5, c = 2' },
        { q: 'Qual é o valor de Δ para a equação x² − 4x + 4 = 0?', a: 'Δ = (−4)² − 4·1·4 = 16 − 16 = 0 (raiz dupla)' },
        { q: 'Quando uma equação do segundo grau não tem raízes reais?', a: 'Quando Δ = b² − 4ac < 0' },
      ],
    },
    formulas: [
      {
        name: 'Fórmula de Bhaskara',
        desc: 'Calcula as raízes de qualquer equação do segundo grau ax² + bx + c = 0',
        latex: 'x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}',
        variables: [
          { symbol: 'x', meaning: 'Raiz (solução) da equação' },
          { symbol: 'a', meaning: 'Coeficiente do termo quadrático (a ≠ 0)' },
          { symbol: 'b', meaning: 'Coeficiente do termo linear' },
          { symbol: 'c', meaning: 'Termo independente' },
          { symbol: '±', meaning: 'Gera duas raízes: x₁ (com +) e x₂ (com −)' },
        ],
        when: 'Sempre que você precisar resolver uma equação do tipo ax² + bx + c = 0 com a ≠ 0',
        validity: 'Válida para todos os valores reais de a, b e c, com a ≠ 0. Quando Δ < 0, as raízes são complexas.',
        example: {
          problem: 'Resolva: x² − 5x + 6 = 0',
          steps: [
            'Identifique os coeficientes: a = 1, b = −5, c = 6',
            'Calcule o discriminante: Δ = b² − 4ac = (−5)² − 4·1·6 = 25 − 24 = 1',
            'Calcule √Δ = √1 = 1',
            'Aplique Bhaskara: x = (−(−5) ± 1) / (2·1) = (5 ± 1) / 2',
            'x₁ = (5 + 1)/2 = 6/2 = 3',
            'x₂ = (5 − 1)/2 = 4/2 = 2',
            'Verificação: 3² − 5·3 + 6 = 9 − 15 + 6 = 0 ✓ e 2² − 5·2 + 6 = 4 − 10 + 6 = 0 ✓',
          ],
        },
        practice: { q: 'Resolva a equação 2x² + 7x + 3 = 0 usando a fórmula de Bhaskara.', a: 'a=2, b=7, c=3. Δ = 49−24 = 25. x = (−7±5)/4. x₁ = −2/4 = −1/2, x₂ = −12/4 = −3' },
        tip: 'Memorize "Negativo b, mais ou menos raiz de b² menos quatro ac, tudo sobre dois a". Repita em voz alta algumas vezes!',
        commonErrors: 'Trocar o sinal de b ao calcular −b, ou esquecer de dividir toda a expressão por 2a.',
      },
      {
        name: 'Discriminante (Δ)',
        desc: 'Determina a natureza das raízes sem precisar calcular Bhaskara',
        latex: '\\Delta = b^2 - 4ac',
        variables: [
          { symbol: 'Δ', meaning: 'Discriminante — decide quantas raízes reais existem' },
          { symbol: 'b²', meaning: 'Quadrado do coeficiente do termo linear' },
          { symbol: '4ac', meaning: '4 vezes o produto dos coeficientes a e c' },
        ],
        when: 'Use antes de Bhaskara para saber se existem raízes reais e se são iguais ou distintas',
        validity: 'Sempre aplicável a equações do segundo grau completas e incompletas',
        example: {
          problem: 'Determine a natureza das raízes de x² + 2x + 5 = 0',
          steps: [
            'Identifique: a = 1, b = 2, c = 5',
            'Calcule Δ = 2² − 4·1·5 = 4 − 20 = −16',
            'Como Δ = −16 < 0, não há raízes reais',
            'A equação possui duas raízes complexas conjugadas',
          ],
        },
        practice: { q: 'Sem calcular as raízes, determine a natureza de x² − 6x + 9 = 0.', a: 'Δ = 36 − 36 = 0 → raiz real dupla (x₁ = x₂ = 3)' },
        tip: 'Δ > 0: dois ✌️ | Δ = 0: um ☝️ | Δ < 0: nenhum real ❌',
        commonErrors: 'Calcular b² − 4·a·c esquecendo de multiplicar 4 por AMBOS a e c.',
      },
    ],
    flashcards: [
      { id: 'eq2_fc1', front: 'Qual a forma padrão de uma equação do segundo grau?', back: 'ax² + bx + c = 0, onde a, b, c são reais e a ≠ 0' },
      { id: 'eq2_fc2', front: 'O que é o discriminante Δ e como calculá-lo?', back: 'Δ = b² − 4ac. Determina a natureza das raízes da equação.' },
      { id: 'eq2_fc3', front: 'O que significa Δ > 0, Δ = 0 e Δ < 0?', back: 'Δ > 0: duas raízes reais distintas\nΔ = 0: uma raiz real dupla\nΔ < 0: sem raízes reais' },
      { id: 'eq2_fc4', front: 'Escreva a fórmula de Bhaskara de memória.', back: 'x = (−b ± √Δ) / 2a' },
      { id: 'eq2_fc5', front: 'Quais são as Relações de Girard?', back: 'x₁ + x₂ = −b/a\nx₁ · x₂ = c/a' },
    ],
    exercises: [
      {
        type: 'multiple',
        difficulty: 'Fácil',
        question: 'Quais são os coeficientes a, b e c da equação 2x² − 3x + 1 = 0?',
        options: ['a=2, b=3, c=1', 'a=2, b=−3, c=1', 'a=1, b=−3, c=2', 'a=2, b=−3, c=−1'],
        correct: 1,
        explanation: 'Na forma ax² + bx + c = 0, comparando com 2x² − 3x + 1 = 0: a = 2, b = −3 (sinal negativo incluso) e c = 1.',
        skill: 'Identificação de coeficientes',
      },
      {
        type: 'multiple',
        difficulty: 'Médio',
        question: 'Qual é o valor do discriminante Δ da equação x² − 4x + 4 = 0?',
        options: ['Δ = 0', 'Δ = 32', 'Δ = −16', 'Δ = 8'],
        correct: 0,
        explanation: 'Δ = b² − 4ac = (−4)² − 4·1·4 = 16 − 16 = 0. Isso indica uma raiz real dupla: x = −(−4)/(2·1) = 2.',
        skill: 'Cálculo do discriminante',
      },
      {
        type: 'multiple',
        difficulty: 'Médio',
        question: 'As raízes da equação x² − 5x + 6 = 0 são:',
        options: ['x₁ = 2 e x₂ = 3', 'x₁ = −2 e x₂ = −3', 'x₁ = 1 e x₂ = 6', 'x₁ = 5 e x₂ = 1'],
        correct: 0,
        explanation: 'Δ = 25 − 24 = 1. x = (5 ± 1)/2. Logo x₁ = 3 e x₂ = 2. Verificação: 3+2=5=−b/a ✓ e 3×2=6=c/a ✓.',
        skill: 'Aplicação de Bhaskara',
      },
      {
        type: 'multiple',
        difficulty: 'ENEM',
        question: 'Um terreno retangular tem área de 60 m² e o comprimento supera a largura em 7 m. A largura do terreno, em metros, é:',
        options: ['5 m', '4 m', '12 m', '3 m'],
        correct: 0,
        explanation: 'Seja l a largura. Então comprimento = l + 7. Área: l(l+7) = 60 → l² + 7l − 60 = 0. Δ = 49 + 240 = 289. l = (−7 + 17)/2 = 5 m.',
        skill: 'Modelagem com equações quadráticas',
      },
    ],
    schedule: [
      { id: 's1', name: 'Introdução e forma padrão', duration: 15, type: 'theory' },
      { id: 's2', name: 'Identificação dos coeficientes', duration: 10, type: 'practice' },
      { id: 's3', name: 'Discriminante Δ', duration: 20, type: 'theory' },
      { id: 's4', name: 'Fórmula de Bhaskara', duration: 25, type: 'theory' },
      { id: 's5', name: 'Exemplos resolvidos', duration: 30, type: 'practice' },
      { id: 's6', name: 'Exercícios práticos', duration: 25, type: 'practice' },
      { id: 's7', name: 'Revisão com flashcards', duration: 15, type: 'review' },
      { id: 's8', name: 'Teste final', duration: 20, type: 'quiz' },
    ],
    summaries: {
      short: 'A equação do segundo grau tem forma ax²+bx+c=0 (a≠0). O discriminante Δ=b²−4ac define o número de raízes reais. A fórmula de Bhaskara x=(−b±√Δ)/2a calcula as raízes. Se Δ>0: duas raízes; Δ=0: uma raiz dupla; Δ<0: sem raízes reais.',
      full: `As equações do segundo grau são fundamentais em matemática e aparecem em inúmeras aplicações práticas.

**Forma Padrão:** ax² + bx + c = 0, onde a, b e c são coeficientes reais e a ≠ 0. O caso a = 0 reduziria a equação ao primeiro grau.

**Tipos de Equações:**
- Equação completa: a ≠ 0, b ≠ 0, c ≠ 0 (ex: 2x²−3x+1=0)
- Equação incompleta tipo I: c = 0 (ex: x²−4x=0, fatorar como x(x−4)=0)
- Equação incompleta tipo II: b = 0 (ex: x²−9=0, x=±3)

**O Discriminante:** Δ = b² − 4ac é calculado antes de Bhaskara para determinar a natureza das raízes sem calculá-las. Três casos possíveis: Δ > 0 (duas raízes reais distintas), Δ = 0 (uma raiz real dupla), Δ < 0 (raízes complexas conjugadas, sem solução real).

**Fórmula de Bhaskara:** x = (−b ± √Δ) / 2a, onde o ± gera duas equações: x₁ = (−b + √Δ)/2a e x₂ = (−b − √Δ)/2a.

**Relações de Girard:** Sem calcular as raízes, sabemos que x₁ + x₂ = −b/a e x₁ · x₂ = c/a. São excelentes para verificar resultados.`,
      keywords: ['equação quadrática','coeficientes a, b, c','discriminante Δ','fórmula de Bhaskara','raízes reais','raiz dupla','parábola','relações de Girard'],
      glossary: [
        { term: 'Equação do segundo grau', def: 'Equação polinomial de grau 2 na forma ax² + bx + c = 0, com a ≠ 0.' },
        { term: 'Discriminante (Δ)', def: 'Expressão Δ = b² − 4ac que determina a natureza das raízes da equação.' },
        { term: 'Raiz da equação', def: 'Valor de x que satisfaz a equação (torna-a verdadeira).' },
        { term: 'Raiz dupla', def: 'Quando Δ = 0, a equação tem apenas uma raiz real (x₁ = x₂).' },
        { term: 'Parábola', def: 'Gráfico da função y = ax² + bx + c; as raízes são os pontos onde a parábola intercepta o eixo x.' },
        { term: 'Relações de Girard', def: 'Propriedades x₁+x₂=−b/a e x₁·x₂=c/a que relacionam raízes e coeficientes.' },
      ],
      comparativeTable: {
        headers: ['Situação', 'Valor de Δ', 'Número de raízes reais', 'Exemplo'],
        rows: [
          ['Δ positivo', 'Δ > 0', '2 raízes distintas', 'x²−5x+6=0 → x=2 e x=3'],
          ['Δ nulo', 'Δ = 0', '1 raiz dupla', 'x²−4x+4=0 → x=2'],
          ['Δ negativo', 'Δ < 0', 'Sem raízes reais', 'x²+x+1=0 → sem solução real'],
        ],
      },
      mindMap: {
        root: 'Equação do 2º Grau',
        branches: [
          { node: 'Forma Padrão', leaves: ['ax² + bx + c = 0', 'a ≠ 0', 'Completa / Incompleta'] },
          { node: 'Discriminante', leaves: ['Δ = b² − 4ac', 'Δ>0: 2 raízes', 'Δ=0: raiz dupla', 'Δ<0: sem raízes'] },
          { node: 'Bhaskara', leaves: ['x = (−b ± √Δ)/2a', 'x₁ e x₂', 'Verificação'] },
          { node: 'Relações de Girard', leaves: ['x₁+x₂ = −b/a', 'x₁·x₂ = c/a'] },
          { node: 'Aplicações', leaves: ['Área de terrenos', 'Trajetória balística', 'Problemas de ENEM'] },
        ],
      },
      timeline: null,
    },
    videos: [
      { category: 'Introdução ao assunto', title: 'Equação do 2º Grau — Conceito e Forma Padrão', channel: 'Matemática Rio', reason: 'Explica o conceito e a forma padrão com exemplos visuais', query: 'equação segundo grau conceito forma padrão matemática' },
      { category: 'Explicação completa', title: 'Fórmula de Bhaskara — Passo a Passo', channel: 'Professor Ferretto', reason: 'Derivação e aplicação completa da fórmula de Bhaskara', query: 'fórmula bhaskara passo a passo resolução' },
      { category: 'Exemplos resolvidos', title: '10 Exercícios Resolvidos — Equação do 2º Grau', channel: 'Me Salva!', reason: 'Exemplos variados com diferentes valores de Δ', query: 'exercícios resolvidos equação segundo grau bhaskara' },
      { category: 'Revisão rápida', title: 'Resumo — Equação do 2º Grau em 5 Minutos', channel: 'Descomplica', reason: 'Revisão rápida de todos os conceitos essenciais', query: 'resumo rápido equação segundo grau ENEM' },
      { category: 'Conteúdo avançado', title: 'Relações de Girard e Aplicações', channel: 'Khan Academy', reason: 'Exploração das relações entre raízes e coeficientes', query: 'relações de girard equação segundo grau avançado' },
    ],
  },

  'revolução francesa': {
    category: 'História',
    overview: {
      description: 'A Revolução Francesa (1789–1799) foi um dos eventos mais transformadores da história moderna, derrubando a monarquia absolutista e estabelecendo ideais de liberdade, igualdade e fraternidade que moldaram o mundo contemporâneo.',
      goals: [
        'Compreender as causas econômicas, sociais e políticas da Revolução',
        'Identificar as fases da Revolução e seus principais eventos',
        'Analisar o papel das ideias iluministas na transformação política',
        'Conhecer as consequências para a França e para o mundo',
        'Relacionar a Revolução Francesa com outros processos históricos',
      ],
      prerequisites: ['Absolutismo monárquico', 'Iluminismo e filosofia do século XVIII', 'Estrutura social do Antigo Regime'],
      modules: ['Contexto histórico', 'Causas da Revolução', 'Fases e eventos', 'Personagens principais', 'Consequências', 'Legado e influências', 'Revisão com flashcards', 'Teste final'],
    },
    explanations: {
      beginner: 'A Revolução Francesa foi quando o povo da França se rebelou contra o rei e os nobres em 1789. Antes disso, a sociedade era dividida em três grupos chamados "Estados": o clero (padres), a nobreza e o povo comum. O povo pagava impostos altíssimos enquanto passava fome, enquanto os nobres não pagavam nada. Quando o povo não aguentou mais, eles tomaram a Bastilha (uma prisão símbolo do poder real) e começaram a transformar a França em um país com mais direitos para todos.',
      advanced: 'A Revolução Francesa representou a crise terminal do Ancien Régime e a emergência da modernidade política. As causas estruturais incluem: a bancarrota do Estado após as guerras (especialmente a participação na Independência Americana), a rigidez do sistema de ordens, a difusão das ideias iluministas de Voltaire, Rousseau e Montesquieu, e a crise agrária de 1788. A sequência de eventos — convocação dos Estados Gerais, formação da Assembleia Nacional, Declaração dos Direitos do Homem, período jacobino do Terror, golpe do 18 Brumário — demonstra a dialética entre reformismo e radicalismo que define a dinâmica revolucionária.',
      concepts: [
        { label: 'Antigo Regime', content: 'Sistema político-social pré-revolução com três estates: Clero (1º), Nobreza (2º) e Povo (3º). Os dois primeiros eram privilegiados e não pagavam impostos.', type: '' },
        { label: 'Causas principais', content: 'Crise financeira do Estado, desigualdade social extrema, más colheitas de 1788, inflação e influência do Iluminismo.', type: 'warning' },
        { label: 'Fases da Revolução', content: '1) Fase Moderada (1789-1792): Assembleia Constituinte\n2) Fase Radical/Terror (1792-1794): Jacobinos e Robespierre\n3) Fase Termidoriana (1794-1799): reação conservadora', type: 'accent' },
        { label: 'Legado', content: 'Ideais de Liberdade, Igualdade e Fraternidade; Declaração dos Direitos do Homem; fim do feudalismo; modelo para revoluções posteriores.', type: 'success' },
      ],
      analogy: 'Imagine uma escola onde alguns alunos (nobres) nunca precisam pagar a mensalidade nem fazer deveres, enquanto outros (o povo) pagam cada vez mais e ficam cada vez mais pobres. Quando chega a crise e não há comida, o grupo que paga tudo decide mudar as regras — isso foi a Revolução Francesa, só que em escala nacional.',
      mistakes: [
        'Confundir as fases da Revolução (moderada, radical e termidoriana)',
        'Achar que Napoleão fez parte da Revolução — ele veio depois, com o golpe de 1799',
        'Ignorar as causas econômicas e focar apenas nas ideias iluministas',
        'Confundir a Bastilha com uma batalha — foi a tomada de uma prisão-símbolo',
        'Esquecer que a Revolução teve fases contraditórias, incluindo o período do Terror',
      ],
      questions: [
        { q: 'Quais eram os três Estados (ordens) do Antigo Regime francês?', a: 'Primeiro Estado (Clero), Segundo Estado (Nobreza), Terceiro Estado (povo, burguesia, camponeses)' },
        { q: 'O que foi a Declaração dos Direitos do Homem e do Cidadão?', a: 'Documento de 1789 que proclamou os direitos naturais e inalienáveis dos homens: liberdade, propriedade, segurança e resistência à opressão.' },
        { q: 'Por que o período jacobino foi chamado de "A Época do Terror"?', a: 'Robespierre e os jacobinos executaram milhares de pessoas — incluindo nobres, clero e até revolucionários moderados — usando a guilhotina, em nome da segurança da República.' },
      ],
    },
    formulas: [],
    flashcards: [
      { id: 'rf_fc1', front: 'O que foi a tomada da Bastilha e quando ocorreu?', back: '14 de julho de 1789: o povo parisiense invadiu a prisão da Bastilha, símbolo do poder absolutista. Marco inicial da Revolução Francesa.' },
      { id: 'rf_fc2', front: 'Quais eram os três Estados do Antigo Regime?', back: '1º Estado: Clero\n2º Estado: Nobreza\n3º Estado: Todos os demais (burguesia, camponeses, trabalhadores urbanos)' },
      { id: 'rf_fc3', front: 'Quais eram os ideais da Revolução Francesa?', back: 'Liberté, Égalité, Fraternité\n(Liberdade, Igualdade, Fraternidade)' },
      { id: 'rf_fc4', front: 'Quem foram os jacobinos e o que foi o Terror?', back: 'Jacobinos: facção radical liderada por Robespierre. O Terror (1793-94): fase de execuções em massa de "inimigos da República", incluindo a própria rainha Maria Antonieta.' },
      { id: 'rf_fc5', front: 'O que foi o golpe do 18 Brumário?', back: 'Em novembro de 1799, Napoleão Bonaparte derrubou o Diretório num golpe de Estado, encerrando a Revolução e iniciando o Consulado.' },
    ],
    exercises: [
      {
        type: 'multiple',
        difficulty: 'Fácil',
        question: 'A Revolução Francesa começou oficialmente com qual evento em 1789?',
        options: ['A decapitação do rei Luís XVI', 'A tomada da Bastilha em 14 de julho', 'A criação da Assembleia Nacional', 'A proclamação da República'],
        correct: 1,
        explanation: 'A tomada da Bastilha em 14 de julho de 1789 é considerada o marco inicial da Revolução Francesa. A data é feriado nacional na França até hoje.',
        skill: 'Cronologia da Revolução Francesa',
      },
      {
        type: 'multiple',
        difficulty: 'Médio',
        question: 'A "Época do Terror" durante a Revolução Francesa foi liderada por:',
        options: ['Luís XVI', 'Napoleão Bonaparte', 'Maximilien Robespierre', 'Marquês de Lafayette'],
        correct: 2,
        explanation: 'Robespierre liderou o Comitê de Salvação Pública durante a fase radical (1793-1794), período marcado por execuções em massa. Ironicamente, ele próprio foi guilhotinado em julho de 1794.',
        skill: 'Personagens da Revolução Francesa',
      },
      {
        type: 'multiple',
        difficulty: 'Médio',
        question: 'O Terceiro Estado na França do Antigo Regime era composto por:',
        options: ['Apenas camponeses pobres', 'Apenas a burguesia comercial', 'Clero baixo e médio', 'Burguesia, artesãos, camponeses e trabalhadores urbanos'],
        correct: 3,
        explanation: 'O Terceiro Estado compreendia cerca de 97% da população: burguesia (profissionais, comerciantes), trabalhadores urbanos (sans-culottes), artesãos e camponeses.',
        skill: 'Estrutura social do Antigo Regime',
      },
      {
        type: 'multiple',
        difficulty: 'ENEM',
        question: 'A Declaração dos Direitos do Homem e do Cidadão (1789) afirma que "a finalidade de qualquer associação política é a conservação dos direitos naturais e imprescritíveis do homem". Esse princípio reflete diretamente as ideias de:',
        options: ['Maquiavel, sobre a razão de Estado', 'Rousseau e Locke, sobre direitos naturais e contrato social', 'Hobbes, sobre o poder absoluto do soberano', 'Montesquieu, sobre a separação entre Igreja e Estado'],
        correct: 1,
        explanation: 'A Declaração foi diretamente influenciada pelo Iluminismo, especialmente Rousseau (contrato social, soberania popular) e Locke (direitos naturais de vida, liberdade e propriedade). O conceito de direitos "imprescritíveis" vem da tradição jusnaturalista.',
        skill: 'Iluminismo e Revolução Francesa',
      },
    ],
    schedule: [
      { id: 's1', name: 'O Antigo Regime e suas contradições', duration: 20, type: 'theory' },
      { id: 's2', name: 'Causas da Revolução', duration: 20, type: 'theory' },
      { id: 's3', name: 'A fase moderada (1789-1792)', duration: 25, type: 'theory' },
      { id: 's4', name: 'O Terror jacobino (1792-1794)', duration: 20, type: 'theory' },
      { id: 's5', name: 'Termidor e o Diretório', duration: 15, type: 'theory' },
      { id: 's6', name: 'Exercícios práticos', duration: 25, type: 'practice' },
      { id: 's7', name: 'Revisão com flashcards', duration: 15, type: 'review' },
      { id: 's8', name: 'Teste final', duration: 20, type: 'quiz' },
    ],
    summaries: {
      short: 'A Revolução Francesa (1789-1799) derrubou o absolutismo do Antigo Regime. Causas: crise financeira, desigualdade social e ideias iluministas. Fases: moderada (Assembleia), radical (Terror de Robespierre) e termidoriana. Resultado: Declaração dos Direitos do Homem, fim do feudalismo e ascensão de Napoleão.',
      full: `A Revolução Francesa (1789-1799) transformou radicalmente a sociedade europeia e estabeleceu as bases da política moderna.

**Contexto:** A França pré-revolucionária vivia sob o Antigo Regime, com sociedade dividida em três ordens (Estados). O Primeiro (Clero) e Segundo (Nobreza) Estados gozavam de privilégios e isenções fiscais, enquanto o Terceiro Estado — 97% da população — carregava o peso dos impostos.

**Causas:** Bancarrota do Estado (guerras coloniais), crise agrária de 1788 (geada devastadora → escassez de alimentos), ascensão da burguesia iluminista, influência da Revolução Americana e das ideias de Rousseau, Voltaire e Montesquieu.

**Fases:**
1. **Fase Moderada (1789-1792):** Formação da Assembleia Nacional, Declaração dos Direitos do Homem, Constituição de 1791
2. **Fase Radical — Terror (1792-1794):** República proclamada, Luís XVI guilhotinado, Comitê de Salvação Pública, Robespierre e execuções em massa
3. **Fase Termidoriana (1794-1799):** Queda de Robespierre, Diretório, reação conservadora

**Fim:** Golpe do 18 Brumário (novembro 1799) — Napoleão Bonaparte assume o poder como Cônsul.

**Legado:** Ideais de Liberdade, Igualdade e Fraternidade; modelo para revoluções do século XIX; fim do feudalismo na Europa; inspiração para independências latino-americanas.`,
      keywords: ['Antigo Regime','États Généraux','Bastilha','Declaração dos Direitos','Jacobinos','Terror','Robespierre','Napoleão','Iluminismo','Liberdade Igualdade Fraternidade'],
      glossary: [
        { term: 'Antigo Regime', def: 'Sistema político-social pré-revolucionário baseado em privilégios hereditários da nobreza e do clero.' },
        { term: 'États Généraux', def: 'Assembleia representativa dos três Estados convocada por Luís XVI em maio de 1789.' },
        { term: 'Guilhotina', def: 'Máquina de decapitação usada extensivamente durante o Terror; símbolo da Revolução.' },
        { term: 'Jacobinos', def: 'Clube político radical liderado por Robespierre; defendia a república e medidas extremas contra "inimigos da Revolução".' },
        { term: 'Sans-culottes', def: 'Trabalhadores urbanos parisienses, principal força popular da Revolução (nome vem de não usarem as calças aristocráticas "culottes").' },
        { term: 'Termidor', def: 'Mês do calendário revolucionário; o "9 Termidor" (julho 1794) marcou a queda de Robespierre e o fim do Terror.' },
      ],
      comparativeTable: {
        headers: ['Grupo', 'Posição na Revolução', 'Objetivos', 'Destino'],
        rows: [
          ['Nobreza/Clero', 'Contra', 'Manter privilégios do Antigo Regime', 'Perderam terras e títulos; muitos emigraram ou foram guilhotinados'],
          ['Burguesia moderada', 'A favor (inicialmente)', 'Monarquia constitucional, direitos civis', 'Governou nas fases moderada e termidoriana'],
          ['Jacobinos', 'A favor (radical)', 'República igualitária, fim dos privilégios', 'Lideraram o Terror; Robespierre guilhotinado em 1794'],
          ['Sans-culottes', 'A favor (popular)', 'Pão, igualdade, participação direta', 'Foram marginalizados após a fase termidoriana'],
        ],
      },
      mindMap: {
        root: 'Revolução Francesa',
        branches: [
          { node: 'Causas', leaves: ['Crise financeira', 'Fome de 1788', 'Iluminismo', 'Desigualdade'] },
          { node: 'Fases', leaves: ['Moderada (1789)', 'Terror (1793)', 'Termidor (1794)', 'Diretório'] },
          { node: 'Personagens', leaves: ['Luís XVI', 'Robespierre', 'Napoleão', 'Maria Antonieta'] },
          { node: 'Consequências', leaves: ['Fim do feudalismo', 'Direitos Humanos', 'Republica', 'Napoleão'] },
        ],
      },
      timeline: [
        { year: '1789', event: 'Queda da Bastilha', detail: '14 de julho — marco inicial; Declaração dos Direitos do Homem em agosto' },
        { year: '1791', event: 'Constituição Francesa', detail: 'Monarquia constitucional estabelecida; poderes do rei limitados' },
        { year: '1792', event: 'Proclamação da República', detail: 'Primeira República Francesa; início das guerras revolucionárias' },
        { year: '1793-1794', event: 'O Terror', detail: 'Robespierre e o Comitê de Salvação Pública; 17.000+ execuções oficiais' },
        { year: '1799', event: 'Golpe do 18 Brumário', detail: 'Napoleão Bonaparte toma o poder; fim da Revolução' },
      ],
    },
    videos: [
      { category: 'Introdução ao assunto', title: 'Revolução Francesa — O que foi e por que importa', channel: 'Nerdologia', reason: 'Visão geral acessível e bem contextualizada', query: 'revolução francesa resumo história causas' },
      { category: 'Explicação completa', title: 'Revolução Francesa Completa — Do Antigo Regime ao Napoleão', channel: 'Brasil Escola', reason: 'Cobertura detalhada de todas as fases', query: 'revolução francesa completa fases antigo regime terror' },
      { category: 'Exemplos resolvidos', title: 'Questões de ENEM sobre Revolução Francesa', channel: 'Descomplica', reason: 'Exercícios no estilo ENEM com resolução comentada', query: 'revolução francesa ENEM questões resolvidas' },
      { category: 'Revisão rápida', title: 'Resumo: Revolução Francesa em 10 Minutos', channel: 'Curso Enem Gratuito', reason: 'Síntese dos pontos mais cobrados em vestibulares', query: 'resumo revolução francesa vestibular 10 minutos' },
      { category: 'Conteúdo avançado', title: 'Iluminismo e a Revolução Francesa', channel: 'Filosofia do Cotidiano', reason: 'Aprofundamento nas ideias filosóficas que embasaram a Revolução', query: 'iluminismo revolução francesa rousseau voltaire filosofia' },
    ],
  },
};

// --- Generic plan generator ---
function generateGenericPlan(topic, category, level, goal, duration) {
  const isFormula = hasFormulas(category);
  const catEmoji = { 'Matemática':'📐','Física':'⚡','Química':'🧪','Biologia':'🌿','História':'📜','Geografia':'🌍','Tecnologia':'💻','Idiomas':'🗣️','Finanças':'💰','Geral':'📚' };
  const emoji = catEmoji[category] || '📚';

  const concepts = getGenericConcepts(topic, category);
  const goals = [
    `Compreender os fundamentos de ${topic}`,
    `Identificar os conceitos-chave da área`,
    `Aplicar o conhecimento em situações práticas`,
    `Desenvolver raciocínio crítico sobre ${topic}`,
    `Ser capaz de explicar ${topic} com suas próprias palavras`,
  ];

  return {
    category,
    overview: {
      description: `Estudo completo sobre ${topic}. Este plano foi gerado automaticamente e pode ser personalizado com uma chave de API do Gemini nas configurações.`,
      goals,
      prerequisites: [`Conhecimentos básicos de ${category}`, 'Disposição para aprender', 'Caderno de anotações'],
      modules: ['Introdução e conceitos', 'Desenvolvimento', 'Exemplos práticos', 'Revisão', 'Exercícios', 'Teste final'],
    },
    explanations: {
      beginner: `${topic} é um tema fascinante de ${category}. Para começar, é importante entender os conceitos básicos e como eles se relacionam com o que você já conhece. Vamos explorar esse assunto de forma progressiva, começando pelo mais simples e avançando gradualmente.`,
      advanced: `Do ponto de vista mais avançado, ${topic} apresenta nuances e interconexões importantes com outros campos de ${category}. A compreensão profunda requer análise crítica, estudo de casos e capacidade de síntese entre diferentes perspectivas e abordagens teóricas.`,
      concepts,
      analogy: `Pense em ${topic} como aprender a dirigir: primeiro você aprende as regras básicas, depois pratica em ambiente seguro, e por fim navega no trânsito real com autonomia. Cada etapa depende da anterior.`,
      mistakes: [
        'Tentar memorizar sem entender o conceito',
        'Pular etapas do aprendizado',
        'Não praticar com exercícios',
        'Estudar sem revisar o conteúdo',
        'Ignorar os erros cometidos nos exercícios',
      ],
      questions: [
        { q: `O que você já sabia sobre ${topic} antes de começar este estudo?`, a: 'Reflita sobre seus conhecimentos prévios.' },
        { q: `Qual é a aplicação prática mais importante de ${topic}?`, a: 'Pense em exemplos do cotidiano ou da área de interesse.' },
        { q: `Como ${topic} se relaciona com outros assuntos de ${category}?`, a: 'Faça conexões com o que já aprendeu.' },
      ],
    },
    formulas: isFormula ? generateGenericFormulas(topic, category) : [],
    flashcards: generateGenericFlashcards(topic, category, concepts),
    exercises: generateGenericExercises(topic, category),
    schedule: generateSchedule(duration),
    summaries: {
      short: `${topic} é um tema de ${category} que abrange conceitos fundamentais e aplicações práticas. O estudo organizado permite compreender ${topic} de forma progressiva, da teoria à prática.`,
      full: `# ${topic}\n\n**Categoria:** ${category}\n\nEste é um guia de estudos sobre ${topic}. Para uma explicação mais aprofundada e personalizada, configure sua chave de API do Gemini nas Configurações.\n\n**Conceitos principais:**\n${concepts.map(c => `- **${c.label}:** ${c.content}`).join('\n')}\n\n**Dicas de estudo:**\n- Use flashcards para memorizar termos-chave\n- Faça resumos com suas próprias palavras\n- Pratique com os exercícios disponíveis\n- Revise o conteúdo em intervalos regulares`,
      keywords: [topic, category, 'conceitos básicos', 'aplicações', 'teoria', 'prática'],
      glossary: concepts.slice(0, 4).map(c => ({ term: c.label, def: c.content })),
      comparativeTable: null,
      mindMap: {
        root: topic,
        branches: [
          { node: 'Conceitos', leaves: concepts.slice(0, 3).map(c => c.label) },
          { node: 'Aplicações', leaves: ['Prática cotidiana', 'Exercícios', 'Projetos'] },
          { node: 'Recursos', leaves: ['Videoaulas', 'Livros', 'Exercícios'] },
        ],
      },
      timeline: null,
    },
    videos: generateGenericVideos(topic, category),
  };
}

function getGenericConcepts(topic, category) {
  return [
    { label: 'Definição', content: `${topic} pode ser definido como o conjunto de conhecimentos e práticas relacionados à área de ${category}.`, type: '' },
    { label: 'Importância', content: `Compreender ${topic} é fundamental para avançar no estudo de ${category} e em diversas aplicações práticas.`, type: 'success' },
    { label: 'Atenção', content: `Os pontos mais desafiadores de ${topic} geralmente envolvem a aplicação prática dos conceitos teóricos.`, type: 'warning' },
    { label: 'Dica de estudo', content: `Use a técnica de Feynman: tente explicar ${topic} com palavras simples, como se ensinasse a alguém.`, type: 'accent' },
  ];
}

function generateGenericFormulas(topic, category) {
  if (category === 'Física') {
    return [{
      name: 'Relação fundamental',
      desc: `Fórmula básica relacionada a ${topic}`,
      latex: 'F = m \\cdot a',
      variables: [{ symbol: 'F', meaning: 'Força (N)' }, { symbol: 'm', meaning: 'Massa (kg)' }, { symbol: 'a', meaning: 'Aceleração (m/s²)' }],
      when: 'Ao relacionar força, massa e aceleração em sistemas físicos',
      validity: 'Válida para corpos em regime clássico (não-relativístico)',
      example: { problem: 'Calcule a força para acelerar 5 kg a 3 m/s²', steps: ['F = m × a', 'F = 5 × 3', 'F = 15 N'] },
      practice: { q: 'Qual a força necessária para acelerar 10 kg a 2 m/s²?', a: 'F = 10 × 2 = 20 N' },
      tip: 'Lembre: F-ma, como "Fuma" ao contrário!',
      commonErrors: 'Confundir unidades (usar gramas em vez de kg)',
    }];
  }
  return [];
}

function generateGenericFlashcards(topic, category, concepts) {
  return [
    { id: `gen_fc1_${Date.now()}`, front: `O que é ${topic}?`, back: `${topic} é um tema de ${category} que abrange conceitos e práticas importantes para o desenvolvimento nessa área.` },
    { id: `gen_fc2_${Date.now()}`, front: `Qual a importância de estudar ${topic}?`, back: `Compreender ${topic} permite aplicar conhecimentos de ${category} em situações reais e avançar nos estudos da área.` },
    { id: `gen_fc3_${Date.now()}`, front: `Quais são os erros mais comuns ao estudar ${topic}?`, back: 'Memorizar sem entender, pular etapas, não praticar com exercícios e não revisar o conteúdo.' },
    { id: `gen_fc4_${Date.now()}`, front: `Como a técnica de Feynman pode ajudar no estudo de ${topic}?`, back: 'Tente explicar o conceito como se fosse ensinar a uma criança. Onde travar = o que ainda precisa estudar.' },
    { id: `gen_fc5_${Date.now()}`, front: `Qual é a relação de ${topic} com ${category}?`, back: `${topic} é um tema específico dentro de ${category}, que se conecta com outros conceitos da área.` },
  ];
}

function generateGenericExercises(topic, category) {
  return [
    {
      type: 'multiple',
      difficulty: 'Fácil',
      question: `Qual das alternativas melhor descreve a importância de ${topic}?`,
      options: [
        `${topic} é irrelevante para ${category}`,
        `${topic} é fundamental para compreender ${category} e tem aplicações práticas importantes`,
        `${topic} só tem importância teórica, sem aplicações práticas`,
        `${topic} é um tema exclusivo de pesquisadores avançados`,
      ],
      correct: 1,
      explanation: `O estudo de ${topic} é essencial para avançar em ${category}. Compreender seus fundamentos abre portas para aplicações práticas e aprofundamento do conhecimento.`,
      skill: 'Compreensão geral do tema',
    },
    {
      type: 'multiple',
      difficulty: 'Médio',
      question: 'Qual técnica de estudo é mais eficaz para memorizar conteúdos novos com retenção de longo prazo?',
      options: [
        'Ler o conteúdo uma única vez, rapidamente',
        'Copiar o texto sem reflexão',
        'Repetição espaçada com revisões em intervalos crescentes',
        'Estudar apenas na véspera da prova',
      ],
      correct: 2,
      explanation: 'A repetição espaçada (spaced repetition) é cientificamente comprovada como a técnica mais eficaz para memorização de longo prazo. Revisar em intervalos crescentes consolida a memória.',
      skill: 'Técnicas de estudo',
    },
    {
      type: 'multiple',
      difficulty: 'Médio',
      question: 'A técnica de Feynman consiste em:',
      options: [
        'Memorizar fórmulas repetidamente',
        'Fazer resumos copiando o livro',
        'Explicar o conceito com palavras simples, identificar lacunas e aprofundar',
        'Assistir videoaulas sem fazer anotações',
      ],
      correct: 2,
      explanation: 'A técnica de Feynman tem 4 passos: 1) Escolha o conceito; 2) Explique como para uma criança; 3) Identifique onde trava; 4) Revise e simplifique ainda mais.',
      skill: 'Técnicas de aprendizado',
    },
  ];
}

function generateSchedule(duration) {
  const totalMin = parseInt(duration) || 25;
  const steps = [
    { id: 's1', name: 'Introdução ao tema', duration: Math.round(totalMin * 0.2), type: 'theory' },
    { id: 's2', name: 'Conceitos principais', duration: Math.round(totalMin * 0.3), type: 'theory' },
    { id: 's3', name: 'Exemplos práticos', duration: Math.round(totalMin * 0.2), type: 'practice' },
    { id: 's4', name: 'Exercícios', duration: Math.round(totalMin * 0.15), type: 'practice' },
    { id: 's5', name: 'Revisão com flashcards', duration: Math.round(totalMin * 0.1), type: 'review' },
    { id: 's6', name: 'Teste de compreensão', duration: Math.round(totalMin * 0.05), type: 'quiz' },
  ];
  return steps;
}

function generateGenericVideos(topic, category) {
  const catChannel = { 'Matemática':'Matemática Rio', 'Física':'Professor Boaro', 'Química':'Química com Potássio', 'Biologia':'Biologia Net', 'História':'Parabólica', 'Tecnologia':'Curso em Vídeo', 'Idiomas':'English in Brazil', 'Finanças':'Me Poupe!', 'Geral':'Descomplica' };
  const channel = catChannel[category] || 'Descomplica';
  return [
    { category: 'Introdução ao assunto', title: `Introdução a ${topic}`, channel, reason: 'Conceitos básicos e visão geral do tema', query: `${topic} introdução o que é ${category}` },
    { category: 'Explicação completa', title: `${topic} — Explicação Completa`, channel, reason: 'Explicação aprofundada de todos os aspectos', query: `${topic} explicação completa ${category}` },
    { category: 'Exemplos resolvidos', title: `Exercícios resolvidos de ${topic}`, channel, reason: 'Prática com exemplos comentados', query: `${topic} exercícios resolvidos exemplos ${category}` },
    { category: 'Revisão rápida', title: `Resumo rápido: ${topic}`, channel: 'Descomplica', reason: 'Síntese dos pontos principais para revisão', query: `${topic} resumo revisão vestibular ENEM` },
    { category: 'Conteúdo avançado', title: `${topic} — Aprofundamento`, channel, reason: 'Tópicos avançados e aplicações especiais', query: `${topic} avançado aprofundamento ${category}` },
  ];
}

// --- Main plan generator ---
function generatePlan(topic, level, goal, duration) {
  const topicKey = topic.toLowerCase().trim();
  const curated = CURATED_TOPICS[topicKey];
  const category = curated ? curated.category : detectCategory(topic);

  let planData;
  if (curated) {
    planData = curated;
  } else {
    planData = generateGenericPlan(topic, category, level, goal, duration);
  }

  const id = genId();
  return {
    id,
    topic,
    slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category,
    level: level || 'iniciante',
    goal: goal || 'aprender',
    duration: duration || '25',
    createdAt: Date.now(),
    ...planData,
  };
}

window.KnowledgeEngine = { generatePlan, detectCategory, hasFormulas, CURATED_TOPICS };
