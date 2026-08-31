import express from 'express';
import { ingestInternships, listIngestedInternships } from '../controllers/ingestController.js';
import { ingestAuth } from '../middleware/ingestAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// Shared-secret protected, NOT JWT-protected: your automation workflow calls
// this directly, it isn't a logged-in browser session.
router.use(asyncHandler(ingestAuth));

// POST body: a single internship object, an array of them, or { internships: [...] }
// Required fields per item: title, company, applyLink.
// Recommended: include sourceMessageId (the Gmail message id) so re-runs never duplicate.
router.post('/internships', asyncHandler(ingestInternships));

// Convenience GET so you can sanity-check what's landed from the workflow so far.
router.get('/internships', asyncHandler(listIngestedInternships));

export default router;
