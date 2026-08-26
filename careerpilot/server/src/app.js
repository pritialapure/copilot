import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import skillGapRoutes from './routes/skillGapRoutes.js';
import { applicationRoutes } from './routes/applicationRoutes.js';
import { applicationMaterialRoutes } from './routes/applicationMaterialRoutes.js';
import { notificationRoutes } from './routes/notificationRoutes.js';
import { analyticsRoutes } from './routes/analyticsRoutes.js';

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow no-origin requests (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Allow configured origins
    if (env.CLIENT_URLS.includes(origin)) {
      return callback(null, true);
    }

    // Allow CLIENT_URL
    if (origin === env.CLIENT_URL) {
      return callback(null, true);
    }

    // In development, allow localhost and private networks
    if (env.NODE_ENV === 'development') {
      const localhostRegex = /^http:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+):\d+$/;
      if (localhostRegex.test(origin)) {
        return callback(null, true);
      }
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CareerPilot AI API',
    aiRuntime: 'Ollama local inference',
    autoApplyEnabled: false,
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/skill-gap', skillGapRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/application-materials', applicationMaterialRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
