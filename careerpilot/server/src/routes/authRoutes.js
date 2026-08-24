import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/me', asyncHandler(authMiddleware), asyncHandler(getCurrentUser));

export default router;
