import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import {
  getMembership,
  getMembershipHistory,
  upgradeMembership,
  cancelMembership,
  checkMembershipStatus,
  renewMembership,
  getMembershipStats
} from '../controllers/membershipController';

const router = express.Router();

router.get('/current', 
  authenticate,
  asyncHandler(getMembership)
);

router.get('/history', 
  authenticate,
  asyncHandler(getMembershipHistory)
);

router.get('/status', 
  authenticate,
  asyncHandler(checkMembershipStatus)
);

router.post('/upgrade', 
  authenticate,
  [
    body('membershipPlanId')
      .isInt({ min: 1 })
      .withMessage('Valid membership plan ID is required')
  ],
  asyncHandler(upgradeMembership)
);

router.post('/cancel', 
  authenticate,
  [
    body('reason')
      .optional()
      .isLength({ min: 5, max: 500 })
      .withMessage('Reason must be between 5 and 500 characters')
  ],
  asyncHandler(cancelMembership)
);

router.post('/renew', 
  authenticate,
  asyncHandler(renewMembership)
);

router.get('/stats', 
  authenticate,
  asyncHandler(getMembershipStats)
);

export default router;