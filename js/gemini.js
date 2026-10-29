'use strict';

/* =========================================
   StudyAI — Gemini API integration
   ========================================= */

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

async function callGemini(prompt, apiKey) {
  if (!apiKey) throw new Error('Chave de API do Gemini não configurada.');
  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Erro HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function searchYouTube(query, apiKey) {
  if (!apiKey) return null;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&relevanceLanguage=pt&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data.items || null;
}

async function askTutor(question, topic, history, apiKey) {
  if (!apiKey) {
    return `Olá! Para usar o Tutor IA interativo, configure sua chave de API do Gemini nas **Configurações**. Enquanto isso, posso dizer que "${question}" é uma ótima pergunta sobre **${topic}** — explore as abas de Tutor IA e Resumos para encontrar a resposta!`;
  }
  const ctx = history.slice(-6).map(m => `${m.role === 'user' ? 'Aluno' : 'Professor'}: ${m.content}`).join('\n');
  const prompt = `Você é um professor particular especialista e amigável, ensinando o tema "${topic}" a um estudante brasileiro.
Responda sempre em português do Brasil de forma clara, didática e encorajadora.
${ctx ? `\nContexto da conversa:\n${ctx}\n` : ''}
Aluno: ${question}
Professor:`;
  return await callGemini(prompt, apiKey);
}

async function generateAIStudy(topic, level, goal, apiKey) {
  if (!apiKey) return null;
  const prompt = `Crie um guia de estudos detalhado sobre "${topic}" para um estudante brasileiro de nível ${level || 'iniciante'} com objetivo de ${goal || 'aprender'}.
Responda em português do Brasil no formato JSON com esta estrutura:
{
  "explanation_beginner": "...",
  "explanation_advanced": "...",
  "key_concepts": [{"label":"...","content":"..."}],
  "analogy": "...",
  "common_mistakes": ["..."],
  "comprehension_questions": [{"q":"...","a":"..."}]
}`;
  try {
    const text = await callGemini(prompt, apiKey);
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch {}
  return null;
}

window.GeminiAPI = { callGemini, searchYouTube, askTutor, generateAIStudy };
