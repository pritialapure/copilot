import mongoose from "mongoose";

// TODO: Define the fields: name, email (unique, lowercase), password.
const userSchema = new mongoose.Schema({}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
