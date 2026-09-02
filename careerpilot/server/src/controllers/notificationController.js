import { getAll, getById, updateById } from "../services/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

export const getNotifications = asyncHandler(async (req, res) => {
  res.json({ notifications: await getAll("notifications", { userId: req.userId }, { createdAt: -1 }) });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await getById("notifications", req.params.id);
  // String comparison: in real MongoDB mode notification.userId is a Mongoose
  // ObjectId object while req.userId (from the JWT) is a plain string, so a
  // strict !== here would always be true and 404 even the rightful owner.
  if (!notification || String(notification.userId) !== String(req.userId)) throw httpError(404, "Notification not found");
  res.json({ notification: await updateById("notifications", notification._id, { read: true }) });
});
