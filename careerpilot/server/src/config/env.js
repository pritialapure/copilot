import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  clientUrls: (process.env.CLIENT_URLS || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
  mongodbUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "careerpilot-local-development-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  ollamaChatModel: process.env.OLLAMA_CHAT_MODEL || "llama3.1:8b",
  ollamaEmbedModel: process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text",
  redisUrl: process.env.UPSTASH_REDIS_URL || "",
  seedSampleData: process.env.SEED_SAMPLE_DATA === "true",
  nodeEnv: process.env.NODE_ENV || "development"
};
