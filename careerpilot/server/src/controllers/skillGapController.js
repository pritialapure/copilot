import { getOne } from '../services/repository.js';
import { buildSkillGapReport } from '../agents/skillGapAgent.js';
import { httpError } from '../utils/httpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getSkillGap = asyncHandler(async (req, res) => {
  const { internshipId } = req.params;

  const match = await getOne('matches', { userId: req.userId, internshipId });
  if (!match) {
    throw httpError(404, 'No match found for this internship');
  }

  const report = await buildSkillGapReport(match);
  res.json({ skillGap: report });
});

export default { getSkillGap };
