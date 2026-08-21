import { discoverInternships } from "../agents/discoveryAgent.js";
import { scoreInternship } from "../agents/matchingAgent.js";
import { getAll, getOne, upsert } from "./repository.js";

export async function syncInternshipsForProfile(profile) {
  // TODO: Discover internships for the profile and upsert each one by title + company,
  // TODO: returning everything that was saved.
  throw new Error("syncInternshipsForProfile is not implemented yet");
}

export async function regenerateMatches(userId, profile) {
  // TODO: Score every internship against the profile, upsert the match per
  // TODO: userId + internshipId, and return the matches sorted by score descending.
  throw new Error("regenerateMatches is not implemented yet");
}
