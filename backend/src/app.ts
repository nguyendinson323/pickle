import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import corsMiddleware from './middleware/cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { extractSubdomain, loadMicrosite } from './middleware/subdomain';
import routes from './routes';
import publicRoutes from './routes/public';
import logger from './utils/logger';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// CORS middleware
app.use(corsMiddleware);

// Subdomain extraction middleware (must be early)
app.use(extractSubdomain);
app.use(loadMicrosite);

// Webhook routes (must be before general body parsing)
app.use('/api/webhooks', express.raw({ type: 'application/json' }), routes);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// API routes
app.use('/api', routes);

// Public microsite routes (for subdomain requests)
app.use('/', publicRoutes);

// Root endpoint (for main domain only)
app.get('/', (req, res, next) => {
  // If this is a subdomain request, it should have been handled by publicRoutes
  if ((req as any).subdomain) {
    return next();
  }
  
  res.json({
    success: true,
    message: 'Mexican Pickleball Federation API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received, shutting down gracefully');
  process.exit(0);
});

export default app;