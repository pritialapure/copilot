import { Router } from "express";
import { getInternships, syncInternships } from "../controllers/internshipController.js";
import { requireAuth } from "../middleware/auth.js";

export const internshipRoutes = Router();

internshipRoutes.use(requireAuth);
internshipRoutes.get("/", getInternships);
internshipRoutes.post("/sync", syncInternships);
