import { generateLocalText } from './ollamaService.js';

export async function scoreInternship(profile, internship) {
  if (!internship.skillsRequired || internship.skillsRequired.length === 0) {
    return {
      score: 45,
      matchedSkills: [],
      missingSkills: [],
      reason: 'No specific skills listed for this role. This is a great opportunity to learn!',
    };
  }

  const profileSkillsLower = (profile.skills || []).map(s => s.toLowerCase());
  const requiredLower = internship.skillsRequired.map(s => s.toLowerCase());

  const matchedSkills = internship.skillsRequired.filter(skill =>
    profileSkillsLower.includes(skill.toLowerCase())
  );
  const missingSkills = internship.skillsRequired.filter(
    skill => !profileSkillsLower.includes(skill.toLowerCase())
  );

  const skillScore = requiredLower.length > 0
    ? Math.round((matchedSkills.length / requiredLower.length) * 80)
    : 45;

  const titleDescLower = `${internship.title} ${internship.description}`.toLowerCase();
  const roleBoost = (profile.preferences?.roles || []).some(role =>
    titleDescLower.includes(role.toLowerCase())
  ) ? 10 : 0;

  const locationBoost = profile.preferences?.location && internship.location
    ? internship.location.toLowerCase().includes(profile.preferences.location.toLowerCase()) ? 10 : 0
    : 0;

  const score = Math.min(100, skillScore + roleBoost + locationBoost);

  // Generate reason
  let reason = '';
  if (matchedSkills.length > 0) {
    reason = `Matched ${matchedSkills.length} of ${requiredLower.length} listed skills. `;
  } else {
    reason = `No direct skill matches yet. `;
  }

  if (missingSkills.length > 0) {
    reason += `Focus on ${missingSkills.slice(0, 2).join(', ')} to strengthen your fit.`;
  } else {
    reason += `You have all the required skills!`;
  }

  return {
    score,
    matchedSkills,
    missingSkills,
    reason,
  };
}

export default { scoreInternship };
