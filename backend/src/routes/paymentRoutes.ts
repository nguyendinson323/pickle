import express from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import paymentController from '../controllers/paymentController';

const router = express.Router();

router.get('/plans', asyncHandler(paymentController.getPlans));

router.post('/payment-intent', 
  authenticate,
  asyncHandler(paymentController.createPaymentIntent)
);

router.post('/confirm/:paymentIntentId', 
  authenticate,
  asyncHandler(paymentController.confirmPayment)
);

router.get('/history', 
  authenticate,
  asyncHandler(paymentController.getPaymentHistory)
);

router.get('/:id', 
  authenticate,
  asyncHandler(paymentController.getPaymentDetails)
);

router.post('/subscription/create', 
  authenticate,
  asyncHandler(paymentController.createSubscription)
);

router.post('/subscription/cancel', 
  authenticate,
  asyncHandler(paymentController.cancelSubscription)
);

router.post('/refund/:id', 
  authenticate,
  asyncHandler(paymentController.refundPayment)
);

// New payment method management endpoints
router.post('/setup-intent', 
  authenticate,
  asyncHandler(paymentController.createSetupIntent)
);

router.post('/payment-methods', 
  authenticate,
  asyncHandler(paymentController.savePaymentMethod)
);

router.get('/payment-methods', 
  authenticate,
  asyncHandler(paymentController.getUserPaymentMethods)
);

router.delete('/payment-methods/:paymentMethodId', 
  authenticate,
  asyncHandler(paymentController.removePaymentMethod)
);

// Tournament and booking payment endpoints
router.post('/tournament-payment', 
  authenticate,
  asyncHandler(paymentController.createTournamentPayment)
);

router.post('/booking-payment', 
  authenticate,
  asyncHandler(paymentController.createBookingPayment)
);

// Webhook endpoint (no authentication for Stripe webhooks)
router.post('/webhook', 
  express.raw({ type: 'application/json' }),
  asyncHandler(paymentController.processWebhook)
);

export default router;