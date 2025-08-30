import { Response } from 'express';
import { AuthRequest } from '../types/auth';
import playerFinderService from '../services/playerFinderService';
import enhancedNotificationService from '../services/enhancedNotificationService';
import { PlayerLocation, PlayerFinderRequest, Player } from '../models';

// Create a new finder request
const createFinderRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
    }

    // Validate age range
    if (req.body.ageRangeMin && req.body.ageRangeMax) {
      if (req.body.ageRangeMin > req.body.ageRangeMax) {
        res.status(400).json({ error: 'Invalid age range' });
        return;
      }
    }

    const finderRequest = await playerFinderService.createFinderRequest(player.id, {
      ...req.body,
      expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : undefined
    });

    res.status(201).json({
      success: true,
      data: finderRequest
    });
  } catch (error) {
    console.error('Error creating finder request:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create finder request'
    });
  }
};

// Get active finder requests with filters
const getActiveRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filters: any = {
      skillLevel: req.query.skillLevel as string,
      maxDistance: req.query.maxDistance ? parseInt(req.query.maxDistance as string) : undefined,
      playingStyle: req.query.playingStyle as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0
    };

    if (req.query.latitude && req.query.longitude) {
      filters.location = {
        latitude: parseFloat(req.query.latitude as string),
        longitude: parseFloat(req.query.longitude as string)
      };
    }

    const result = await playerFinderService.getActiveRequests(filters);

    res.json({
      success: true,
      data: result.requests,
      pagination: {
        total: result.total,
        limit: filters.limit,
        offset: filters.offset,
        hasMore: result.total > (filters.offset + filters.limit)
      }
    });
  } catch (error) {
    console.error('Error fetching finder requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch finder requests'
    });
  }
};

// Get user's own finder requests
const getMyRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
    }

    const requests = await PlayerFinderRequest.findAll({
      where: { requesterId: player.id },
      include: [
        {
          model: PlayerLocation,
          as: 'location'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch your requests'
    });
  }
};

// Get matches for current user
const getMatches = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
    }

    const matches = await playerFinderService.getPlayerMatches(player.id);

    res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch matches'
    });
  }
};

// Get matches for a specific request
const getRequestMatches = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
    }

    // Verify request ownership
    const request = await PlayerFinderRequest.findOne({
      where: {
        id: parseInt(req.params.requestId),
        requesterId: player.id
      }
    });

    if (!request) {
      res.status(404).json({ error: 'Request not found or access denied' });
      return;
    }

    const matches = await playerFinderService.getRequestMatches(parseInt(req.params.requestId));

    res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error('Error fetching request matches:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch request matches'
    });
  }
};

// Accept or decline a match
const updateMatchStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
    }

    const updatedMatch = await playerFinderService.updateMatchStatus(
      parseInt(req.params.matchId),
      player.id,
      req.body.status,
      req.body.message
    );

    // Send notification if accepted
    if (req.body.status === 'accepted' && updatedMatch && 'requestId' in updatedMatch) {
      // Get player name from profile
      const playerName = req.user.profile && 'fullName' in req.user.profile 
        ? req.user.profile.fullName 
        : req.user.username;

      await enhancedNotificationService.notifyFinderRequestAccepted(
        updatedMatch.requestId,
        {
          accepterName: playerName,
          accepterContact: req.user.email,
          requestTitle: 'Player Finder Request',
          message: req.body.message || 'Sin mensaje',
          playerName: playerName
        }
      );
    }

    res.json({
      success: true,
      data: updatedMatch
    });
  } catch (error) {
    console.error('Error updating match status:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update match status'
    });
  }
};

// Cancel a finder request
const cancelRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
    }

    await playerFinderService.cancelRequest(parseInt(req.params.requestId), player.id);

    res.json({
      success: true,
      message: 'Request cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling request:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel request'
    });
  }
};

// Force find new matches for a request
const findMatches = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
    }

    // Verify request ownership
    const request = await PlayerFinderRequest.findOne({
      where: {
        id: parseInt(req.params.requestId),
        requesterId: player.id
      }
    });

    if (!request) {
      res.status(404).json({ error: 'Request not found or access denied' });
      return;
    }

    const newMatches = await playerFinderService.findMatches(parseInt(req.params.requestId));

    res.json({
      success: true,
      data: newMatches,
      message: `Found ${newMatches.length} new potential matches`
    });
  } catch (error) {
    console.error('Error finding matches:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to find matches'
    });
  }
};

export default {
  createFinderRequest,
  getActiveRequests,
  getMyRequests,
  getMatches,
  getRequestMatches,
  updateMatchStatus,
  cancelRequest,
  findMatches
};