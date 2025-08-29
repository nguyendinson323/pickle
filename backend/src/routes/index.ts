import { Router } from 'express';
import authRoutes from './auth';
import registrationRoutes from './registration';
import dataRoutes from './data';
import uploadRoutes from './upload';
import dashboardRoutes from './dashboard';
import messageRoutes from './messages';
import notificationRoutes from './notifications';
import paymentRoutes from './paymentRoutes';
import membershipRoutes from './membershipRoutes';
import webhookRoutes from './webhookRoutes';
import courtRoutes from './courts';
import reservationRoutes from './reservations';
import courtReviewRoutes from './courtReviews';
import analyticsRoutes from './analytics';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/registration', registrationRoutes);
router.use('/data', dataRoutes);
router.use('/upload', uploadRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/messages', messageRoutes);
router.use('/notifications', notificationRoutes);
router.use('/payments', paymentRoutes);
router.use('/memberships', membershipRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/api', courtRoutes);
router.use('/api', reservationRoutes);
router.use('/api', courtReviewRoutes);
router.use('/api/analytics', analyticsRoutes);

export default router;