import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
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
  getMembership
);

router.get('/history', 
  authenticate,
  getMembershipHistory
);

router.get('/status', 
  authenticate,
  checkMembershipStatus
);

router.post('/upgrade', 
  authenticate,
  [
    body('membershipPlanId')
      .isInt({ min: 1 })
      .withMessage('Valid membership plan ID is required')
  ],
  upgradeMembership
);

router.post('/cancel', 
  authenticate,
  [
    body('reason')
      .optional()
      .isLength({ min: 5, max: 500 })
      .withMessage('Reason must be between 5 and 500 characters')
  ],
  cancelMembership
);

router.post('/renew', 
  authenticate,
  renewMembership
);

router.get('/stats', 
  authenticate,
  getMembershipStats
);

export default router;