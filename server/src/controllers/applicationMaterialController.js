import { generateResumeVariant } from "../agents/applicationPreparationAgent.js";
import { create, getAll, getById, getOne, updateById } from "../services/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";
import { textToPdf } from "../utils/pdf.js";

async function markApplicationPreparing(userId, internshipId) {
  // TODO: Create the application in PREPARING, or raise an earlier status up to PREPARING.
}

export const generateApplicationMaterial = asyncHandler(async (req, res) => {
  // TODO: Require internshipId plus an uploaded resume, generate the tailored variant,
  // TODO: save the resume version, mark the application PREPARING, and respond with 201.
  res.status(501).json({ message: "Material generation is not implemented yet." });
});

export const approveApplicationMaterial = asyncHandler(async (req, res) => {
  // TODO: Verify ownership of resumeVersionId and flip approved to true.
  res.status(501).json({ message: "Material approval is not implemented yet." });
});

export const listApplicationMaterials = asyncHandler(async (req, res) => {
  // TODO: Respond with { resumeVersions } for this user, newest first.
  res.status(501).json({ message: "Material listing is not implemented yet." });
});

export const getApplicationMaterialPdf = asyncHandler(async (req, res) => {
  // TODO: Verify ownership, render the stored resume text with textToPdf, and stream it
  // TODO: inline as careerpilot-<internship-title>.pdf.
  res.status(501).json({ message: "Material PDF is not implemented yet." });
});
