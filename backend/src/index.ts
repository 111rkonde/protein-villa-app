import app from './app';
import { ENV } from './config/env';
import prisma from './config/db';

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Connected to database successfully');

    app.listen(ENV.PORT, () => {
      console.log(`🚀 Protein Villa Backend Server running on http://localhost:${ENV.PORT}`);
      console.log(`📡 Environment: ${ENV.NODE_ENV}`);
      console.log(`🩺 Health check: http://localhost:${ENV.PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
