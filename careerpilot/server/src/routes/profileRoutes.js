import express from 'express';
import multer from 'multer';
import { getProfile, getResumeHistory, uploadResume, updatePreferences } from '../controllers/profileController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

// All profile routes require auth
router.use(asyncHandler(authMiddleware));

router.get('/', asyncHandler(getProfile));
router.get('/history', asyncHandler(getResumeHistory));
router.post('/upload-resume', upload.single('resume'), asyncHandler(uploadResume));
router.patch('/preferences', asyncHandler(updatePreferences));

export default router;
