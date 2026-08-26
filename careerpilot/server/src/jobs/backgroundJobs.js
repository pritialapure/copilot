import { discoverInternships } from "../agents/discoveryAgent.js";
import { scoreInternship } from "../agents/matchingAgent.js";
import { env } from "../config/env.js";
import { create, getAll, getOne, upsert } from "../services/repository.js";

let queue;

export function startQueues() {
  // Redis is optional. The app remains fully usable without a queue.
  return null;
}

async function syncInternshipsJob() {
  const internships = await discoverInternships({ skills: [], preferences: { roles: [] } });
  await Promise.all(internships.map((internship) => upsert("internships", { title: internship.title, company: internship.company }, internship, internship)));
}

async function recalculateMatchesJob() {
  const [profiles, internships] = await Promise.all([getAll("profiles"), getAll("internships")]);
  await Promise.all(profiles.flatMap((profile) => internships.map(async (internship) => {
    const match = await scoreInternship(profile, internship);
    await upsert("matches", { userId: profile.userId, internshipId: internship._id }, { userId: profile.userId, internshipId: internship._id, ...match }, match);
  })));
}

async function notifyUsersJob() {
  const now = Date.now();
  const [internships, applications] = await Promise.all([getAll("internships"), getAll("applications")]);
  for (const application of applications) {
    if (application.status !== "APPLIED" || now - new Date(application.appliedAt || application.updatedAt).getTime() < 7 * 86400000) continue;
    const internship = internships.find((item) => item._id === application.internshipId);
    const message = `Follow up on ${internship?.title || "this application"}.`;
    if (!await getOne("notifications", { userId: application.userId, message })) await create("notifications", { userId: application.userId, title: "Follow-up reminder", message });
  }
}

export function startCronJobs() {
  setInterval(() => syncInternshipsJob().catch(console.error), 6 * 60 * 60 * 1000).unref();
  setInterval(() => recalculateMatchesJob().catch(console.error), 24 * 60 * 60 * 1000).unref();
  setInterval(() => notifyUsersJob().catch(console.error), 60 * 60 * 1000).unref();
}

export async function runStartupJobs() {
  await Promise.allSettled([syncInternshipsJob(), recalculateMatchesJob(), notifyUsersJob()]);
}
