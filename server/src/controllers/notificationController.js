import { getAll, getById, updateById } from "../services/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

export const getNotifications = asyncHandler(async (req, res) => {
  // TODO: Respond with { notifications } for this user, newest first.
  res.status(501).json({ message: "Notification listing is not implemented yet." });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  // TODO: Verify ownership and mark the notification read.
  res.status(501).json({ message: "Marking notifications read is not implemented yet." });
});
