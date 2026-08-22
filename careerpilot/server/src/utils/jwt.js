import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signToken(user) {
  // TODO: Sign the user id and email with env.jwtSecret and env.jwtExpiresIn.
  return "";
}

export function verifyToken(token) {
  // TODO: Verify the token against env.jwtSecret and return the payload.
  return null;
}
