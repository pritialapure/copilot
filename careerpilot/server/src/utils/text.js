export const knownSkills = [
  'javascript',
  'react',
  'node.js',
  'mongodb',
  'git',
  'html',
  'css',
  'python',
  'express',
  'tailwindcss',
  'typescript',
  'sql',
  'docker',
  'linux',
  'aws',
  'rest api',
  'graphql',
  'webpack',
  'jest',
  'postgresql',
  'redis',
  'communication',
  'problem solving',
  'teamwork',
  'leadership',
];

export function normalizeSkill(skill) {
  return skill.toLowerCase().trim();
}

export function uniqueStrings(arr) {
  return [...new Set(arr.map(s => (typeof s === 'string' ? s.trim() : '')).filter(Boolean))];
}

export function extractSkills(text) {
  if (!text) return [];
  const lowerText = text.toLowerCase();
  const found = knownSkills.filter(skill => lowerText.includes(skill));
  return uniqueStrings(found);
}

export function summarizeText(text, maxLength = 220) {
  if (!text) return '';
  const trimmed = text.trim().substring(0, maxLength);
  return trimmed.endsWith('.') ? trimmed : trimmed + '...';
}

export function parseListInput(input) {
  if (typeof input === 'string') {
    return input
      .split(/[,|;]/)
      .map(item => item.trim())
      .filter(Boolean);
  }
  if (Array.isArray(input)) {
    return input.map(item => String(item).trim()).filter(Boolean);
  }
  return [];
}

export function sectionLines(text, labels = []) {
  if (!text) return [];
  const lines = text.split('\n').filter(line => line.trim().length > 4);
  if (labels.length === 0) return lines.slice(0, 8);

  const result = [];
  const lowerLabels = labels.map(l => l.toLowerCase());
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lowerLabels.some(label => lower.includes(label))) {
      result.push(line.trim());
      if (result.length >= 8) break;
    }
  }
  return result;
}

export default {
  knownSkills,
  normalizeSkill,
  uniqueStrings,
  extractSkills,
  summarizeText,
  parseListInput,
  sectionLines,
};
