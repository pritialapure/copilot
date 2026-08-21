export const knownSkills = [
  "javascript",
  "react",
  "node.js",
  "express",
  "mongodb",
  "mongoose",
  "python",
  "sql",
  "html",
  "css",
  "tailwind",
  "git",
  "docker",
  "aws",
  "data analysis",
  "machine learning",
  "nlp",
  "api",
  "rest",
  "testing",
  "figma",
  "ui",
  "ux",
  "communication",
  "problem solving"
];

export function normalizeSkill(skill) {
  // TODO: Trim and lowercase the skill.
  return String(skill || "");
}

export function uniqueStrings(values) {
  // TODO: Normalize, drop empties, and de-duplicate the values.
  return [];
}

export function extractSkills(text = "") {
  // TODO: Return the knownSkills that appear in the text.
  return [];
}

export function summarizeText(text = "", maxLength = 220) {
  // TODO: Collapse the whitespace and truncate to maxLength with an ellipsis.
  return "";
}

export function parseListInput(value) {
  // TODO: Accept an array or a comma separated string and return unique normalized values.
  return [];
}
