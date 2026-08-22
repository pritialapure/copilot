import mongoose from "mongoose";

// TODO: Define the fields: userId, internshipId, score, matchedSkills, missingSkills,
// TODO: reason. Add the unique compound index on userId + internshipId.
const matchSchema = new mongoose.Schema({}, { timestamps: true });

export const Match = mongoose.model("Match", matchSchema);
