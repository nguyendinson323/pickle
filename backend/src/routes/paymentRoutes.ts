import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import {
  getPlans,
  createPaymentIntent,
  confirmPayment,
  getPayments,
  cancelPayment,
  refundPayment
} from '../controllers/paymentController';

const router = express.Router();

router.get('/plans', asyncHandler(getPlans));

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
  asyncHandler(createPaymentIntent)
);

router.post('/confirm/:paymentId', 
  authenticate,
  asyncHandler(confirmPayment)
);

router.get('/history', 
  authenticate,
  asyncHandler(getPayments)
);

router.post('/cancel/:paymentId', 
  authenticate,
  asyncHandler(cancelPayment)
);

router.post('/refund/:paymentId', 
  authenticate,
  [
    body('reason')
      .optional()
      .isLength({ min: 5, max: 500 })
      .withMessage('Reason must be between 5 and 500 characters')
  ],
  asyncHandler(refundPayment)
);

export default router;