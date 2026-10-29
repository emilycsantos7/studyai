'use strict';
/* =========================================
   StudyAI — Main Application (SPA Router)
   ========================================= */

// --- State ---
let currentPlan = null;
let activeTab = 'visao-geral';
let chatOpen = false;
let chatHistory = [];
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;
let fcIndex = 0;
let fcFlipped = false;
let exerciseAnswered = [];

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(Storage.getTheme());
  updateStreakBadge();
  Storage.updateStats({});
  window.addEventListener('hashchange', route);
  route();
});

// --- Router ---
function route() {
  const hash = location.hash || '#/';
  const path = hash.replace('#', '') || '/';
  closeMobileMenu();

  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-page') === getPageName(path));
  });

  if (path === '/' || path === '') renderHome();
  else if (path === '/dashboard') renderDashboard();
  else if (path === '/biblioteca') renderBiblioteca();
  else if (path === '/configuracoes') renderConfiguracoes();
  else if (path.startsWith('/estudo/')) {
    const slug = path.replace('/estudo/', '');
    renderEstudo(slug);
  } else renderHome();
}

function getPageName(path) {
  if (path === '/' || path === '') return 'home';
  if (path.startsWith('/dashboard')) return 'dashboard';
  if (path.startsWith('/biblioteca')) return 'biblioteca';
  if (path.startsWith('/configuracoes')) return 'configuracoes';
  return 'home';
}

function navigate(path) {
  location.hash = '#' + path;
}

window.navigate = navigate;

// --- Theme ---
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  Storage.setTheme(theme);
}

function toggleTheme() {
  const curr = Storage.getTheme();
  applyTheme(curr === 'light' ? 'dark' : 'light');
}
window.toggleTheme = toggleTheme;

// --- Mobile menu ---
function toggleMobileMenu() {
  document.getElementById('headerNav').classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('headerNav').classList.remove('open');
}
window.toggleMobileMenu = toggleMobileMenu;

// --- Toast ---
function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}
window.showToast = showToast;

// --- Modal ---
function openModal(title, bodyHTML) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHTML;
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('globalModal').classList.add('open');
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('globalModal').classList.remove('open');
}
window.openModal = openModal;
window.closeModal = closeModal;

// --- Streak badge ---
function updateStreakBadge() {
  const s = Storage.getStats();
  document.getElementById('streakCount').textContent = s.streak || 0;
}

// --- KaTeX rendering ---
function renderMath(el) {
  if (!el) return;
  if (window.renderMathInElement) {
    try {
      renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true },
        ],
        throwOnError: false,
      });
    } catch {}
  }
}

function renderLatex(container, latex) {
  if (!container) return;
  if (window.katex) {
    try {
      katex.render(latex, container, { throwOnError: false, displayMode: true });
    } catch { container.textContent = latex; }
  } else {
    container.textContent = latex;
    // Retry after KaTeX loads
    setTimeout(() => {
      if (window.katex) try { katex.render(latex, container, { throwOnError: false, displayMode: true }); } catch {}
    }, 1500);
  }
}

// --- startStudy (from pills/footer) ---
function startStudy(topic) {
  const inp = document.getElementById('searchInput');
  if (inp) inp.value = topic;
  doSearch(topic);
}
window.startStudy = startStudy;

// ============================================================
//   HOME PAGE
// ============================================================
function renderHome() {
  const root = document.getElementById('appRoot');
  root.innerHTML = `
<div class="page">
  <section class="home-hero container fade-in">
    <div class="hero-eyebrow">✨ Seu professor particular com IA</div>
    <h1 class="hero-title">Aprenda qualquer coisa,<br>do seu jeito.</h1>
    <p class="hero-sub">Digite qualquer assunto e receba um plano de estudos completo e personalizado com explicações, vídeos, fórmulas, flashcards e exercícios.</p>

    <div class="search-box">
      <div class="search-row">
        <input type="text" id="searchInput" class="search-input" placeholder="Digite qualquer assunto, matéria, fórmula ou conceito..." onkeydown="if(event.key==='Enter') doSearch()">
        <button class="btn btn-primary btn-lg" onclick="doSearch()">🧠 Criar meu plano</button>
      </div>
      <div class="search-options">
        <select id="selLevel">
          <option value="">📊 Nível</option>
          <option value="iniciante">Iniciante</option>
          <option value="intermediario">Intermediário</option>
          <option value="avancado">Avançado</option>
          <option value="enem">ENEM/Vestibular</option>
        </select>
        <select id="selGoal">
          <option value="">🎯 Objetivo</option>
          <option value="aprender">Aprender do zero</option>
          <option value="revisao">Revisão</option>
          <option value="prova">Preparação para prova</option>
          <option value="aprofundar">Aprofundar</option>
        </select>
        <select id="selDuration">
          <option value="">⏱️ Tempo</option>
          <option value="15">15 minutos</option>
          <option value="25">25 minutos</option>
          <option value="45">45 minutos</option>
          <option value="60">60 minutos</option>
        </select>
      </div>
    </div>

    <div class="topics-section">
      <p class="topics-label">✨ Tópicos populares</p>
      <div class="topics-pills">
        ${[
          ['📐','Equações do segundo grau'],
          ['🌍','Revolução Francesa'],
          ['🌿','Fotossíntese'],
          ['⚡','Leis de Newton'],
          ['🗣️','Inglês para iniciantes'],
          ['💻','Programação em Python'],
          ['🧬','Anatomia humana'],
          ['📊','Matemática para o ENEM'],
          ['💰','Contabilidade básica'],
          ['🤖','Inteligência Artificial'],
        ].map(([icon, t]) => `<button class="topic-pill" onclick="startStudy('${t}')">${icon} ${t}</button>`).join('')}
      </div>
    </div>
  </section>

  <section class="features-section container">
    <h2 class="section-heading">Tudo que você precisa para aprender de verdade</h2>
    <p class="section-sub">Uma plataforma completa com tecnologia de IA para potencializar seus estudos</p>
    <div class="grid-4">
      ${[
        ['🧠','Tutor IA','Explicações adaptadas ao seu nível, com analogias, exemplos práticos e respostas às suas dúvidas.'],
        ['🎬','Videoaulas','Vídeos recomendados e organizados por categoria para complementar seus estudos.'],
        ['📐','Fórmulas','Equações renderizadas com KaTeX, explicadas passo a passo com exemplos resolvidos.'],
        ['🃏','Flashcards','Memorização inteligente com repetição espaçada (SM-2) e técnica de Feynman.'],
        ['📝','Exercícios','Questões de múltipla escolha, discursivas e no estilo ENEM com correção instantânea.'],
        ['📋','Plano de Estudos','Cronograma personalizado com timer Pomodoro e lista de tarefas com progresso.'],
        ['📊','Dashboard','Acompanhe seu progresso, streak e histórico de estudos.'],
        ['📚','Biblioteca','Salve resumos, fórmulas, flashcards e vídeos favoritos.'],
      ].map(([icon, title, desc]) => `
        <div class="feature-card">
          <span class="feature-icon">${icon}</span>
          <div class="feature-title">${title}</div>
          <div class="feature-desc">${desc}</div>
        </div>`).join('')}
    </div>
  </section>

  <section class="container">
    <div class="stats-row">
      <div class="stat-item"><div class="stat-num">8</div><div class="stat-label">Módulos de estudo</div></div>
      <div class="stat-item"><div class="stat-num">100+</div><div class="stat-label">Tópicos suportados</div></div>
      <div class="stat-item"><div class="stat-num">SM-2</div><div class="stat-label">Algoritmo de revisão</div></div>
      <div class="stat-item"><div class="stat-num">∞</div><div class="stat-label">Possibilidades de aprendizado</div></div>
    </div>
  </section>
</div>`;
}

function doSearch(topicArg) {
  const topic = topicArg || document.getElementById('searchInput')?.value?.trim();
  if (!topic) { showToast('Digite um assunto para pesquisar!'); return; }
  const level = document.getElementById('selLevel')?.value || '';
  const goal = document.getElementById('selGoal')?.value || '';
  const duration = document.getElementById('selDuration')?.value || '25';

  const root = document.getElementById('appRoot');
  root.innerHTML = `<div class="loading-page"><div class="spinner"></div><p class="text-muted">Criando seu plano de estudos...</p></div>`;

  setTimeout(() => {
    const plan = KnowledgeEngine.generatePlan(topic, level, goal, duration);
    Storage.savePlan(plan);
    Storage.setCurrentPlan(plan);
    Storage.addHistory(topic);
    Storage.updateStats({ topic: true });
    currentPlan = plan;
    navigate(`/estudo/${plan.slug}`);
  }, 600);
}
window.doSearch = doSearch;

// ============================================================
//   STUDY PAGE
// ============================================================
function renderEstudo(slug) {
  const plans = Storage.getPlans();
  let plan = plans.find(p => p.slug === slug) || Storage.getCurrentPlan();
  if (!plan) { navigate('/'); return; }
  currentPlan = plan;

  activeTab = 'visao-geral';
  fcIndex = 0;
  fcFlipped = false;
  exerciseAnswered = [];

  const root = document.getElementById('appRoot');
  const catColors = { 'Matemática':'badge-primary','Física':'badge-accent','Química':'badge-warning','Biologia':'badge-success','História':'badge-danger','Tecnologia':'badge-info','Geral':'badge-primary' };
  const catColor = catColors[plan.category] || 'badge-primary';

  root.innerHTML = `
<div class="page" style="padding-top: var(--header-h);">
  <div class="study-header">
    <div class="container">
      <div class="study-meta">
        <span class="badge ${catColor}">${plan.category}</span>
        <span class="badge badge-primary">${plan.level || 'iniciante'}</span>
        <span class="badge badge-success">${plan.duration || 25} min/sessão</span>
      </div>
      <h1 class="study-title">${plan.topic}</h1>
      <div class="study-actions">
        <button class="btn btn-secondary btn-sm" onclick="saveFavorite()">⭐ Salvar</button>
        <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Imprimir</button>
        <button class="btn btn-secondary btn-sm" onclick="navigate('/')">← Novo assunto</button>
      </div>
      <div class="tabs study-tabs" id="studyTabs">
        ${[
          ['visao-geral','🏠 Visão Geral'],
          ['tutor-ia','🧠 Tutor IA'],
          ['videoaulas','🎬 Videoaulas'],
          ['formulas','📐 Fórmulas'],
          ['resumos','📝 Resumos'],
          ['flashcards','🃏 Flashcards'],
          ['exercicios','✏️ Exercícios'],
          ['plano','📋 Plano'],
        ].map(([id, label]) => `<button class="tab-btn${id === activeTab ? ' active' : ''}" onclick="switchTab('${id}')">${label}</button>`).join('')}
      </div>
    </div>
  </div>

  <div class="container study-content">
    <div id="tab-visao-geral" class="tab-panel active">${buildOverviewTab(plan)}</div>
    <div id="tab-tutor-ia" class="tab-panel">${buildTutorTab(plan)}</div>
    <div id="tab-videoaulas" class="tab-panel">${buildVideosTab(plan)}</div>
    <div id="tab-formulas" class="tab-panel">${buildFormulasTab(plan)}</div>
    <div id="tab-resumos" class="tab-panel">${buildSummariesTab(plan)}</div>
    <div id="tab-flashcards" class="tab-panel">${buildFlashcardsTab(plan)}</div>
    <div id="tab-exercicios" class="tab-panel">${buildExercisesTab(plan)}</div>
    <div id="tab-plano" class="tab-panel">${buildPlanTab(plan)}</div>
  </div>
</div>

<!-- Chat toggle -->
<button class="chat-toggle-btn" onclick="toggleChat()" title="Tutor IA">💬</button>

<!-- Chat drawer -->
<div class="chat-drawer" id="chatDrawer">
  <div class="chat-header">
    <span>🧠 Tutor IA — ${plan.topic}</span>
    <button class="btn-icon" onclick="toggleChat()">✕</button>
  </div>
  <div class="chat-messages" id="chatMessages">
    <div class="chat-msg ai">Olá! Sou seu tutor de <strong>${plan.topic}</strong>. Pode me fazer qualquer pergunta sobre esse assunto! 😊</div>
  </div>
  <div class="chat-input-row">
    <textarea class="chat-input" id="chatInput" placeholder="Digite sua dúvida..." rows="1" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChat();}"></textarea>
    <button class="btn btn-primary btn-sm" onclick="sendChat()">Enviar</button>
  </div>
</div>`;

  // Post-render: KaTeX
  setTimeout(() => {
    renderMath(document.getElementById('tab-formulas'));
    renderMath(document.getElementById('tab-tutor-ia'));
  }, 300);
}

function switchTab(id) {
  activeTab = id;
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    const tabs = ['visao-geral','tutor-ia','videoaulas','formulas','resumos','flashcards','exercicios','plano'];
    b.classList.toggle('active', tabs[i] === id);
  });
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`tab-${id}`);
  if (panel) {
    panel.classList.add('active');
    panel.classList.add('fade-in');
    if (id === 'formulas') setTimeout(() => renderMath(panel), 100);
  }
  Storage.updateStats({ minutes: 1 });
}
window.switchTab = switchTab;

function saveFavorite() {
  if (!currentPlan) return;
  const item = { id: currentPlan.id, type: 'plano', title: currentPlan.topic, category: currentPlan.category, icon: '📚', createdAt: Date.now() };
  if (Storage.isFavorite(currentPlan.id)) {
    Storage.removeFavorite(currentPlan.id);
    showToast('Removido dos favoritos');
  } else {
    Storage.addFavorite(item);
    showToast('Salvo na Biblioteca! ⭐');
  }
}
window.saveFavorite = saveFavorite;

// --- Overview Tab ---
function buildOverviewTab(plan) {
  const ov = plan.overview || {};
  return `
<div class="grid-2" style="gap:24px;align-items:start">
  <div>
    <div class="card mb-16">
      <div class="card-title mb-12">📌 Sobre este tema</div>
      <p style="font-size:0.93rem;line-height:1.7;color:var(--text-muted)">${ov.description || ''}</p>
    </div>
    <div class="card mb-16">
      <div class="card-title mb-12">🎯 O que você vai aprender</div>
      <ul class="overview-goals">
        ${(ov.goals || []).map(g => `<li><span class="goal-icon">✅</span>${g}</li>`).join('')}
      </ul>
    </div>
    <div class="card">
      <div class="card-title mb-12">📋 Pré-requisitos</div>
      <ul style="display:flex;flex-direction:column;gap:6px">
        ${(ov.prerequisites || []).map(p => `<li style="font-size:0.9rem;padding:6px 0;border-bottom:1px solid var(--border-light);display:flex;gap:8px;align-items:center"><span>→</span>${p}</li>`).join('')}
      </ul>
    </div>
  </div>
  <div>
    <div class="card-title mb-12">⚡ Módulos de estudo</div>
    <div class="module-cards">
      ${(ov.modules || []).map((m, i) => {
        const tabMap = ['visao-geral','tutor-ia','videoaulas','formulas','resumos','flashcards','exercicios','plano'];
        return `<div class="module-card" onclick="switchTab('${tabMap[i] || 'tutor-ia'}')">
          <div class="module-num">${i + 1}</div>
          <span>${m}</span>
        </div>`;
      }).join('')}
    </div>
  </div>
</div>`;
}

// --- Tutor IA Tab ---
function buildTutorTab(plan) {
  const ex = plan.explanations || {};
  const concepts = ex.concepts || [];
  const mistakes = ex.mistakes || [];
  const questions = ex.questions || [];

  return `
<div>
  <div class="explanation-toggle">
    <button class="btn btn-primary btn-sm" onclick="showExplanation('beginner',this)">🟢 Para iniciantes</button>
    <button class="btn btn-secondary btn-sm" onclick="showExplanation('advanced',this)">🔵 Aprofundado</button>
  </div>

  <div id="expl-beginner" class="card mb-24" style="display:block">
    <div class="card-title mb-12">🟢 Explicação para iniciantes</div>
    <div style="font-size:0.95rem;line-height:1.75">${markdownToHTML(ex.beginner || '')}</div>
  </div>
  <div id="expl-advanced" class="card mb-24" style="display:none">
    <div class="card-title mb-12">🔵 Explicação aprofundada</div>
    <div style="font-size:0.95rem;line-height:1.75">${markdownToHTML(ex.advanced || '')}</div>
  </div>

  ${concepts.length ? `
  <h3 class="mb-12" style="font-size:1rem;font-weight:700">💡 Conceitos fundamentais</h3>
  <div class="concept-cards mb-24">
    ${concepts.map(c => `<div class="concept-card ${c.type || ''}">
      <div class="concept-label">${c.label}</div>
      <div class="concept-content">${markdownToHTML(c.content)}</div>
    </div>`).join('')}
  </div>` : ''}

  ${ex.analogy ? `
  <div class="card mb-24" style="border-left:4px solid var(--accent)">
    <div class="card-title mb-8">🎭 Analogia para entender melhor</div>
    <p style="font-size:0.93rem;line-height:1.7">${ex.analogy}</p>
  </div>` : ''}

  ${mistakes.length ? `
  <div class="card mb-24">
    <div class="card-title mb-12">⚠️ Erros mais comuns</div>
    <ul style="display:flex;flex-direction:column;gap:8px">
      ${mistakes.map(m => `<li style="display:flex;gap:10px;align-items:flex-start;font-size:0.9rem;padding:8px;background:rgba(240,62,62,0.05);border-radius:6px"><span>❗</span>${m}</li>`).join('')}
    </ul>
  </div>` : ''}

  ${questions.length ? `
  <div class="card">
    <div class="card-title mb-16">🤔 Teste seu entendimento</div>
    <div style="display:flex;flex-direction:column;gap:16px">
      ${questions.map((q, i) => `
      <div>
        <p style="font-weight:600;margin-bottom:8px;font-size:0.95rem">${i + 1}. ${q.q}</p>
        <button class="btn btn-secondary btn-sm" onclick="this.nextElementSibling.style.display='block';this.style.display='none'">Ver resposta</button>
        <div style="display:none;padding:12px;background:var(--bg-card2);border-radius:6px;font-size:0.9rem;border-left:3px solid var(--success)">${q.a}</div>
      </div>`).join('')}
    </div>
  </div>` : ''}
</div>`;
}

function showExplanation(type, btn) {
  document.querySelectorAll('[id^="expl-"]').forEach(el => el.style.display = 'none');
  document.getElementById(`expl-${type}`).style.display = 'block';
  document.querySelectorAll('.explanation-toggle .btn').forEach(b => { b.classList.remove('btn-primary'); b.classList.add('btn-secondary'); });
  btn.classList.remove('btn-secondary'); btn.classList.add('btn-primary');
}
window.showExplanation = showExplanation;

// --- Videos Tab ---
function buildVideosTab(plan) {
  const settings = Storage.getSettings();
  const hasYT = !!settings.youtubeApiKey;
  const videos = plan.videos || [];

  const byCategory = {};
  videos.forEach(v => {
    if (!byCategory[v.category]) byCategory[v.category] = [];
    byCategory[v.category].push(v);
  });

  const fallbackBanner = `<div class="yt-fallback-banner">⚠️ <span>API do YouTube não configurada. Os links abaixo abrem uma pesquisa real no YouTube. Para resultados integrados, adicione sua chave de API nas <a href="#/configuracoes" onclick="navigate('/configuracoes')">Configurações</a>.</span></div>`;

  let html = (!hasYT ? fallbackBanner : '') + Object.entries(byCategory).map(([cat, vids]) => `
    <div class="video-category">
      <div class="video-category-title">${cat}</div>
      <div class="video-cards">
        ${vids.map(v => `
        <div class="video-card" onclick="openYT('${encodeURIComponent(v.query || v.title)}')">
          <div class="video-thumb">
            <span class="video-thumb-placeholder">🎬</span>
            <div class="video-play-overlay"><div class="play-btn">▶</div></div>
          </div>
          <div class="video-info">
            <div class="video-title">${v.title}</div>
            <div class="video-channel">📺 ${v.channel}</div>
            <div class="video-reason">💡 ${v.reason}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>`).join('');

  html += `<div class="mt-16">
    <button class="btn btn-outline" onclick="openYT('${encodeURIComponent(plan.topic + ' aula')}')">🔍 Buscar mais vídeos no YouTube</button>
  </div>`;

  return html;
}

function openYT(query) {
  window.open(`https://www.youtube.com/results?search_query=${query}&hl=pt&gl=BR`, '_blank');
}
window.openYT = openYT;

// --- Formulas Tab ---
function buildFormulasTab(plan) {
  const formulas = plan.formulas || [];
  if (!formulas.length) {
    return `<div class="empty-state">
      <div class="empty-state-icon">📐</div>
      <div class="empty-state-title">Sem fórmulas neste tema</div>
      <p>Este assunto não possui fórmulas matemáticas específicas. Explore as outras abas!</p>
    </div>`;
  }

  return formulas.map((f, fi) => `
  <div class="formula-card fade-in">
    <div class="formula-name">${f.name}</div>
    <div class="formula-desc-text">${f.desc}</div>
    <div class="formula-display" id="fdisp-${fi}"></div>
    ${f.variables?.length ? `
    <div class="formula-vars mb-16">
      <strong style="font-size:0.85rem;display:block;margin-bottom:8px">Variáveis:</strong>
      <table><thead><tr><th>Símbolo</th><th>Significado</th></tr></thead><tbody>
        ${f.variables.map(v => `<tr><td><code style="font-weight:700;color:var(--primary)">${v.symbol}</code></td><td>${v.meaning}</td></tr>`).join('')}
      </tbody></table>
    </div>` : ''}
    ${f.when ? `<div class="mb-16"><strong style="font-size:0.85rem">Quando usar:</strong><p style="font-size:0.88rem;margin-top:4px;color:var(--text-muted)">${f.when}</p></div>` : ''}
    ${f.example ? `
    <div class="mb-16">
      <strong style="font-size:0.9rem;display:block;margin-bottom:10px">📘 Exemplo resolvido: ${f.example.problem}</strong>
      <div class="step-by-step">
        ${(f.example.steps || []).map(s => `<div class="step-item">${s}</div>`).join('')}
      </div>
    </div>` : ''}
    ${f.practice ? `
    <div class="practice-reveal">
      <div class="practice-question">🏋️ Pratique: ${f.practice.q}</div>
      <button class="btn btn-outline btn-sm" onclick="this.nextElementSibling.style.display='block';this.style.display='none'">Ver resolução</button>
      <div style="display:none;margin-top:10px;padding:10px;background:rgba(55,178,77,0.08);border-radius:6px;font-size:0.9rem;border-left:3px solid var(--success)">${f.practice.a}</div>
    </div>` : ''}
    ${f.tip ? `<div class="formula-tip mt-12">💡 <strong>Dica de memorização:</strong> ${f.tip}</div>` : ''}
  </div>`).join('');
}

// Post-render KaTeX for formulas (called after DOM is ready)
function initFormulaKaTeX(plan) {
  (plan.formulas || []).forEach((f, fi) => {
    const el = document.getElementById(`fdisp-${fi}`);
    if (el && f.latex) renderLatex(el, f.latex);
  });
}

// Override switchTab to init KaTeX on formulas
const _origSwitch = switchTab;
window.switchTab = function(id) {
  _origSwitch(id);
  if (id === 'formulas' && currentPlan) setTimeout(() => initFormulaKaTeX(currentPlan), 150);
};

// --- Summaries Tab ---
function buildSummariesTab(plan) {
  const s = plan.summaries || {};
  return `
<div>
  <div class="flex items-center justify-between flex-wrap gap-8 mb-16">
    <div class="summary-types">
      <button class="summary-type-btn active" onclick="showSummary('short',this)">📋 5 linhas</button>
      <button class="summary-type-btn" onclick="showSummary('full',this)">📄 Completo</button>
      <button class="summary-type-btn" onclick="showSummary('keywords',this)">🔑 Palavras-chave</button>
      <button class="summary-type-btn" onclick="showSummary('glossary',this)">📖 Glossário</button>
      ${s.comparativeTable ? '<button class="summary-type-btn" onclick="showSummary(\'table\',this)">📊 Tabela</button>' : ''}
      <button class="summary-type-btn" onclick="showSummary('mindmap',this)">🗺️ Mapa mental</button>
      ${s.timeline ? '<button class="summary-type-btn" onclick="showSummary(\'timeline\',this)">⏱️ Linha do tempo</button>' : ''}
    </div>
    <div class="summary-actions">
      <button class="btn btn-secondary btn-sm" onclick="copyContent()">📋 Copiar</button>
      <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Imprimir</button>
    </div>
  </div>

  <div id="summary-short" class="card summary-content" style="display:block">
    <div class="card-title mb-12">📋 Resumo em 5 linhas</div>
    <p style="font-size:0.95rem;line-height:1.8">${s.short || 'Resumo não disponível.'}</p>
  </div>
  <div id="summary-full" class="card summary-content" style="display:none">
    <div class="card-title mb-12">📄 Resumo completo</div>
    <div style="font-size:0.93rem;line-height:1.8">${markdownToHTML(s.full || '')}</div>
  </div>
  <div id="summary-keywords" class="card summary-content" style="display:none">
    <div class="card-title mb-12">🔑 Palavras-chave</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      ${(s.keywords || []).map(k => `<span class="badge badge-primary" style="font-size:0.9rem;padding:6px 14px">${k}</span>`).join('')}
    </div>
  </div>
  <div id="summary-glossary" class="card summary-content" style="display:none">
    <div class="card-title mb-12">📖 Glossário</div>
    <div class="glossary-list">
      ${(s.glossary || []).map(g => `<div class="glossary-item"><div class="glossary-term">${g.term}</div><div class="glossary-def">${g.def}</div></div>`).join('')}
    </div>
  </div>
  ${s.comparativeTable ? `
  <div id="summary-table" class="card summary-content" style="display:none">
    <div class="card-title mb-12">📊 Tabela comparativa</div>
    <div style="overflow-x:auto">
      <table class="comp-table">
        <thead><tr>${s.comparativeTable.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${s.comparativeTable.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>
  </div>` : '<div id="summary-table" class="summary-content" style="display:none"></div>'}
  <div id="summary-mindmap" class="card summary-content" style="display:none">
    <div class="card-title mb-16">🗺️ Mapa mental</div>
    ${buildMindMap(s.mindMap)}
  </div>
  ${s.timeline ? `
  <div id="summary-timeline" class="card summary-content" style="display:none">
    <div class="card-title mb-16">⏱️ Linha do tempo</div>
    <div class="timeline-list">
      ${s.timeline.map(t => `<div class="timeline-item"><div class="timeline-year">${t.year}</div><div class="timeline-event">${t.event}</div><div class="timeline-detail">${t.detail}</div></div>`).join('')}
    </div>
  </div>` : '<div id="summary-timeline" class="summary-content" style="display:none"></div>'}
</div>`;
}

function buildMindMap(mm) {
  if (!mm) return '<p class="text-muted">Mapa mental não disponível.</p>';
  return `<div class="mind-map">
    <div class="mind-map-tree">
      <div class="mm-root">${mm.root}</div>
      <div class="mm-branches">
        ${(mm.branches || []).map(b => `
        <div class="mm-branch">
          <div class="mm-node">${b.node}</div>
          <div class="mm-leaves">
            ${(b.leaves || []).map(l => `<div class="mm-leaf">${l}</div>`).join('')}
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

function showSummary(type, btn) {
  document.querySelectorAll('.summary-content').forEach(el => el.style.display = 'none');
  document.getElementById(`summary-${type}`).style.display = 'block';
  document.querySelectorAll('.summary-type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
window.showSummary = showSummary;

function copyContent() {
  const visible = document.querySelector('.summary-content[style*="block"]');
  if (visible) {
    navigator.clipboard.writeText(visible.innerText).then(() => showToast('Copiado para a área de transferência! 📋'));
  }
}
window.copyContent = copyContent;

// --- Flashcards Tab ---
function buildFlashcardsTab(plan) {
  const cards = plan.flashcards || [];
  if (!cards.length) return `<div class="empty-state"><div class="empty-state-icon">🃏</div><div class="empty-state-title">Sem flashcards</div><p>Nenhum flashcard disponível para este tema.</p></div>`;

  return `
<div>
  <div class="flex items-center justify-between mb-16 flex-wrap gap-8">
    <div>
      <h3 style="font-weight:700;margin-bottom:4px">🃏 Flashcards — Repetição Espaçada (SM-2)</h3>
      <p class="text-muted" style="font-size:0.85rem">${cards.length} cartões · Clique no cartão para revelar a resposta</p>
    </div>
    <button class="btn btn-secondary btn-sm" onclick="shuffleFlashcards()">🔀 Embaralhar</button>
  </div>

  <div class="flashcard-nav">
    <button class="btn btn-secondary btn-sm" onclick="prevCard()">← Anterior</button>
    <span class="card-counter" id="fcCounter">1 / ${cards.length}</span>
    <button class="btn btn-secondary btn-sm" onclick="nextCard()">Próximo →</button>
  </div>

  <div class="flashcard-container">
    <div class="flashcard" id="theFlashcard" onclick="flipCard()">
      <div class="flashcard-front">
        <div class="flashcard-label">PERGUNTA</div>
        <div class="flashcard-text" id="fcFront">${cards[0].front}</div>
        <div class="flashcard-hint">Clique para ver a resposta</div>
      </div>
      <div class="flashcard-back">
        <div class="flashcard-label">RESPOSTA</div>
        <div class="flashcard-text" id="fcBack" style="white-space:pre-line">${cards[0].back}</div>
      </div>
    </div>
  </div>

  <div class="flashcard-actions" id="fcActions" style="display:none">
    <button class="btn fc-btn fc-easy" onclick="rateCard(5)">😊 Fácil</button>
    <button class="btn fc-btn fc-hard" onclick="rateCard(3)">😅 Difícil</button>
    <button class="btn fc-btn fc-again" onclick="rateCard(1)">❌ Errei</button>
  </div>
  <div class="sm2-info" id="sm2Info"></div>

  <hr class="divider">
  <div class="feynman-box">
    <h4 style="font-weight:700;margin-bottom:8px">🧪 Técnica de Feynman</h4>
    <p style="font-size:0.88rem;color:var(--text-muted);margin-bottom:12px">Tente explicar o conceito com suas próprias palavras, como se fosse ensinar a uma criança de 12 anos.</p>
    <textarea class="form-control" rows="4" placeholder="Escreva aqui sua explicação sobre ${plan.topic}..." style="margin-bottom:10px"></textarea>
    <button class="btn btn-outline btn-sm" onclick="showToast('Continue praticando! Quanto mais simples, melhor. 🧠')">Analisar minha explicação</button>
  </div>
</div>`;
}

let flashcardOrder = [];

function initFlashcards() {
  if (!currentPlan) return;
  flashcardOrder = currentPlan.flashcards.map((_, i) => i);
}

function flipCard() {
  const fc = document.getElementById('theFlashcard');
  fcFlipped = !fcFlipped;
  fc.classList.toggle('flipped', fcFlipped);
  const actions = document.getElementById('fcActions');
  if (actions) actions.style.display = fcFlipped ? 'flex' : 'none';
}
window.flipCard = flipCard;

function updateFlashcardDisplay() {
  if (!currentPlan) return;
  const cards = currentPlan.flashcards;
  const card = cards[fcIndex];
  if (!card) return;
  const fc = document.getElementById('theFlashcard');
  if (fc) fc.classList.remove('flipped');
  fcFlipped = false;
  const actions = document.getElementById('fcActions');
  if (actions) actions.style.display = 'none';
  document.getElementById('fcFront').textContent = card.front;
  document.getElementById('fcBack').textContent = card.back;
  document.getElementById('fcCounter').textContent = `${fcIndex + 1} / ${cards.length}`;
  document.getElementById('sm2Info').textContent = '';
}

function nextCard() {
  if (!currentPlan) return;
  fcIndex = (fcIndex + 1) % currentPlan.flashcards.length;
  updateFlashcardDisplay();
}
function prevCard() {
  if (!currentPlan) return;
  fcIndex = (fcIndex - 1 + currentPlan.flashcards.length) % currentPlan.flashcards.length;
  updateFlashcardDisplay();
}
window.nextCard = nextCard;
window.prevCard = prevCard;

function rateCard(quality) {
  if (!currentPlan) return;
  const card = currentPlan.flashcards[fcIndex];
  if (!card) return;
  const result = Storage.updateCard(card.id, quality);
  const info = document.getElementById('sm2Info');
  if (info) info.textContent = `Próxima revisão em ${result.interval} dia(s). EF: ${result.ef.toFixed(2)}`;
  setTimeout(() => nextCard(), 800);
}
window.rateCard = rateCard;

function shuffleFlashcards() {
  if (!currentPlan) return;
  currentPlan.flashcards = currentPlan.flashcards.sort(() => Math.random() - 0.5);
  fcIndex = 0;
  updateFlashcardDisplay();
  showToast('Flashcards embaralhados! 🔀');
}
window.shuffleFlashcards = shuffleFlashcards;

// --- Exercises Tab ---
function buildExercisesTab(plan) {
  const exs = plan.exercises || [];
  if (!exs.length) return `<div class="empty-state"><div class="empty-state-icon">✏️</div><div class="empty-state-title">Sem exercícios</div><p>Nenhum exercício disponível para este tema.</p></div>`;

  exerciseAnswered = new Array(exs.length).fill(false);
  const letters = ['A','B','C','D','E'];

  const diffColors = { 'Fácil':'badge-success','Médio':'badge-warning','Difícil':'badge-danger','ENEM':'badge-accent' };

  let html = `<div class="exercises-controls">
    <span style="font-weight:600;font-size:0.9rem">${exs.length} questões</span>
    <div id="scoreArea"></div>
  </div>`;

  html += exs.map((ex, ei) => `
  <div class="exercise-card" id="excard-${ei}">
    <div class="exercise-num">Questão ${ei + 1} · <span class="badge ${diffColors[ex.difficulty] || 'badge-primary'}">${ex.difficulty}</span></div>
    <div class="exercise-q">${ex.question}</div>
    <div class="options-list">
      ${ex.options.map((opt, oi) => `
      <button class="option-btn" id="opt-${ei}-${oi}" onclick="answerExercise(${ei},${oi},${ex.correct})">
        <span class="option-letter">${letters[oi]}</span>
        <span>${opt}</span>
      </button>`).join('')}
    </div>
    <div class="exercise-feedback" id="fb-${ei}"></div>
  </div>`).join('');

  html += `<button class="btn btn-outline" onclick="resetExercises()">🔄 Refazer exercícios</button>`;
  return html;
}

function answerExercise(ei, oi, correct) {
  if (!currentPlan || exerciseAnswered[ei]) return;
  exerciseAnswered[ei] = true;

  const opts = document.querySelectorAll(`[id^="opt-${ei}-"]`);
  opts.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add('correct');
    else if (i === oi) btn.classList.add('wrong');
  });

  const fb = document.getElementById(`fb-${ei}`);
  const isCorrect = oi === correct;
  const ex = currentPlan.exercises[ei];
  fb.className = `exercise-feedback show ${isCorrect ? 'success' : 'error'}`;
  fb.innerHTML = `<strong>${isCorrect ? '✅ Correto!' : '❌ Incorreto.'}</strong><br>${ex.explanation || ''}<br><small style="color:var(--text-muted);margin-top:6px;display:block">Habilidade: ${ex.skill || ''}</small>`;

  // Check all answered
  const answered = exerciseAnswered.filter(Boolean).length;
  if (answered === currentPlan.exercises.length) {
    const correct_count = exerciseAnswered.filter((_, i) => {
      const btns = document.querySelectorAll(`[id^="opt-${i}-"]`);
      return [...btns].some(b => b.classList.contains('correct') && b.disabled && [...btns].indexOf(b) === currentPlan.exercises[i].correct);
    }).length;
    const score = Math.round((correct_count / currentPlan.exercises.length) * 100);
    Storage.addQuizResult({ topic: currentPlan.topic, score, total: currentPlan.exercises.length });
    Storage.updateStats({ score });
    document.getElementById('scoreArea').innerHTML = `<div class="score-display"><div class="score-num">${score}%</div><div class="score-label">Pontuação final · ${correct_count}/${currentPlan.exercises.length} corretas</div></div>`;
    if (score >= 70 && window.confetti) confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
  }
}
window.answerExercise = answerExercise;

function resetExercises() {
  if (!currentPlan) return;
  exerciseAnswered = new Array(currentPlan.exercises.length).fill(false);
  const panel = document.getElementById('tab-exercicios');
  if (panel) panel.innerHTML = buildExercisesTab(currentPlan);
}
window.resetExercises = resetExercises;

// --- Study Plan Tab ---
function buildPlanTab(plan) {
  const steps = plan.schedule || [];
  const completedSteps = Storage.getCompletedSteps(plan.id);
  const pct = steps.length ? Math.round((completedSteps.length / steps.length) * 100) : 0;

  const typeIcon = { theory: '📖', practice: '✏️', review: '🔄', quiz: '✅' };

  return `
<div>
  <h3 class="mb-16" style="font-weight:700">📋 Plano de estudos — ${plan.topic}</h3>

  <div class="plan-layout">
    <div>
      <div class="pomodoro-timer">
        <div class="timer-display" id="timerDisplay">25:00</div>
        <div class="timer-label">Pomodoro</div>
        <select class="timer-select" id="timerDuration" onchange="resetTimer()">
          <option value="15">15 min</option>
          <option value="25" selected>25 min</option>
          <option value="45">45 min</option>
          <option value="60">60 min</option>
        </select>
        <div class="timer-controls">
          <button class="btn btn-primary btn-sm" id="timerBtn" onclick="toggleTimer()">▶ Iniciar</button>
          <button class="btn btn-secondary btn-sm" onclick="resetTimer()">↺</button>
        </div>
      </div>
    </div>

    <div>
      <div class="plan-progress-section mb-16">
        <div class="flex justify-between mb-8" style="font-size:0.88rem;font-weight:600">
          <span>Progresso</span>
          <span>${pct}% concluído</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" id="planProgress" style="width:${pct}%"></div></div>
        <p style="font-size:0.82rem;color:var(--text-muted);margin-top:6px">${completedSteps.length}/${steps.length} etapas concluídas</p>
      </div>

      <div class="steps-list" id="stepsList">
        ${steps.map(step => {
          const done = completedSteps.includes(step.id);
          return `<div class="step-item-plan${done ? ' done' : ''}" id="step-${step.id}" onclick="toggleStep('${step.id}')">
            <div class="step-check">${done ? '✓' : ''}</div>
            <div class="step-name">${typeIcon[step.type] || '📌'} ${step.name}</div>
            <div class="step-duration">${step.duration} min</div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>
</div>`;
}

function toggleStep(stepId) {
  if (!currentPlan) return;
  const steps = Storage.toggleStep(currentPlan.id, stepId);
  const el = document.getElementById(`step-${stepId}`);
  if (el) {
    const done = steps.includes(stepId);
    el.classList.toggle('done', done);
    el.querySelector('.step-check').textContent = done ? '✓' : '';
  }
  // Update progress
  const allSteps = currentPlan.schedule || [];
  const pct = allSteps.length ? Math.round((steps.length / allSteps.length) * 100) : 0;
  const bar = document.getElementById('planProgress');
  if (bar) bar.style.width = pct + '%';
  if (pct === 100 && window.confetti) {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    showToast('🎉 Parabéns! Você concluiu o plano de estudos!');
  }
}
window.toggleStep = toggleStep;

// Pomodoro timer
function toggleTimer() {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    document.getElementById('timerBtn').textContent = '▶ Continuar';
  } else {
    if (timerSeconds <= 0) {
      const mins = parseInt(document.getElementById('timerDuration').value) || 25;
      timerSeconds = mins * 60;
    }
    timerRunning = true;
    document.getElementById('timerBtn').textContent = '⏸ Pausar';
    timerInterval = setInterval(() => {
      timerSeconds--;
      updateTimerDisplay();
      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        document.getElementById('timerBtn').textContent = '▶ Iniciar';
        Storage.updateStats({ minutes: parseInt(document.getElementById('timerDuration')?.value) || 25 });
        updateStreakBadge();
        showToast('⏰ Pomodoro concluído! Faça uma pausa.');
        if (window.confetti) confetti({ particleCount: 60, spread: 50 });
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  const mins = parseInt(document.getElementById('timerDuration')?.value) || 25;
  timerSeconds = mins * 60;
  updateTimerDisplay();
  const btn = document.getElementById('timerBtn');
  if (btn) btn.textContent = '▶ Iniciar';
}

function updateTimerDisplay() {
  const el = document.getElementById('timerDisplay');
  if (!el) return;
  const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const s = String(timerSeconds % 60).padStart(2, '0');
  el.textContent = `${m}:${s}`;
}

window.toggleTimer = toggleTimer;
window.resetTimer = resetTimer;

// --- Chat ---
function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById('chatDrawer').classList.toggle('open', chatOpen);
}
window.toggleChat = toggleChat;

async function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';

  appendChatMsg(msg, 'user');
  chatHistory.push({ role: 'user', content: msg });

  const thinking = appendChatMsg('Digitando...', 'ai loading');
  const settings = Storage.getSettings();

  try {
    const reply = await GeminiAPI.askTutor(msg, currentPlan?.topic || '', chatHistory, settings.geminiApiKey);
    thinking.remove();
    appendChatMsg(reply, 'ai');
    chatHistory.push({ role: 'ai', content: reply });
  } catch (e) {
    thinking.remove();
    appendChatMsg('Erro ao conectar com o Tutor IA. Verifique sua chave de API nas Configurações.', 'ai');
  }
}
window.sendChat = sendChat;

function appendChatMsg(text, cls) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-msg ${cls}`;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

// ============================================================
//   DASHBOARD PAGE
// ============================================================
function renderDashboard() {
  const stats = Storage.getStats();
  const plans = Storage.getPlans();
  const quizResults = Storage.getQuizResults();
  const history = Storage.getHistory();

  const root = document.getElementById('appRoot');
  root.innerHTML = `
<div class="page container fade-in">
  <h1 class="mb-24" style="font-size:1.6rem;font-weight:800">📊 Dashboard</h1>

  <div class="dashboard-grid mb-32">
    ${[
      ['🔥', stats.streak || 0, 'Dias consecutivos'],
      ['⏱️', Math.round((stats.totalMinutes || 0) / 60) + 'h', 'Tempo de estudo'],
      ['📚', stats.topicsStudied || 0, 'Assuntos estudados'],
      ['🎯', (stats.avgScore || 0) + '%', 'Média nos exercícios'],
    ].map(([icon, val, label]) => `
    <div class="stat-card">
      <div class="stat-card-icon">${icon}</div>
      <div class="stat-card-value">${val}</div>
      <div class="stat-card-label">${label}</div>
    </div>`).join('')}
  </div>

  <div class="grid-2" style="gap:24px;align-items:start">
    <div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">📋 Planos em andamento</div>
          <a href="#/" onclick="navigate('/')" class="btn btn-outline btn-sm">+ Novo</a>
        </div>
        ${plans.length ? `<div class="ongoing-list">
          ${plans.slice(0, 5).map(p => {
            const done = Storage.getCompletedSteps(p.id).length;
            const total = (p.schedule || []).length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            return `<div class="ongoing-item" onclick="navigate('/estudo/${p.slug}')">
              <span class="ongoing-icon">📚</span>
              <div style="flex:1;min-width:0">
                <div class="ongoing-title">${p.topic}</div>
                <div class="ongoing-meta">${p.category} · ${pct}% concluído</div>
                <div class="progress-bar mt-8" style="height:4px"><div class="progress-fill" style="width:${pct}%"></div></div>
              </div>
            </div>`;
          }).join('')}
        </div>` : '<div class="empty-state" style="padding:24px"><div class="empty-state-icon">📚</div><p>Nenhum plano ainda. <a href="#/" onclick="navigate(\'/\')">Comece agora!</a></p></div>'}
      </div>
    </div>

    <div>
      <div class="card mb-16">
        <div class="card-title mb-12">📜 Histórico de pesquisas</div>
        ${history.length ? `<div class="history-list">
          ${history.slice(0, 8).map(h => `
          <div class="history-item" onclick="startStudy('${h.topic}')">
            <span>🔍</span>
            <span style="flex:1;font-size:0.9rem">${h.topic}</span>
            <span style="font-size:0.78rem;color:var(--text-muted)">${formatDate(h.timestamp)}</span>
          </div>`).join('')}
        </div>` : '<p class="text-muted" style="font-size:0.88rem">Sem histórico ainda.</p>'}
      </div>

      <div class="card">
        <div class="card-title mb-12">🎯 Resultados de exercícios</div>
        ${quizResults.length ? `<div style="display:flex;flex-direction:column;gap:8px">
          ${quizResults.slice(0, 5).map(r => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-light)">
            <span style="font-size:0.88rem;font-weight:500">${r.topic}</span>
            <span class="badge ${r.score >= 70 ? 'badge-success' : 'badge-warning'}">${r.score}%</span>
          </div>`).join('')}
        </div>` : '<p class="text-muted" style="font-size:0.88rem">Resolva exercícios para ver seu histórico.</p>'}
      </div>
    </div>
  </div>
</div>`;
}

// ============================================================
//   BIBLIOTECA PAGE
// ============================================================
function renderBiblioteca() {
  const favs = Storage.getFavorites();
  const history = Storage.getHistory();
  const root = document.getElementById('appRoot');

  root.innerHTML = `
<div class="page container fade-in">
  <div class="flex justify-between items-center flex-wrap gap-12 mb-24">
    <h1 style="font-size:1.6rem;font-weight:800">📚 Biblioteca Pessoal</h1>
    <div style="display:flex;gap:8px">
      <button class="btn btn-secondary btn-sm" onclick="exportData()">⬇️ Exportar</button>
      <label class="btn btn-secondary btn-sm" style="cursor:pointer">⬆️ Importar<input type="file" accept=".json" onchange="importData(event)" style="display:none"></label>
    </div>
  </div>

  <div class="biblioteca-controls">
    <input type="text" class="biblioteca-search form-control" placeholder="🔍 Buscar nos favoritos..." oninput="filterFavs(this.value)" id="favSearch">
    <div class="filter-pills">
      <button class="filter-btn active" onclick="filterFavsByType('all',this)">Todos</button>
      <button class="filter-btn" onclick="filterFavsByType('plano',this)">Planos</button>
      <button class="filter-btn" onclick="filterFavsByType('resumo',this)">Resumos</button>
    </div>
  </div>

  <div id="favGrid" class="fav-grid mb-32">
    ${favs.length ? favs.map(f => buildFavCard(f)).join('') : `
    <div class="empty-state" style="grid-column:1/-1">
      <div class="empty-state-icon">⭐</div>
      <div class="empty-state-title">Biblioteca vazia</div>
      <p>Salve assuntos, resumos e fórmulas favoritas aqui. Clique em ⭐ na página de estudos!</p>
      <button class="btn btn-primary" onclick="navigate('/')">Começar a estudar</button>
    </div>`}
  </div>

  <div class="card">
    <div class="card-title mb-12">🕐 Histórico de pesquisas</div>
    ${history.length ? `
    <div class="history-list">
      ${history.map(h => `
      <div class="history-item" onclick="startStudy('${h.topic}')">
        <span>🔍</span>
        <span style="flex:1;font-size:0.9rem">${h.topic}</span>
        <span style="font-size:0.78rem;color:var(--text-muted)">${formatDate(h.timestamp)}</span>
      </div>`).join('')}
    </div>
    <button class="btn btn-secondary btn-sm mt-12" onclick="clearHistory()">🗑️ Limpar histórico</button>` : '<p class="text-muted" style="font-size:0.88rem">Sem histórico ainda.</p>'}
  </div>
</div>`;
}

function buildFavCard(f) {
  return `<div class="fav-card" data-type="${f.type}" data-title="${(f.title || '').toLowerCase()}">
    <span class="fav-icon">${f.icon || '📄'}</span>
    <div class="fav-body">
      <div class="fav-title">${f.title}</div>
      <div class="fav-meta">${f.category || ''} · ${formatDate(f.savedAt)}</div>
    </div>
    <div class="fav-actions">
      <button class="btn-icon btn-sm" onclick="navigate('/estudo/${slugify(f.title)}')" title="Abrir">▶</button>
      <button class="btn-icon btn-sm" onclick="removeFav('${f.id}',this)" title="Remover">🗑️</button>
    </div>
  </div>`;
}

function removeFav(id, btn) {
  Storage.removeFavorite(id);
  btn.closest('.fav-card')?.remove();
  showToast('Removido dos favoritos');
}
window.removeFav = removeFav;

function filterFavs(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.fav-card').forEach(c => {
    c.style.display = c.dataset.title?.includes(q) ? '' : 'none';
  });
}
window.filterFavs = filterFavs;

function filterFavsByType(type, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.fav-card').forEach(c => {
    c.style.display = (type === 'all' || c.dataset.type === type) ? '' : 'none';
  });
}
window.filterFavsByType = filterFavsByType;

function clearHistory() {
  if (confirm('Limpar todo o histórico de pesquisas?')) {
    Storage.clearHistory();
    renderBiblioteca();
    showToast('Histórico limpo!');
  }
}
window.clearHistory = clearHistory;

function exportData() {
  const json = Storage.exportAll();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'studyai-backup.json'; a.click();
  URL.revokeObjectURL(url);
  showToast('Dados exportados! ⬇️');
}
window.exportData = exportData;

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      Storage.importAll(ev.target.result);
      showToast('Dados importados com sucesso! ⬆️');
      renderBiblioteca();
    } catch { showToast('Erro ao importar arquivo.'); }
  };
  reader.readAsText(file);
}
window.importData = importData;

// ============================================================
//   CONFIGURAÇÕES PAGE
// ============================================================
function renderConfiguracoes() {
  const settings = Storage.getSettings();
  const root = document.getElementById('appRoot');

  root.innerHTML = `
<div class="page container fade-in">
  <h1 class="mb-24" style="font-size:1.6rem;font-weight:800">⚙️ Configurações</h1>
  <div class="settings-layout">

    <div class="settings-section">
      <div class="settings-section-title">Inteligência Artificial</div>
      <div class="card">
        <div class="form-group">
          <label class="form-label">🔑 Chave de API do Gemini</label>
          <div style="display:flex;gap:8px">
            <input type="password" class="form-control api-key-input" id="geminiKey" value="${settings.geminiApiKey || ''}" placeholder="AIza..." style="font-family:monospace">
            <button class="btn btn-secondary btn-sm" onclick="toggleKeyViz('geminiKey')">👁</button>
          </div>
          <p class="form-hint">Obtenha gratuitamente em <a href="https://aistudio.google.com/app/apikey" target="_blank">aistudio.google.com</a></p>
          <div id="geminiStatus"></div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary btn-sm" onclick="saveGeminiKey()">Salvar</button>
          <button class="btn btn-secondary btn-sm" onclick="testGeminiKey()">🧪 Testar</button>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Videoaulas</div>
      <div class="card">
        <div class="form-group">
          <label class="form-label">🎬 Chave de API do YouTube Data v3</label>
          <div style="display:flex;gap:8px">
            <input type="password" class="form-control api-key-input" id="youtubeKey" value="${settings.youtubeApiKey || ''}" placeholder="AIza..." style="font-family:monospace">
            <button class="btn btn-secondary btn-sm" onclick="toggleKeyViz('youtubeKey')">👁</button>
          </div>
          <p class="form-hint">Obtenha no <a href="https://console.cloud.google.com" target="_blank">Google Cloud Console</a> — ative a YouTube Data API v3</p>
          <div id="youtubeStatus"></div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="saveYoutubeKey()">Salvar</button>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Aparência</div>
      <div class="card">
        <div class="form-group">
          <label class="form-label">🎨 Tema</label>
          <div style="display:flex;gap:10px">
            <button class="btn btn-secondary" onclick="applyTheme('light')">☀️ Claro</button>
            <button class="btn btn-secondary" onclick="applyTheme('dark')">🌙 Escuro</button>
          </div>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Dados</div>
      <div class="card">
        <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:16px">Exporte seus dados ou redefina todas as configurações. Esta ação não pode ser desfeita.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-secondary btn-sm" onclick="exportData()">⬇️ Exportar dados</button>
          <button class="btn btn-danger btn-sm" onclick="confirmReset()">🗑️ Apagar todos os dados</button>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

function toggleKeyViz(id) {
  const inp = document.getElementById(id);
  if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
}
window.toggleKeyViz = toggleKeyViz;

function saveGeminiKey() {
  const s = Storage.getSettings();
  s.geminiApiKey = document.getElementById('geminiKey').value.trim();
  Storage.saveSettings(s);
  showToast('Chave do Gemini salva! ✅');
}
window.saveGeminiKey = saveGeminiKey;

async function testGeminiKey() {
  const key = document.getElementById('geminiKey').value.trim();
  const status = document.getElementById('geminiStatus');
  status.innerHTML = '<span style="color:var(--text-muted);font-size:0.85rem">Testando...</span>';
  try {
    await GeminiAPI.callGemini('Responda apenas "OK" em português.', key);
    status.innerHTML = '<span class="api-status ok">✅ Chave válida e funcionando!</span>';
  } catch (e) {
    status.innerHTML = `<span class="api-status fail">❌ Erro: ${e.message}</span>`;
  }
}
window.testGeminiKey = testGeminiKey;

function saveYoutubeKey() {
  const s = Storage.getSettings();
  s.youtubeApiKey = document.getElementById('youtubeKey').value.trim();
  Storage.saveSettings(s);
  showToast('Chave do YouTube salva! ✅');
}
window.saveYoutubeKey = saveYoutubeKey;

function confirmReset() {
  openModal('⚠️ Apagar todos os dados', `
    <p style="margin-bottom:16px">Esta ação removerá todos os seus planos, flashcards, histórico e configurações. <strong>Não pode ser desfeita.</strong></p>
    <div style="display:flex;gap:10px">
      <button class="btn btn-danger" onclick="resetAllData()">Sim, apagar tudo</button>
      <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    </div>`);
}
window.confirmReset = confirmReset;

function resetAllData() {
  Storage.clearAll();
  closeModal();
  showToast('Dados apagados! 🗑️');
  setTimeout(() => navigate('/'), 1000);
}
window.resetAllData = resetAllData;

// ============================================================
//   UTILITIES
// ============================================================
function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function slugify(text) {
  return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function markdownToHTML(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:var(--bg-card2);padding:1px 5px;border-radius:3px">$1</code>')
    .replace(/^#{1,3}\s+(.*)/gm, '<h3 style="font-weight:700;margin:12px 0 6px">$1</h3>')
    .replace(/^[-•]\s+(.*)/gm, '<li style="padding:4px 0;padding-left:16px;list-style:disc;list-style-position:inside">$1</li>')
    .replace(/\n\n/g, '</p><p style="margin:8px 0">')
    .replace(/\n/g, '<br>');
}
