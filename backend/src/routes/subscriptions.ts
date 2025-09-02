import express from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import subscriptionController from '../controllers/subscriptionController';

const router = express.Router();

// Subscription plan management
router.get('/plans', 
  asyncHandler(subscriptionController.getPlans)
);

// User subscription management
router.get('/current', 
  authenticate,
  asyncHandler(subscriptionController.getUserSubscription)
);

router.post('/create', 
  authenticate,
  asyncHandler(subscriptionController.createSubscription)
);

router.post('/cancel', 
  authenticate,
  asyncHandler(subscriptionController.cancelSubscription)
);

router.post('/change-plan', 
  authenticate,
  asyncHandler(subscriptionController.changeSubscriptionPlan)
);

router.post('/reactivate', 
  authenticate,
  asyncHandler(subscriptionController.reactivateSubscription)
);

// Payment creation for specific services
router.post('/tournament-payment', 
  authenticate,
  asyncHandler(subscriptionController.createTournamentPayment)
);

router.post('/booking-payment', 
  authenticate,
  asyncHandler(subscriptionController.createBookingPayment)
);

// Payment history and invoice management
router.get('/payments', 
  authenticate,
  asyncHandler(subscriptionController.getPaymentHistory)
);

router.get('/upcoming-invoice', 
  authenticate,
  asyncHandler(subscriptionController.getUpcomingInvoice)
);

// Webhook processing
router.post('/webhook', 
  express.raw({ type: 'application/json' }),
  asyncHandler(subscriptionController.processWebhook)
);

export default router;