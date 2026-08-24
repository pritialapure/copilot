import axios from 'axios';
import { env } from '../config/env.js';

const ollamaClient = axios.create({
  baseURL: env.OLLAMA_BASE_URL,
  timeout: 8000,
});

export async function generateLocalText(prompt) {
  try {
    const response = await ollamaClient.post('/api/generate', {
      model: env.OLLAMA_CHAT_MODEL,
      prompt,
      stream: false,
    });
    return response.data?.response?.trim() || '';
  } catch (err) {
    console.warn('⚠️  Ollama text generation failed, using fallback:', err.message);
    return '';
  }
}

export async function generateEmbedding(text) {
  try {
    const response = await ollamaClient.post('/api/embeddings', {
      model: env.OLLAMA_EMBED_MODEL,
      prompt: text,
    });
    return response.data?.embedding || [];
  } catch (err) {
    console.warn('⚠️  Ollama embedding failed, using fallback:', err.message);
    return [];
  }
}

export default {
  generateLocalText,
  generateEmbedding,
};
