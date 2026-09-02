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

import ingestRoutes from './routes/ingestRoutes.js';

const app = express();

// ================================
// CORS CONFIGURATION
// ================================

const allowedOrigins = [
  env.CLIENT_URL,
  ...(env.CLIENT_URLS || []),

  // Local development
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin
      if (!origin) {
        return callback(null, true);
      }

      // Allow configured origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow private/local network IPs on Vite ports
      const localNetworkRegex =
        /^http:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+):(5173|5174)$/;

      if (localNetworkRegex.test(origin)) {
        return callback(null, true);
      }

      console.log('CORS blocked:', origin);

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },

    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

// ================================
// HEALTH CHECK
// ================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CareerPilot AI API',
    aiRuntime: 'Ollama local inference',
    autoApplyEnabled: false,
  });
});

// ================================
// ROUTES
// ================================

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/skill-gap', skillGapRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/application-materials', applicationMaterialRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use('/api/ingest', ingestRoutes);

// ================================
// 404 HANDLER
// ================================

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// ================================
// ERROR HANDLER
// ================================

app.use(errorHandler);

export default app;