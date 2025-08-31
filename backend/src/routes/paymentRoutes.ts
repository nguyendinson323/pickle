import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import paymentController from '../controllers/paymentController';

const router = express.Router();

router.get('/plans', asyncHandler(paymentController.getPlans));

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
  [
    body('planId')
      .isInt({ min: 1 })
      .withMessage('Valid plan ID is required')
  ],
  asyncHandler(paymentController.createSubscription)
);

router.post('/subscription/cancel', 
  authenticate,
  asyncHandler(paymentController.cancelSubscription)
);

router.post('/refund/:id', 
  authenticate,
  [
    body('reason')
      .optional()
      .isLength({ min: 5, max: 500 })
      .withMessage('Reason must be between 5 and 500 characters')
  ],
  asyncHandler(paymentController.refundPayment)
);

export default router;