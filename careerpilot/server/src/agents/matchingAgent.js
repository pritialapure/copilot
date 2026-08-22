import { generateLocalText } from "../services/ollamaService.js";
import { uniqueStrings } from "../utils/text.js";

export async function scoreInternship(profile, internship) {
  // TODO: Compare the profile skills with skillsRequired, score the skill overlap out of
  // TODO: 80, add the role and location boosts, cap at 100, and ask the local model for a
  // TODO: two sentence reason (with a deterministic fallback). Return score, matchedSkills,
  // TODO: missingSkills, and reason.
  throw new Error("scoreInternship is not implemented yet");
}
