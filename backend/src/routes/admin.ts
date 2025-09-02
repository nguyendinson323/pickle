import { Router } from 'express';
import { auth, requireRole } from '../middleware/auth';
import {
  getDashboardOverview,
  getUserManagement,
  updateUserStatus,
  getContentModeration,
  moderateContent,
  getSystemAlerts,
  updateSystemAlert,
  getFinancialOverview,
  broadcastAnnouncement,
  getAdminLogs,
  generateReport,
  getPlatformStatistics
} from '../controllers/adminDashboardController';

const router = Router();

// Middleware para requerir autenticación y rol de federación
const requireFederationRole = [auth, requireRole('federation')];

// Dashboard Overview
router.get('/dashboard/overview', requireFederationRole, getDashboardOverview);

// User Management
router.get('/users', requireFederationRole, getUserManagement);
router.patch('/users/:userId/status', requireFederationRole, updateUserStatus);

// Content Moderation
router.get('/moderation', requireFederationRole, getContentModeration);
router.patch('/moderation/:contentId', requireFederationRole, moderateContent);

// System Alerts
router.get('/alerts', requireFederationRole, getSystemAlerts);
router.patch('/alerts/:alertId', requireFederationRole, updateSystemAlert);

// Financial Overview
router.get('/financial', requireFederationRole, getFinancialOverview);

// Communication
router.post('/broadcast', requireFederationRole, broadcastAnnouncement);

// Admin Logs
router.get('/logs', requireFederationRole, getAdminLogs);

// Reports
router.post('/reports/generate', requireFederationRole, generateReport);

// Platform Statistics
router.get('/statistics', requireFederationRole, getPlatformStatistics);

export default router;