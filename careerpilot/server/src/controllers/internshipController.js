import { getAll, getOne, create } from '../services/repository.js';
import { syncInternshipsForProfile } from '../services/pipelineService.js';
import { httpError } from '../utils/httpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getInternships = asyncHandler(async (req, res) => {
  const internships = await getAll('internships', {}, { postedDate: -1 });
  const matches = await getAll('matches', { userId: req.userId });

  const matchMap = new Map();
  matches.forEach(m => matchMap.set(m.internshipId.toString(), m));

  const enriched = internships.map(i => ({
    ...i,
    match: matchMap.get(i._id.toString()) || null,
  }));

  res.json({ internships: enriched });
});

export const syncInternships = asyncHandler(async (req, res) => {
  const profile = await getOne('profiles', { userId: req.userId });
  if (!profile) {
    throw httpError(400, 'Profile not found');
  }

  const result = await syncInternshipsForProfile(profile);
  const internships = await getAll('internships', {}, { postedDate: -1 });

  res.json({ count: result.count, internships });
});

export default { getInternships, syncInternships };
