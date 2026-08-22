import mongoose from "mongoose";

// A point-in-time snapshot of a previously uploaded resume and the results it produced.
// TODO: Define the fields: userId, label, skills, summary, topMatches (title, company,
// TODO: score), matchCount, highMatchCount, resumeVersionCount, supersededAt.
const resumeHistorySchema = new mongoose.Schema({}, { timestamps: true });

export const ResumeHistory = mongoose.model("ResumeHistory", resumeHistorySchema);
