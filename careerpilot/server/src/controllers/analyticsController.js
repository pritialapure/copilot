import { buildAnalytics } from "../agents/feedbackAgent.js";
import { getAll, getOne } from "../services/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAnalytics = asyncHandler(async (req, res) => {
  const [applications, matches, internships, profile] = await Promise.all([
    getAll("applications", { userId: req.userId }), getAll("matches", { userId: req.userId }),
    getAll("internships"), getOne("profiles", { userId: req.userId })
  ]);
  res.json({ analytics: buildAnalytics({ applications, matches, internships, profile }) });
});
