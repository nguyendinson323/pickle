import express from 'express';
import analyticsController from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Court-specific analytics (for court owners)
router.get('/courts/:courtId/dashboard', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'admin']), 
  asyncHandler(analyticsController.getCourtDashboard)
);

router.get('/courts/:courtId/revenue', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'admin']), 
  asyncHandler(analyticsController.getCourtRevenue)
);

router.get('/courts/:courtId/usage', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'admin']), 
  asyncHandler(analyticsController.getCourtUsage)
);

router.get('/courts/:courtId/customers', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'admin']), 
  asyncHandler(analyticsController.getCustomerMetrics)
);

router.get('/courts/:courtId/revenue-breakdown', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'admin']), 
  asyncHandler(analyticsController.getRevenueBreakdown)
);

// Owner analytics (multiple courts)
router.get('/owners/:ownerType/:ownerId/analytics', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'admin']), 
  asyncHandler(analyticsController.getOwnerAnalytics)
);

// Court comparison
router.get('/courts/comparison', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'admin']), 
  asyncHandler(analyticsController.getCourtComparison)
);

// Public analytics
router.get('/popularity/ranking', asyncHandler(analyticsController.getPopularityRanking));

// Federation-wide analytics
router.get('/admin/analytics', 
  authenticate, 
  authorizeRoles(['admin']), 
  asyncHandler(analyticsController.getFederationAnalytics)
);

export default router;