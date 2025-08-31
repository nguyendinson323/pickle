import express from 'express';
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
  asyncHandler(upgradeMembership)
);

router.post('/cancel', 
  authenticate,
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