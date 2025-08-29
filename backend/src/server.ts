import app from './app';
import { sequelize } from './models';
import config from './config/config';
import logger from './utils/logger';

const PORT = config.port;

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // Sync database (in development only)
    // if (config.nodeEnv === 'development') {
    //   await sequelize.sync({ alter: true });
    //   logger.info('Database synchronized successfully');
    // }

    // Start the server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`🌐 Environment: ${config.nodeEnv}`);
      logger.info(`📊 Database: ${config.database.name}@${config.database.host}:${config.database.port}`);
      
      if (config.nodeEnv === 'development') {
        logger.info(`🔗 API Documentation: http://localhost:${PORT}/api`);
        logger.info(`❤️  Health Check: http://localhost:${PORT}/api/health`);
      }
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
  process.exit(1);
});

startServer();