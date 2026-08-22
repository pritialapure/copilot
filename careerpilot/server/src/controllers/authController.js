import bcrypt from "bcryptjs";
import { create, getById, getOne } from "../services/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";
import { signToken } from "../utils/jwt.js";

function publicUser(user) {
  // TODO: Return only _id, name, and email.
  return null;
}

export const register = asyncHandler(async (req, res) => {
  // TODO: Require name, email, and password, reject duplicates with 409, hash the
  // TODO: password, create the user and its empty profile, and respond with 201
  // TODO: { user, profile, token }.
  res.status(501).json({ message: "Register is not implemented yet." });
});

export const login = asyncHandler(async (req, res) => {
  // TODO: Require the credentials, compare the password hash, and respond with
  // TODO: { user, token } or a 401.
  res.status(501).json({ message: "Login is not implemented yet." });
});

export const me = asyncHandler(async (req, res) => {
  // TODO: Respond with the authenticated user's public profile.
  res.status(501).json({ message: "Current user lookup is not implemented yet." });
});
