import { buildAnalytics } from "../agents/feedbackAgent.js";
import { getAll, getOne } from "../services/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAnalytics = asyncHandler(async (req, res) => {
  // TODO: Load the user's applications, matches, the internships, and the profile, then
  // TODO: respond with { analytics } from the feedback agent.
  res.status(501).json({ message: "Analytics is not implemented yet." });
});
