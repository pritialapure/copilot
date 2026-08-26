import { APPLICATION_STATUSES } from "../models/Application.js";
import { create, deleteById, getAll, getById, getOne, updateById } from "../services/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

const STATUS_RANK = { SAVED: 0, PREPARING: 1, APPLIED: 2, INTERVIEW: 3, OFFER: 4, REJECTED: 4 };

const STATUS_NOTIFICATION = {
  APPLIED: ["Application submitted", "was marked as applied."],
  INTERVIEW: ["Interview stage", "moved to Interview. Prepare your talking points."],
  OFFER: ["Offer received", "resulted in an offer."],
  REJECTED: ["Application closed", "was marked rejected. Capture the learnings and keep going."]
};

async function notifyStatusChange(userId, internshipId, status) {
  const message = STATUS_NOTIFICATION[status];
  if (!message) return;
  const internship = await getById("internships", internshipId);
  if (!internship) return;
  const label = `${internship.title} at ${internship.company}`;
  await create("notifications", { userId, title: message[0], message: `${label} ${message[1]}` });
}

async function enrichApplications(userId) {
  const applications = await getAll("applications", { userId }, { createdAt: -1 });
  return Promise.all(applications.map(enrichApplication));
}

async function enrichApplication(application) {
  return { ...application, internship: await getById("internships", application.internshipId) };
}

export const createApplication = asyncHandler(async (req, res) => {
  const { internshipId, status = "SAVED", nextActionDate, notes = "" } = req.body;
  if (!internshipId || !APPLICATION_STATUSES.includes(status)) throw httpError(400, "A valid internship and status are required");
  if (!await getById("internships", internshipId)) throw httpError(404, "Internship not found");
  const existing = await getOne("applications", { userId: req.userId, internshipId });
  if (existing) {
    const shouldProgress = STATUS_RANK[status] > STATUS_RANK[existing.status];
    const data = shouldProgress ? { status, ...(status === "APPLIED" && !existing.appliedAt ? { appliedAt: new Date() } : {}) } : {};
    const application = Object.keys(data).length ? await updateById("applications", existing._id, data) : existing;
    if (shouldProgress) await notifyStatusChange(req.userId, internshipId, status);
    return res.json({ application: await enrichApplication(application) });
  }
  const application = await create("applications", { userId: req.userId, internshipId, status, nextActionDate: nextActionDate || undefined, notes, ...(status === "APPLIED" ? { appliedAt: new Date() } : {}) });
  await create("notifications", { userId: req.userId, title: "Application saved", message: "An opportunity was added to your tracker." });
  if (STATUS_NOTIFICATION[status]) await notifyStatusChange(req.userId, internshipId, status);
  res.status(201).json({ application: await enrichApplication(application) });
});

export const getApplications = asyncHandler(async (req, res) => {
  res.json({ applications: await enrichApplications(req.userId) });
});

export const updateApplication = asyncHandler(async (req, res) => {
  const application = await getById("applications", req.params.id);
  if (!application || application.userId !== req.userId) throw httpError(404, "Application not found");
  const { status, nextActionDate, notes } = req.body;
  if (status && !APPLICATION_STATUSES.includes(status)) throw httpError(400, "Invalid application status");
  const data = {};
  if (typeof notes === "string") data.notes = notes;
  if (nextActionDate !== undefined) data.nextActionDate = nextActionDate || null;
  if (status && status !== application.status) { data.status = status; if (status === "APPLIED" && !application.appliedAt) data.appliedAt = new Date(); }
  const updated = await updateById("applications", application._id, data);
  if (status && status !== application.status) await notifyStatusChange(req.userId, application.internshipId, status);
  res.json({ application: await enrichApplication(updated) });
});

export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await getById("applications", req.params.id);
  if (!application || application.userId !== req.userId) throw httpError(404, "Application not found");
  await deleteById("applications", application._id);
  res.json({ success: true, id: application._id });
});
