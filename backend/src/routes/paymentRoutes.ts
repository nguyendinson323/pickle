import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  getPlans,
  createPaymentIntent,
  confirmPayment,
  getPayments,
  cancelPayment,
  refundPayment
} from '../controllers/paymentController';

const router = express.Router();

router.get('/plans', getPlans);

router.post('/payment-intent', 
  authenticate,
  [
    body('membershipPlanId')
      .isInt({ min: 1 })
      .withMessage('Valid membership plan ID is required'),
    body('paymentMethod')
      .optional()
      .isIn(['card', 'transfer', 'oxxo'])
      .withMessage('Payment method must be card, transfer, or oxxo')
  ],
  createPaymentIntent
);

router.post('/confirm/:paymentId', 
  authenticate,
  confirmPayment
);

router.get('/history', 
  authenticate,
  getPayments
);

router.post('/cancel/:paymentId', 
  authenticate,
  cancelPayment
);

router.post('/refund/:paymentId', 
  authenticate,
  [
    body('reason')
      .optional()
      .isLength({ min: 5, max: 500 })
      .withMessage('Reason must be between 5 and 500 characters')
  ],
  refundPayment
);

export default router;