import { dbState } from "../config/db.js";
import { env } from "../config/env.js";
import { seedInternships } from "../data/seedInternships.js";
import { seedDemoUser } from "./memoryStore.js";
import { upsert } from "./repository.js";

export async function seedInitialData() {
  // TODO: In mongo mode, upsert the seed internships only when env.seedSampleData is on.
  // TODO: In memory mode, always seed the demo user and the seed internships.
  console.warn("seedInitialData is not implemented yet");
}
