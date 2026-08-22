import { getById } from "../services/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";
import { verifyToken } from "../utils/jwt.js";

export const requireAuth = asyncHandler(async (req, _res, next) => {
  // TODO: Read the Bearer token, reject with 401 when it is missing or invalid, verify it,
  // TODO: load the user, and set req.user to { _id, name, email }.
  next();
});
