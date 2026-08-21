import mongoose from "mongoose";

// TODO: Define the fields: userId, title, message, read.
const notificationSchema = new mongoose.Schema({}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);
