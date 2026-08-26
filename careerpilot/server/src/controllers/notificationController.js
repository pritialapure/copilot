import { getAll, getById, updateById } from "../services/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

export const getNotifications = asyncHandler(async (req, res) => {
  res.json({ notifications: await getAll("notifications", { userId: req.userId }, { createdAt: -1 }) });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await getById("notifications", req.params.id);
  if (!notification || notification.userId !== req.userId) throw httpError(404, "Notification not found");
  res.json({ notification: await updateById("notifications", notification._id, { read: true }) });
});
