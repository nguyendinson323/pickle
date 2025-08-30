import { Response } from 'express';
import { AuthRequest } from '../types/auth';
import privacyService from '../services/privacyService';
import { Player } from '../models';

// Get privacy settings
const getPrivacySettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
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
};

// Update privacy settings
const updatePrivacySettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
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
};

// Block a player
const blockPlayer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
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
};

// Unblock a player
const unblockPlayer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
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
};

// Get blocked players list
const getBlockedPlayers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
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
};

// Update notification preferences
const updateNotificationPreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
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
};

// Update online status
const updateOnlineStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
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
};

// Get online status
const getOnlineStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
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
};

// Get privacy summary
const getPrivacySummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
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
};

export default {
  getPrivacySettings,
  updatePrivacySettings,
  blockPlayer,
  unblockPlayer,
  getBlockedPlayers,
  updateNotificationPreferences,
  updateOnlineStatus,
  getOnlineStatus,
  getPrivacySummary
};