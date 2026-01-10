// utils/aiMock.js
// Lightweight client-side mock 'AI' utilities for playground demo.
// These are deterministic, safe, and require no backend.

export function mockChatReply(message, context = []) {
  const lower = message.toLowerCase();
  if (lower.includes('top react')) return 'My top React project is "Interactive Dashboard" — built with Next.js, Tailwind, and Chart.js. It demonstrates data viz and live updates.';
  if (lower.includes('api project')) return 'API Project: RESTful Express server with file-backed db.json. It has endpoints for projects, site-settings, and a simple auth cookie flow.';
  if (lower.includes('explain')) return 'Step-by-step: 1) Define routes 2) Validate input 3) Update db.json atomically 4) Return updated object with 200';
  if (lower.includes('help')) return 'You can ask: "Show me your top React project", "Explain your API project step by step", or ask for a summary of a project name.';
  // fallback: summarize roughly
  return `I heard: "${message}" — try asking for "top React project" or "explain API project".`;
}

export function improvePrompt(prompt) {
  // Simple heuristic improvements
  let improved = prompt.trim();
  if (!improved) return { before: prompt, after: prompt, note: 'Empty prompt' };
  // Add specificity for UI design prompts
  if (/ui|design/i.test(improved) && !/30 seconds/i.test(improved)) {
    improved += ' — produce a clean modern UI layout, dark/light variants, include spacing and color tokens. Limit to 30 seconds of reasoning.';
  }
  // normalize style
  improved = improved.replace(/please/ig, '').trim();
  return { before: prompt, after: improved, note: 'Added specificity and concise instruction' };
}

export function generateMockImage(prompt) {
  // Return a placeholder data object representing a generated image result
  return {
    url: `https://via.placeholder.com/512x320.png?text=${encodeURIComponent(prompt.slice(0,30))}`,
    prompt,
    meta: { model: 'mock-image-v1', time: new Date().toISOString() }
  };
}

export function suggestLearningPath(skills) {
  // skills: { coding: 3, ai: 2, design: 1 }
  const path = [];
  if (skills.ai <= 2) {
    path.push('Intro to ML concepts (linear models, overfitting) — 1 week');
    path.push('Hands-on: fine-tune a small model using an online tutorial — 1 week');
  } else {
    path.push('Build an end-to-end LLM app (prompt engineering, evals) — 2 weeks');
  }
  if (skills.coding <=2) path.unshift('Brush up JS fundamentals: async, fetch, modules — 1 week');
  if (skills.design <=2) path.push('Design basics: spacing, color, accessibility — 1 week');
  return path;
}

export default { mockChatReply, improvePrompt, generateMockImage, suggestLearningPath };
