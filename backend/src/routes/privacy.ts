import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body, param } from 'express-validator';
import privacyService from '../services/privacyService';
import { Player } from '../models';

const router = Router();

// Get privacy settings
router.get('/settings',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const player = await Player.findOne({
        where: { userId: req.user!.id }
      });

      if (!player) {
        return res.status(404).json({ error: 'Player profile not found' });
      }

      const settings = await privacyService.getOrCreatePrivacySettings(player.id);

      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch privacy settings'
      });
    }
  }
);

// Update privacy settings
router.patch('/settings',
  authenticateToken,
  [
    body('showLocation').optional().isBoolean(),
    body('showRealName').optional().isBoolean(),
    body('showAge').optional().isBoolean(),
    body('showPhone').optional().isBoolean(),
    body('showEmail').optional().isBoolean(),
    body('showSkillLevel').optional().isBoolean(),
    body('showRanking').optional().isBoolean(),
    body('allowFinderRequests').optional().isBoolean(),
    body('allowDirectMessages').optional().isBoolean(),
    body('allowTournamentInvites').optional().isBoolean(),
    body('allowClubInvites').optional().isBoolean(),
    body('maxDistance').optional().isInt({ min: 1, max: 200 }),
    body('onlineStatus').optional().isIn(['online', 'away', 'busy', 'offline']),
    body('profileVisibility').optional().isIn(['public', 'friends_only', 'private']),
    body('locationPrecision').optional().isIn(['exact', 'approximate', 'city_only']),
    body('autoDeclineFinderRequests').optional().isBoolean(),
    body('preferredContactMethod').optional().isIn(['app', 'email', 'sms']),
    body('notificationPreferences').optional().isObject()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const player = await Player.findOne({
        where: { userId: req.user!.id }
      });

      if (!player) {
        return res.status(404).json({ error: 'Player profile not found' });
      }

      const updatedSettings = await privacyService.updatePrivacySettings(player.id, req.body);

      res.json({
        success: true,
        data: updatedSettings
      });
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update privacy settings'
      });
    }
  }
);

// Block a player
router.post('/block',
  authenticateToken,
  [
    body('playerId').isInt({ min: 1 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const player = await Player.findOne({
        where: { userId: req.user!.id }
      });

      if (!player) {
        return res.status(404).json({ error: 'Player profile not found' });
      }

      await privacyService.blockPlayer(player.id, req.body.playerId);

      res.json({
        success: true,
        message: 'Player blocked successfully'
      });
    } catch (error) {
      console.error('Error blocking player:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to block player'
      });
    }
  }
);

// Unblock a player
router.delete('/block/:playerId',
  authenticateToken,
  [
    param('playerId').isInt({ min: 1 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const player = await Player.findOne({
        where: { userId: req.user!.id }
      });

      if (!player) {
        return res.status(404).json({ error: 'Player profile not found' });
      }

      await privacyService.unblockPlayer(player.id, parseInt(req.params.playerId));

      res.json({
        success: true,
        message: 'Player unblocked successfully'
      });
    } catch (error) {
      console.error('Error unblocking player:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to unblock player'
      });
    }
  }
);

// Get blocked players list
router.get('/blocked',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const player = await Player.findOne({
        where: { userId: req.user!.id }
      });

      if (!player) {
        return res.status(404).json({ error: 'Player profile not found' });
      }

      const blockedPlayers = await privacyService.getBlockedPlayers(player.id);

      res.json({
        success: true,
        data: blockedPlayers
      });
    } catch (error) {
      console.error('Error fetching blocked players:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch blocked players'
      });
    }
  }
);

// Update notification preferences
router.patch('/notifications',
  authenticateToken,
  [
    body('newFinderRequest').optional().isBoolean(),
    body('finderRequestAccepted').optional().isBoolean(),
    body('finderRequestDeclined').optional().isBoolean(),
    body('newMessage').optional().isBoolean(),
    body('tournamentReminder').optional().isBoolean(),
    body('clubUpdate').optional().isBoolean()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const player = await Player.findOne({
        where: { userId: req.user!.id }
      });

      if (!player) {
        return res.status(404).json({ error: 'Player profile not found' });
      }

      const updatedSettings = await privacyService.updateNotificationPreferences(player.id, req.body);

      res.json({
        success: true,
        data: updatedSettings.notificationPreferences
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update notification preferences'
      });
    }
  }
);

// Update online status
router.patch('/status',
  authenticateToken,
  [
    body('status').isIn(['online', 'away', 'busy', 'offline'])
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const player = await Player.findOne({
        where: { userId: req.user!.id }
      });

      if (!player) {
        return res.status(404).json({ error: 'Player profile not found' });
      }

      await privacyService.setOnlineStatus(player.id, req.body.status);

      res.json({
        success: true,
        message: 'Online status updated successfully'
      });
    } catch (error) {
      console.error('Error updating online status:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update online status'
      });
    }
  }
);

// Get online status
router.get('/status',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const player = await Player.findOne({
        where: { userId: req.user!.id }
      });

      if (!player) {
        return res.status(404).json({ error: 'Player profile not found' });
      }

      const status = await privacyService.getOnlineStatus(player.id);

      res.json({
        success: true,
        data: { status }
      });
    } catch (error) {
      console.error('Error fetching online status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch online status'
      });
    }
  }
);

// Get privacy summary
router.get('/summary',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const player = await Player.findOne({
        where: { userId: req.user!.id }
      });

      if (!player) {
        return res.status(404).json({ error: 'Player profile not found' });
      }

      const summary = await privacyService.getPrivacySummary(player.id);

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Error fetching privacy summary:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch privacy summary'
      });
    }
  }
);

export default router;