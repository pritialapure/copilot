import express from 'express';
import { getInternships, syncInternships } from '../controllers/internshipController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(asyncHandler(authMiddleware));

router.get('/', asyncHandler(getInternships));
router.post('/sync', asyncHandler(syncInternships));

export default router;
