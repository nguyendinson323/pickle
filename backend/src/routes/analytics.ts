import express from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';

const router = express.Router();

// Court-specific analytics (for court owners)
router.get('/courts/:courtId/dashboard', 
  authenticateToken, 
  authorizeRoles(['club', 'partner', 'federation']), 
  AnalyticsController.getCourtDashboard
);

router.get('/courts/:courtId/revenue', 
  authenticateToken, 
  authorizeRoles(['club', 'partner', 'federation']), 
  AnalyticsController.getCourtRevenue
);

router.get('/courts/:courtId/usage', 
  authenticateToken, 
  authorizeRoles(['club', 'partner', 'federation']), 
  AnalyticsController.getCourtUsage
);

router.get('/courts/:courtId/customers', 
  authenticateToken, 
  authorizeRoles(['club', 'partner', 'federation']), 
  AnalyticsController.getCustomerMetrics
);

router.get('/courts/:courtId/revenue-breakdown', 
  authenticateToken, 
  authorizeRoles(['club', 'partner', 'federation']), 
  AnalyticsController.getRevenueBreakdown
);

// Owner analytics (multiple courts)
router.get('/owners/:ownerType/:ownerId/analytics', 
  authenticateToken, 
  authorizeRoles(['club', 'partner', 'federation']), 
  AnalyticsController.getOwnerAnalytics
);

// Court comparison
router.get('/courts/comparison', 
  authenticateToken, 
  authorizeRoles(['club', 'partner', 'federation']), 
  AnalyticsController.getCourtComparison
);

// Public analytics
router.get('/popularity/ranking', AnalyticsController.getPopularityRanking);

// Federation-wide analytics
router.get('/federation/analytics', 
  authenticateToken, 
  authorizeRoles(['federation']), 
  AnalyticsController.getFederationAnalytics
);

export default router;