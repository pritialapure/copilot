import { APPLICATION_STATUSES } from "../models/Application.js";
import { create, deleteById, getAll, getById, getOne, updateById } from "../services/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

// TODO: Rank the statuses so an application can only move forward.
const STATUS_RANK = {};

// TODO: Define the title and message for each milestone that raises a notification
// TODO: (APPLIED, INTERVIEW, OFFER, REJECTED). SAVED and PREPARING are excluded.
const STATUS_NOTIFICATION = {};

async function notifyStatusChange(userId, internshipId, status) {
  // TODO: Create the milestone notification with the internship label.
}

async function enrichApplications(userId) {
  // TODO: Return the user's applications, each joined to its internship.
  return [];
}

async function enrichApplication(application) {
  // TODO: Join the single application to its internship.
  return null;
}

export const createApplication = asyncHandler(async (req, res) => {
  // TODO: Validate internshipId and the status, and when the application already exists
  // TODO: only move it forward (stamping appliedAt on APPLIED) and notify on change.
  // TODO: Otherwise create it, raise the "Application saved" notification, and return 201.
  res.status(501).json({ message: "Create application is not implemented yet." });
});

export const getApplications = asyncHandler(async (req, res) => {
  // TODO: Respond with { applications } enriched with their internships.
  res.status(501).json({ message: "List applications is not implemented yet." });
});

export const updateApplication = asyncHandler(async (req, res) => {
  // TODO: Verify ownership, validate the new status, stamp appliedAt, apply the notes and
  // TODO: nextActionDate, and notify when the status changed.
  res.status(501).json({ message: "Update application is not implemented yet." });
});

export const deleteApplication = asyncHandler(async (req, res) => {
  // TODO: Verify ownership, delete the application, and respond with { success, id }.
  res.status(501).json({ message: "Delete application is not implemented yet." });
});
