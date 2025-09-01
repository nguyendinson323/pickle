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

// Role-specific dashboard endpoints (current user)
router.get('/player', asyncHandler(getPlayerDashboard));
router.get('/coach', asyncHandler(getCoachDashboard));
router.get('/club', asyncHandler(getClubDashboard));
router.get('/partner', asyncHandler(getPartnerDashboard));
router.get('/state', asyncHandler(getStateDashboard));
router.get('/admin', asyncHandler(getAdminDashboard));

// Role-specific dashboard endpoints (specific user by ID)
router.get('/player/:id', asyncHandler(getPlayerDashboard));
router.get('/coach/:id', asyncHandler(getCoachDashboard));
router.get('/club/:id', asyncHandler(getClubDashboard));
router.get('/partner/:id', asyncHandler(getPartnerDashboard));
router.get('/state/:id', asyncHandler(getStateDashboard));

export default router;