import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import privacyController from '../controllers/privacyController';

const router = Router();

// Get privacy settings
router.get('/settings', authenticate, privacyController.getPrivacySettings);

// Update privacy settings
router.patch('/settings', authenticate, privacyController.updatePrivacySettings);

// Block a player
router.post('/block', authenticate, privacyController.blockPlayer);

// Unblock a player
router.delete('/block/:playerId', authenticate, privacyController.unblockPlayer);

// Get blocked players list
router.get('/blocked', authenticate, privacyController.getBlockedPlayers);

// Update notification preferences
router.patch('/notifications', authenticate, privacyController.updateNotificationPreferences);

// Update online status
router.patch('/status', authenticate, privacyController.updateOnlineStatus);

// Get online status
router.get('/status', authenticate, privacyController.getOnlineStatus);

// Get privacy summary
router.get('/summary', authenticate, privacyController.getPrivacySummary);

export default router;