import app from './app';
import { ENV } from './config/env';
import prisma from './config/db';

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Connected to database successfully');

    const server = app.listen(ENV.PORT, () => {
      console.log(`🚀 Protein Villa Backend Server running on http://localhost:${ENV.PORT}`);
      console.log(`📡 Environment: ${ENV.NODE_ENV}`);
      console.log(`🩺 Health check: http://localhost:${ENV.PORT}/api/health`);
    });

    // Graceful Shutdown Handlers for Containers & Production
    const handleShutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
      server.close(async () => {
        console.log('🔒 Closed remaining HTTP connections.');
        try {
          await prisma.$disconnect();
          console.log('🔌 Disconnected Prisma Database client.');
          process.exit(0);
        } catch (err) {
          console.error('Error disconnecting database:', err);
          process.exit(1);
        }
      });

      // Force shutdown after 10s timeout
      setTimeout(() => {
        console.error('⚠️ Could not close connections in time, forcefully shutting down.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
