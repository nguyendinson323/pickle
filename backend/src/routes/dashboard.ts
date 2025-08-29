import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import {
  getDashboardData,
  getPlayerDashboard,
  getCoachDashboard,
  getClubDashboard,
  getPartnerDashboard,
  getStateDashboard,
  getAdminDashboard
} from '../controllers/dashboardController';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

// General dashboard endpoint - uses current user's role
router.get('/', asyncHandler(getDashboardData));

// Role-specific dashboard endpoints
router.get('/player/:id', asyncHandler(getPlayerDashboard));
router.get('/coach/:id', asyncHandler(getCoachDashboard));
router.get('/club/:id', asyncHandler(getClubDashboard));
router.get('/partner/:id', asyncHandler(getPartnerDashboard));
router.get('/state/:id', asyncHandler(getStateDashboard));
router.get('/admin', asyncHandler(getAdminDashboard));

export default router;