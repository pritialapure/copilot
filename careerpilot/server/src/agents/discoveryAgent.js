import { seedInternships } from '../data/seedInternships.js';
import { internshipCatalog } from '../data/internshipCatalog.js';
import { extractSkills } from '../utils/text.js';
import { generateEmbedding } from '../services/ollamaService.js';
import { env } from '../config/env.js';

export async function fetchLiveInternships(profile) {
  if (!env.ENABLE_LIVE_DISCOVERY) return [];

  try {
    const term =
      profile.preferences?.roles?.[0] ||
      profile.skills?.[0] ||
      'developer';

    const searchUrl = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(term)}&limit=40`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(searchUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) return [];

    const data = await response.json();
    const jobs = data.jobs || [];

    const liveInternships = jobs
      .filter(job => {
        const title = (job.title || '').toLowerCase();
        return /intern|graduate|trainee|junior|entry-level|apprentice/i.test(title);
      })
      .map(job => ({
        title: job.title || '',
        company: job.company_name || '',
        description: (job.description || '').replace(/<[^>]*>/g, ''),
        skillsRequired: extractSkills((job.title + ' ' + job.description).toLowerCase()),
        location: job.job_type === 'remote' ? 'Remote' : job.location || '',
        applyLink: job.url || '',
        source: 'Remotive (live)',
        deadline: null,
        postedDate: new Date(),
        embedding: [],
      }))
      .filter(job => job.applyLink && job.title && job.company);

    return liveInternships.slice(0, 40);
  } catch (err) {
    console.warn('⚠️  Live internship fetch failed, falling back to catalog:', err.message);
    return [];
  }
}

export async function discoverInternships(profile) {
  const hasSignal = (profile.skills && profile.skills.length > 0) ||
    (profile.preferences?.roles && profile.preferences.roles.length > 0);

  if (!hasSignal) {
    return seedInternships;
  }

  // Fetch live internships (best-effort)
  const live = await fetchLiveInternships(profile);

  // Pool: dedupe catalog + live by title::company
  // Use the full catalog (seedInternships + additional roles) so Sync can surface
  // internships beyond the original fixed 5 as the resume/preferences change.
  const poolMap = new Map();
  for (const internship of internshipCatalog) {
    const key = `${internship.title}::${internship.company}`;
    poolMap.set(key, internship);
  }
  for (const internship of live) {
    const key = `${internship.title}::${internship.company}`;
    if (!poolMap.has(key)) {
      poolMap.set(key, internship);
    }
  }

  // Score by relevance
  const profileSkillsLower = (profile.skills || []).map(s => s.toLowerCase());
  const rolesLower = (profile.preferences?.roles || []).map(r => r.toLowerCase());
  const locationLower = (profile.preferences?.location || '').toLowerCase();

  const scored = Array.from(poolMap.values())
    .map(internship => {
      const titleDescLower = `${internship.title} ${internship.description}`.toLowerCase();
      const skillOverlap = (internship.skillsRequired || []).filter(skill =>
        profileSkillsLower.includes(skill.toLowerCase())
      ).length;
      const skillScore = skillOverlap * 2;
      const roleBoost = rolesLower.some(role => titleDescLower.includes(role)) ? 2 : 0;
      const locationBoost = locationLower && internship.location
        ? internship.location.toLowerCase().includes(locationLower) ? 1 : 0
        : 0;
      const relevanceScore = skillScore + roleBoost + locationBoost;

      return { ...internship, relevanceScore };
    })
    .filter(i => i.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 10);

  return scored.length > 0 ? scored : seedInternships;
}

export default { discoverInternships, fetchLiveInternships };
