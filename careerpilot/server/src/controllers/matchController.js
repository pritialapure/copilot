import { getAll, getOne, create } from '../services/repository.js';
import { regenerateMatches } from '../services/pipelineService.js';
import { httpError } from '../utils/httpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const generateMatches = asyncHandler(async (req, res) => {
  const profile = await getOne('profiles', { userId: req.userId });
  if (!profile) {
    throw httpError(400, 'Profile not found');
  }

  if (!profile.resumeText) {
    throw httpError(400, 'Profile must have resume text to generate matches');
  }

  const matches = await regenerateMatches(req.userId, profile);

  res.json({ matches });
});

export const getMatches = asyncHandler(async (req, res) => {
  const matches = await getAll('matches', { userId: req.userId }, { score: -1 });
  const internshipIds = matches.map(m => m.internshipId);

  // Enrich with internship data
  const enriched = [];
  for (const match of matches) {
    const internship = await getOne('internships', { _id: match.internshipId });
    enriched.push({ ...match, internship });
  }

  res.json({ matches: enriched });
});

export default { generateMatches, getMatches };
