import { getAll, getOne } from "../services/repository.js";
import { regenerateMatches } from "../services/pipelineService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

export const generateMatches = asyncHandler(async (req, res) => {
  // TODO: Require a profile with a parsed resume, regenerate the matches, and respond
  // TODO: with { matches }.
  res.status(501).json({ message: "Match generation is not implemented yet." });
});

export const getMatches = asyncHandler(async (req, res) => {
  // TODO: Respond with { matches } sorted by score, each joined to its internship.
  res.status(501).json({ message: "Match listing is not implemented yet." });
});
