import mongoose from "mongoose";

// TODO: Define the fields: userId (unique), skills, projects, experience, education,
// TODO: preferences (roles, location, workMode, stipendRange), resumeText, embedding.
const profileSchema = new mongoose.Schema({}, { timestamps: true });

export const Profile = mongoose.model("Profile", profileSchema);
