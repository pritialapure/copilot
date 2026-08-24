import express from 'express';
import { getSkillGap } from '../controllers/skillGapController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(asyncHandler(authMiddleware));

router.get('/:internshipId', asyncHandler(getSkillGap));

export default router;
