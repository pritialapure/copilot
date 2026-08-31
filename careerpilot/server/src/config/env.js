import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  CLIENT_URLS: (process.env.CLIENT_URLS || '')
    .split(',')
    .map(url => url.trim())
    .filter(Boolean),
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'careerpilot-local-development-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  OLLAMA_CHAT_MODEL: process.env.OLLAMA_CHAT_MODEL || 'llama3.1:8b',
  OLLAMA_EMBED_MODEL: process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text',
  UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL || '',
  SEED_SAMPLE_DATA: process.env.SEED_SAMPLE_DATA === 'true',
  ENABLE_LIVE_DISCOVERY: process.env.ENABLE_LIVE_DISCOVERY !== 'false',
  NODE_ENV: process.env.NODE_ENV || 'development',
  // Shared secret your automation workflow (n8n/Zapier/Make) sends as the
  // x-ingest-key header when POSTing verified opportunities to /api/ingest/internships.
  INGEST_API_KEY: process.env.INGEST_API_KEY || '',
};

export default env;
