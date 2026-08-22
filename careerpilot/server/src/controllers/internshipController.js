import { seedInternships } from "../data/seedInternships.js";
import { getAll, getOne, updateById } from "../services/repository.js";
import { syncInternshipsForProfile } from "../services/pipelineService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function repairDemoApplyLink(internship) {
  // TODO: Replace an example.com apply link with the real one from the seed catalog.
  return internship;
}

export const getInternships = asyncHandler(async (req, res) => {
  // TODO: Respond with { internships }, newest first, each enriched with this user's match.
  res.status(501).json({ message: "Internship listing is not implemented yet." });
});

export const syncInternships = asyncHandler(async (req, res) => {
  // TODO: Run discovery for the user's profile and respond with { count, internships }.
  res.status(501).json({ message: "Internship sync is not implemented yet." });
});
