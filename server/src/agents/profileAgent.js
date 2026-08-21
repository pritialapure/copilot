import pdfParse from "pdf-parse";
import { generateEmbedding, generateLocalText } from "../services/ollamaService.js";
import { extractSkills, summarizeText } from "../utils/text.js";

function sectionLines(text, labels) {
  // TODO: Return up to eight resume lines that mention any of the labels.
  return [];
}

export async function parseResume(buffer) {
  // TODO: Extract the PDF text, then return resumeText, the detected skills, the project,
  // TODO: experience and education lines, a local-model summary (falling back to a
  // TODO: truncated summary), and the resume embedding.
  throw new Error("parseResume is not implemented yet");
}
