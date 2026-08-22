import { buildSkillGapReport } from "../agents/skillGapAgent.js";
import { getOne } from "../services/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

export const getSkillGap = asyncHandler(async (req, res) => {
  // TODO: Load the user's match for req.params.internshipId (404 when missing) and respond
  // TODO: with { skillGap }.
  res.status(501).json({ message: "Skill gap report is not implemented yet." });
});
