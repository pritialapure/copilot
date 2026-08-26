import { generateResumeVariant } from "../agents/applicationPreparationAgent.js";
import { create, getAll, getById, getOne, updateById } from "../services/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";
import { textToPdf } from "../utils/pdf.js";

async function markApplicationPreparing(userId, internshipId) {
  const existing = await getOne("applications", { userId, internshipId });
  if (!existing) return create("applications", { userId, internshipId, status: "PREPARING", notes: "" });
  if (existing.status === "SAVED") return updateById("applications", existing._id, { status: "PREPARING" });
  return existing;
}

export const generateApplicationMaterial = asyncHandler(async (req, res) => {
  const { internshipId } = req.body;
  if (!internshipId) throw httpError(400, "internshipId is required");
  const [profile, internship] = await Promise.all([getOne("profiles", { userId: req.userId }), getById("internships", internshipId)]);
  if (!profile?.resumeText) throw httpError(400, "Upload a resume before tailoring it");
  if (!internship) throw httpError(404, "Internship not found");
  const variant = await generateResumeVariant(profile, internship);
  const resumeVersion = await create("resumeVersions", { userId: req.userId, internshipId, ...variant });
  await markApplicationPreparing(req.userId, internshipId);
  res.status(201).json({ resumeVersion });
});

export const approveApplicationMaterial = asyncHandler(async (req, res) => {
  const resumeVersion = await getById("resumeVersions", req.body.resumeVersionId);
  if (!resumeVersion || resumeVersion.userId !== req.userId) throw httpError(404, "Resume version not found");
  res.json({ resumeVersion: await updateById("resumeVersions", resumeVersion._id, { approved: true }) });
});

export const listApplicationMaterials = asyncHandler(async (req, res) => {
  res.json({ resumeVersions: await getAll("resumeVersions", { userId: req.userId }, { createdAt: -1 }) });
});

export const getApplicationMaterialPdf = asyncHandler(async (req, res) => {
  const resumeVersion = await getById("resumeVersions", req.params.id);
  if (!resumeVersion || resumeVersion.userId !== req.userId) throw httpError(404, "Resume version not found");
  const internship = await getById("internships", resumeVersion.internshipId);
  const slug = `${internship?.title || "resume"}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  res.set({ "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="careerpilot-${slug}.pdf"` }).send(textToPdf(resumeVersion.content));
});
