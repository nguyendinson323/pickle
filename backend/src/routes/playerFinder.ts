import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body, param, query } from 'express-validator';
import playerFinderService from '../services/playerFinderService';
import locationService from '../services/locationService';
import privacyService from '../services/privacyService';
import enhancedNotificationService from '../services/enhancedNotificationService';
import { PlayerLocation, PlayerFinderRequest, Player, User } from '../models';

const router = Router();

// Create a new finder request
router.post('/requests',
  authenticateToken,
  [
    body('title').notEmpty().trim().isLength({ min: 5, max: 200 }),
    body('description').notEmpty().trim().isLength({ min: 10, max: 1000 }),
    body('skillLevel').isIn(['beginner', 'intermediate', 'advanced', 'pro']),
    body('maxDistance').isInt({ min: 1, max: 100 }),
    body('locationId').isInt({ min: 1 }),
    body('maxPlayers').isInt({ min: 2, max: 20 }),
    body('availabilityDays').isArray().notEmpty(),
    body('preferredGender').optional().isIn(['any', 'male', 'female']),
    body('ageRangeMin').optional().isInt({ min: 13, max: 100 }),
    body('ageRangeMax').optional().isInt({ min: 13, max: 100 }),
    body('playingStyle').optional().isIn(['casual', 'competitive', 'training']),
    body('availabilityTimeStart').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('availabilityTimeEnd').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('expiresAt').optional().isISO8601()
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

      // Validate age range
      if (req.body.ageRangeMin && req.body.ageRangeMax) {
        if (req.body.ageRangeMin > req.body.ageRangeMax) {
          return res.status(400).json({ error: 'Invalid age range' });
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
  }
);

// Get active finder requests with filters
router.get('/requests',
  authenticateToken,
  [
    query('skillLevel').optional().isIn(['beginner', 'intermediate', 'advanced', 'pro']),
    query('maxDistance').optional().isInt({ min: 1, max: 200 }),
    query('playingStyle').optional().isIn(['casual', 'competitive', 'training']),
    query('latitude').optional().isFloat({ min: -90, max: 90 }),
    query('longitude').optional().isFloat({ min: -180, max: 180 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('offset').optional().isInt({ min: 0 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
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
  }
);

// Get user's own finder requests
router.get('/my-requests',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const player = await Player.findOne({
        where: { userId: req.user!.id }
      });

      if (!player) {
        return res.status(404).json({ error: 'Player profile not found' });
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
  }
);

// Get matches for current user
router.get('/matches',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const player = await Player.findOne({
        where: { userId: req.user!.id }
      });

      if (!player) {
        return res.status(404).json({ error: 'Player profile not found' });
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
  }
);

// Get matches for a specific request
router.get('/requests/:requestId/matches',
  authenticateToken,
  [
    param('requestId').isInt({ min: 1 })
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

      // Verify request ownership
      const request = await PlayerFinderRequest.findOne({
        where: {
          id: parseInt(req.params.requestId),
          requesterId: player.id
        }
      });

      if (!request) {
        return res.status(404).json({ error: 'Request not found or access denied' });
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
  }
);

// Accept or decline a match
router.patch('/matches/:matchId',
  authenticateToken,
  [
    param('matchId').isInt({ min: 1 }),
    body('status').isIn(['accepted', 'declined']),
    body('message').optional().trim().isLength({ max: 500 })
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

      const updatedMatch = await playerFinderService.updateMatchStatus(
        parseInt(req.params.matchId),
        player.id,
        req.body.status,
        req.body.message
      );

      // Send notification if accepted
      if (req.body.status === 'accepted') {
        await enhancedNotificationService.notifyFinderRequestAccepted(
          updatedMatch.request!.requesterId,
          {
            accepterName: `${req.user!.firstName} ${req.user!.lastName}`,
            accepterContact: req.user!.email,
            requestTitle: updatedMatch.request!.title,
            message: req.body.message || 'Sin mensaje',
            playerName: `${req.user!.firstName}`
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
  }
);

// Cancel a finder request
router.patch('/requests/:requestId/cancel',
  authenticateToken,
  [
    param('requestId').isInt({ min: 1 })
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
  }
);

// Force find new matches for a request
router.post('/requests/:requestId/find-matches',
  authenticateToken,
  [
    param('requestId').isInt({ min: 1 })
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

      // Verify request ownership
      const request = await PlayerFinderRequest.findOne({
        where: {
          id: parseInt(req.params.requestId),
          requesterId: player.id
        }
      });

      if (!request) {
        return res.status(404).json({ error: 'Request not found or access denied' });
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
  }
);

export default router;