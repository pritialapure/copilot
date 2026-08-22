import mongoose from "mongoose";
import { env } from "./env.js";

export const dbState = {
  mode: "memory",
  connected: false
};

export async function connectDatabase() {
  // TODO: Keep memory mode when MONGODB_URI is empty, otherwise connect with mongoose,
  // TODO: flip dbState to "mongo", and fall back to memory storage when the connect fails.
  console.warn("connectDatabase is not implemented yet - using the in-memory store");
  return dbState;
}
