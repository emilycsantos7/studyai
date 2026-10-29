'use strict';

const KEYS = {
  plans: 'studyai_plans_v1',
  currentPlan: 'studyai_current_plan_v1',
  favorites: 'studyai_favorites_v1',
  history: 'studyai_history_v1',
  stats: 'studyai_stats_v1',
  quizResults: 'studyai_quiz_results_v1',
  flashcardProgress: 'studyai_flashcard_progress_v1',
  settings: 'studyai_settings_v1',
  theme: 'studyai_theme_v1',
};

function getJSON(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
}
function setJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (e) { console.warn('Storage write failed:', e); }
}

const Storage = {
  getPlans() { return getJSON(KEYS.plans, []); },
  savePlan(plan) {
    const plans = this.getPlans();
    const idx = plans.findIndex(p => p.id === plan.id);
    if (idx >= 0) plans[idx] = plan; else plans.unshift(plan);
    setJSON(KEYS.plans, plans.slice(0, 30));
  },
  deletePlan(id) { setJSON(KEYS.plans, this.getPlans().filter(p => p.id !== id)); },
  getCurrentPlan() { return getJSON(KEYS.currentPlan, null); },
  setCurrentPlan(plan) { setJSON(KEYS.currentPlan, plan); },

  getFavorites() { return getJSON(KEYS.favorites, []); },
  addFavorite(item) {
    const favs = this.getFavorites();
    if (!favs.find(f => f.id === item.id)) { favs.unshift({ ...item, savedAt: Date.now() }); setJSON(KEYS.favorites, favs); }
  },
  removeFavorite(id) { setJSON(KEYS.favorites, this.getFavorites().filter(f => f.id !== id)); },
  isFavorite(id) { return this.getFavorites().some(f => f.id === id); },

  getHistory() { return getJSON(KEYS.history, []); },
  addHistory(topic) {
    const h = this.getHistory().filter(x => x.topic !== topic);
    h.unshift({ topic, timestamp: Date.now() });
    setJSON(KEYS.history, h.slice(0, 20));
  },
  clearHistory() { setJSON(KEYS.history, []); },

  getStats() {
    return getJSON(KEYS.stats, { totalMinutes: 0, topicsStudied: 0, streak: 0, lastStudyDate: null, avgScore: 0, totalQuizzes: 0 });
  },
  updateStats(delta) {
    const s = this.getStats();
    const today = new Date().toDateString();
    if (s.lastStudyDate !== today) {
      const yest = new Date(Date.now() - 86400000).toDateString();
      s.streak = (s.lastStudyDate === yest) ? s.streak + 1 : 1;
      s.lastStudyDate = today;
    }
    if (delta.minutes) s.totalMinutes += delta.minutes;
    if (delta.topic) s.topicsStudied += 1;
    if (delta.score !== undefined) {
      const total = s.avgScore * s.totalQuizzes + delta.score;
      s.totalQuizzes += 1;
      s.avgScore = Math.round(total / s.totalQuizzes);
    }
    setJSON(KEYS.stats, s);
    return s;
  },

  getQuizResults() { return getJSON(KEYS.quizResults, []); },
  addQuizResult(result) {
    const r = this.getQuizResults();
    r.unshift({ ...result, timestamp: Date.now() });
    setJSON(KEYS.quizResults, r.slice(0, 50));
  },

  getFlashcardProgress() { return getJSON(KEYS.flashcardProgress, {}); },
  saveFlashcardProgress(data) { setJSON(KEYS.flashcardProgress, data); },
  updateCard(cardId, quality) {
    const progress = this.getFlashcardProgress();
    let c = progress[cardId] || { ef: 2.5, interval: 1, repetitions: 0, nextReview: Date.now() };
    if (quality >= 3) {
      if (c.repetitions === 0) c.interval = 1;
      else if (c.repetitions === 1) c.interval = 6;
      else c.interval = Math.round(c.interval * c.ef);
      c.repetitions += 1;
    } else { c.repetitions = 0; c.interval = 1; }
    c.ef = Math.max(1.3, c.ef + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    c.nextReview = Date.now() + c.interval * 86400000;
    progress[cardId] = c;
    this.saveFlashcardProgress(progress);
    return c;
  },

  getCompletedSteps(planId) { return getJSON(`studyai_completed_tasks_v1_${planId}`, []); },
  toggleStep(planId, stepId) {
    const s = this.getCompletedSteps(planId);
    const idx = s.indexOf(stepId);
    if (idx >= 0) s.splice(idx, 1); else s.push(stepId);
    setJSON(`studyai_completed_tasks_v1_${planId}`, s);
    return s;
  },

  getSettings() { return getJSON(KEYS.settings, { geminiApiKey: '', youtubeApiKey: '', offlineMode: false }); },
  saveSettings(s) { setJSON(KEYS.settings, s); },

  getTheme() { return localStorage.getItem(KEYS.theme) || 'light'; },
  setTheme(t) { localStorage.setItem(KEYS.theme, t); },

  exportAll() {
    const data = {};
    Object.keys(KEYS).forEach(k => { data[k] = getJSON(KEYS[k], null); });
    return JSON.stringify(data, null, 2);
  },
  importAll(json) {
    const data = JSON.parse(json);
    Object.keys(KEYS).forEach(k => { if (data[k] !== undefined) setJSON(KEYS[k], data[k]); });
  },
  clearAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    Object.keys(localStorage).filter(k => k.startsWith('studyai_completed_tasks_v1_')).forEach(k => localStorage.removeItem(k));
  },
};
window.Storage = Storage;
