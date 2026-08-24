import express from 'express';
import { generateMatches, getMatches } from '../controllers/matchController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(asyncHandler(authMiddleware));

router.post('/generate', asyncHandler(generateMatches));
router.get('/', asyncHandler(getMatches));

export default router;
