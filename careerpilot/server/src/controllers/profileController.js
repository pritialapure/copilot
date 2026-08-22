import { parseResume } from "../agents/profileAgent.js";
import { create, deleteWhere, getAll, getOne, upsert } from "../services/repository.js";
import { syncInternshipsForProfile } from "../services/pipelineService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";
import { parseListInput } from "../utils/text.js";

export const getProfile = asyncHandler(async (req, res) => {
  // TODO: Respond with { profile } for the signed-in user.
  res.status(501).json({ message: "Get profile is not implemented yet." });
});

async function archivePreviousResume(userId, previousProfile) {
  // TODO: Snapshot the outgoing resume into resumeHistory (label, skills, summary, the top
  // TODO: three matches, the match / high-match / resume-version counts, supersededAt).
}

export const uploadResume = asyncHandler(async (req, res) => {
  // TODO: Require the PDF, parse it, and reject with 422 when no usable text was extracted
  // TODO: so the existing resume stays intact. Then archive the previous resume, REPLACE
  // TODO: the profile with the parsed data, clear the stale matches and resume versions,
  // TODO: best-effort re-sync discovery, and respond with { profile, summary, pipelineReset }.
  res.status(501).json({ message: "Resume upload is not implemented yet." });
});

export const getResumeHistory = asyncHandler(async (req, res) => {
  // TODO: Respond with { history }, newest first.
  res.status(501).json({ message: "Resume history is not implemented yet." });
});

export const updatePreferences = asyncHandler(async (req, res) => {
  // TODO: Parse the roles list plus location, workMode, and stipendRange, then upsert the
  // TODO: preferences onto the profile.
  res.status(501).json({ message: "Preference update is not implemented yet." });
});
