import { normalizeSkill, uniqueStrings } from "../utils/text.js";

const SKILL_CASING = { javascript: "JavaScript", typescript: "TypeScript", "node.js": "Node.js", react: "React", mongodb: "MongoDB", html: "HTML", css: "CSS", sql: "SQL", python: "Python", git: "Git", aws: "AWS", api: "API", "machine learning": "Machine Learning", tailwind: "Tailwind" };

function prettySkill(skill) {
  const value = normalizeSkill(skill);
  return SKILL_CASING[value] || value.replace(/\b\w/g, (char) => char.toUpperCase());
}

function splitSkillTokens(text) {
  return String(text).split(/[,|/;•·]+/).map((item) => item.trim()).filter(Boolean);
}

const SKILLS_HEADER = /^\s*(?:technical\s+)?skills?\s*:?[ \t]*(.*)$/i;

const OTHER_HEADER = /^\s*(?:experience|education|projects?|certifications?|achievements?|summary|objective|languages?)\s*:?[ \t]*$/i;

function tailorSkillTokens(originalTokens, requiredSkills, matchedSkills) {
  const desired = new Set([...requiredSkills, ...matchedSkills].map(normalizeSkill));
  return [...originalTokens].sort((a, b) => Number(desired.has(normalizeSkill(b))) - Number(desired.has(normalizeSkill(a))));
}

export async function generateResumeVariant(profile, internship) {
  const lines = String(profile.resumeText || "").replace(/\r/g, "").split("\n");
  const candidateSkills = uniqueStrings(profile.skills || []);
  const requiredSkills = uniqueStrings(internship.skillsRequired || []);
  const matchedSkills = requiredSkills.filter((skill) => candidateSkills.map(normalizeSkill).includes(normalizeSkill(skill)));
  const missingSkills = requiredSkills.filter((skill) => !candidateSkills.map(normalizeSkill).includes(normalizeSkill(skill)));
  const index = lines.findIndex((line) => SKILLS_HEADER.test(line));
  let content;
  if (index >= 0) {
    const match = lines[index].match(SKILLS_HEADER);
    let end = index + 1;
    let raw = match[1] || "";
    while (end < lines.length && !OTHER_HEADER.test(lines[end])) { raw += `, ${lines[end]}`; end += 1; }
    const tokens = splitSkillTokens(raw);
    const reordered = tailorSkillTokens(tokens.length ? tokens : candidateSkills, requiredSkills, matchedSkills).map(prettySkill);
    content = [...lines.slice(0, index), `Skills: ${reordered.join(", ")}`, ...lines.slice(end)].join("\n");
  } else {
    const ordered = tailorSkillTokens(candidateSkills, requiredSkills, matchedSkills).map(prettySkill);
    content = [`Skills: ${ordered.join(", ")}`, "", ...lines].join("\n");
  }
  return { content, changeSummary: matchedSkills.length ? [`Prioritized ${matchedSkills.map(prettySkill).join(", ")} for this role.`] : ["Retained your skills without adding unverified experience."], matchedSkills, missingSkills, approved: false };
}
