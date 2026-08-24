import { connectDatabase } from './config/db.js';
import { seedInitialData } from './services/seedService.js';
import { env } from './config/env.js';
import app from './app.js';

async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    // Seed initial data
    await seedInitialData();

    // Start server
    app.listen(env.PORT, '0.0.0.0', () => {
      console.log(`
🚀 CareerPilot AI API running at http://localhost:${env.PORT}/api`);
      console.log(`📋 Health check: http://localhost:${env.PORT}/api/health`);
      console.log(`🌐 Client URL: ${env.CLIENT_URL}`);
      console.log(`🗄️  Database mode: ${env.MONGODB_URI ? 'MongoDB' : 'In-Memory'}`);
      console.log('\n');
    });
  } catch (err) {
    console.error('❌ Server startup failed:', err.message);
    process.exit(1);
  }
}

startServer();
