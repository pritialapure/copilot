import mongoose from 'mongoose';
import { env } from './env.js';

export const dbState = {
  mode: 'memory', // 'memory' or 'mongo'
  connected: false,
};

export async function connectDatabase() {
  if (env.MONGODB_URI) {
    try {
      await mongoose.connect(env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      dbState.mode = 'mongo';
      dbState.connected = true;
      console.log('✅ MongoDB connected');
    } catch (err) {
      console.error('❌ MongoDB connection failed:', err.message);
      console.log('⚠️  Falling back to in-memory storage');
      dbState.mode = 'memory';
      dbState.connected = false;
    }
  } else {
    console.log('⚠️  MONGODB_URI not set; using in-memory storage');
    dbState.mode = 'memory';
    dbState.connected = false;
  }
}

export default { connectDatabase, dbState };
