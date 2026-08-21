import mongoose from "mongoose";

// TODO: Define the fields: title, company, description, skillsRequired, location,
// TODO: applyLink, source, deadline, postedDate, embedding.
// TODO: Add the unique compound index on company + title + applyLink.
const internshipSchema = new mongoose.Schema({}, { timestamps: true });

export const Internship = mongoose.model("Internship", internshipSchema);
