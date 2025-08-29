import express from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';

const router = express.Router();

// Court-specific analytics (for court owners)
router.get('/courts/:courtId/dashboard', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'federation']), 
  AnalyticsController.getCourtDashboard
);

router.get('/courts/:courtId/revenue', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'federation']), 
  AnalyticsController.getCourtRevenue
);

router.get('/courts/:courtId/usage', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'federation']), 
  AnalyticsController.getCourtUsage
);

router.get('/courts/:courtId/customers', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'federation']), 
  AnalyticsController.getCustomerMetrics
);

router.get('/courts/:courtId/revenue-breakdown', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'federation']), 
  AnalyticsController.getRevenueBreakdown
);

// Owner analytics (multiple courts)
router.get('/owners/:ownerType/:ownerId/analytics', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'federation']), 
  AnalyticsController.getOwnerAnalytics
);

// Court comparison
router.get('/courts/comparison', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'federation']), 
  AnalyticsController.getCourtComparison
);

// Public analytics
router.get('/popularity/ranking', AnalyticsController.getPopularityRanking);

// Federation-wide analytics
router.get('/federation/analytics', 
  authenticate, 
  authorizeRoles(['federation']), 
  AnalyticsController.getFederationAnalytics
);

export default router;