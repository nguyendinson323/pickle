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

export default router;