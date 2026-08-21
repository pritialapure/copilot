import mongoose from "mongoose";

// TODO: Define the fields: userId, internshipId, content, changeSummary, matchedSkills,
// TODO: missingSkills, approved.
const resumeVersionSchema = new mongoose.Schema({}, { timestamps: true });

export const ResumeVersion = mongoose.model("ResumeVersion", resumeVersionSchema);
