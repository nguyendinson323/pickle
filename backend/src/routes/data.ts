import { Router } from 'express';
import { 
  getStates, 
  getMembershipPlans, 
  getPrivacyPolicy, 
  downloadPrivacyPolicy, 
  getNrtpLevels, 
  getGenderOptions 
} from '../controllers/dataController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Public data endpoints
router.get('/states', asyncHandler(getStates));
router.get('/membership-plans', asyncHandler(getMembershipPlans));
router.get('/privacy-policy', asyncHandler(getPrivacyPolicy));
router.get('/privacy-policy/download', asyncHandler(downloadPrivacyPolicy));
router.get('/nrtp-levels', asyncHandler(getNrtpLevels));
router.get('/gender-options', asyncHandler(getGenderOptions));

export default router;