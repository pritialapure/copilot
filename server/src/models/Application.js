import mongoose from "mongoose";

export const APPLICATION_STATUSES = ["SAVED", "PREPARING", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

// TODO: Define the fields: userId, internshipId, status (from APPLICATION_STATUSES),
// TODO: appliedAt, nextActionDate, notes.
// TODO: Add the unique compound index on userId + internshipId.
const applicationSchema = new mongoose.Schema({}, { timestamps: true });

export const Application = mongoose.model("Application", applicationSchema);
