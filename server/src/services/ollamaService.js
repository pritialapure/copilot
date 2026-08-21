import axios from "axios";
import { env } from "../config/env.js";

const client = axios.create({
  baseURL: env.ollamaBaseUrl,
  timeout: 8000
});

export async function generateLocalText(prompt) {
  // TODO: POST the prompt to /api/generate with env.ollamaChatModel and return the trimmed
  // TODO: response, or "" when the local model is unavailable.
  return "";
}

export async function generateEmbedding(text) {
  // TODO: POST the text to /api/embeddings with env.ollamaEmbedModel and return the vector,
  // TODO: or [] when the local model is unavailable.
  return [];
}
