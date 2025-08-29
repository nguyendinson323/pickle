import { Router } from 'express';
import dataController from '../controllers/dataController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Public data endpoints
router.get('/states', asyncHandler(dataController.getStates));
router.get('/membership-plans', asyncHandler(dataController.getMembershipPlans));
router.get('/privacy-policy', asyncHandler(dataController.getPrivacyPolicy));
router.get('/privacy-policy/download', asyncHandler(dataController.downloadPrivacyPolicy));
router.get('/nrtp-levels', asyncHandler(dataController.getNrtpLevels));
router.get('/gender-options', asyncHandler(dataController.getGenderOptions));

export default router;