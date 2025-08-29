import express from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth';
import rankingService from '../services/rankingService';
import { RankingType, RankingCategory } from '../models/Ranking';

const router = express.Router();

// Validation middleware
const validateRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get player rankings
router.get('/player/:playerId', 
  [
    param('playerId').isInt().withMessage('Player ID must be an integer'),
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const { playerId } = req.params;
      const rankings = await rankingService.getPlayerRankings(parseInt(playerId));
      
      res.json({
        success: true,
        data: rankings
      });
    } catch (error) {
      console.error('Error fetching player rankings:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch player rankings' 
      });
    }
  }
);

// Get rankings by category
router.get('/category/:category/:rankingType',
  [
    param('category').isIn(Object.values(RankingCategory)).withMessage('Invalid ranking category'),
    param('rankingType').isIn(Object.values(RankingType)).withMessage('Invalid ranking type'),
    query('stateId').optional().isInt().withMessage('State ID must be an integer'),
    query('ageGroup').optional().isString(),
    query('gender').optional().isIn(['male', 'female']).withMessage('Gender must be male or female'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer')
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const { category, rankingType } = req.params;
      const { stateId, ageGroup, gender, limit = 50, offset = 0 } = req.query;

      const options = {
        stateId: stateId ? parseInt(stateId as string) : undefined,
        ageGroup: ageGroup as string,
        gender: gender as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      };

      const result = await rankingService.getRankingsByCategory(
        category as RankingCategory,
        rankingType as RankingType,
        options
      );

      res.json({
        success: true,
        data: result.rankings,
        pagination: {
          total: result.total,
          limit: options.limit,
          offset: options.offset,
          totalPages: Math.ceil(result.total / options.limit)
        }
      });
    } catch (error) {
      console.error('Error fetching rankings by category:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch rankings' 
      });
    }
  }
);

// Get player ranking history
router.get('/history/:playerId',
  [
    param('playerId').isInt().withMessage('Player ID must be an integer'),
    query('rankingType').optional().isIn(Object.values(RankingType)).withMessage('Invalid ranking type'),
    query('category').optional().isIn(Object.values(RankingCategory)).withMessage('Invalid ranking category'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const { playerId } = req.params;
      const { rankingType, category, limit = 20 } = req.query;

      const history = await rankingService.getPlayerRankingHistory(
        parseInt(playerId),
        rankingType as RankingType,
        category as RankingCategory,
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error('Error fetching ranking history:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch ranking history' 
      });
    }
  }
);

// Calculate tournament points (admin only)
router.post('/calculate-points',
  authenticate,
  [
    body('playerId').isInt().withMessage('Player ID is required and must be an integer'),
    body('tournamentId').isInt().withMessage('Tournament ID is required and must be an integer'),
    body('finalPlacement').isInt({ min: 1 }).withMessage('Final placement is required and must be a positive integer'),
    body('totalPlayers').isInt({ min: 1 }).withMessage('Total players is required and must be a positive integer'),
    body('matchesWon').optional().isInt({ min: 0 }).withMessage('Matches won must be a non-negative integer'),
    body('matchesLost').optional().isInt({ min: 0 }).withMessage('Matches lost must be a non-negative integer'),
    body('averageOpponentRating').optional().isFloat({ min: 0 }).withMessage('Average opponent rating must be a non-negative number')
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const user = req.user as any;
      
      // Check if user has admin privileges
      if (user.role !== 'admin' && user.role !== 'state') {
        return res.status(403).json({ 
          success: false, 
          error: 'Insufficient permissions' 
        });
      }

      const {
        playerId,
        tournamentId,
        finalPlacement,
        totalPlayers,
        matchesWon = 0,
        matchesLost = 0,
        averageOpponentRating = 0
      } = req.body;

      const pointCalculation = await rankingService.calculateTournamentPoints(
        playerId,
        tournamentId,
        finalPlacement,
        totalPlayers,
        matchesWon,
        matchesLost,
        averageOpponentRating
      );

      res.json({
        success: true,
        data: pointCalculation
      });
    } catch (error) {
      console.error('Error calculating tournament points:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to calculate tournament points' 
      });
    }
  }
);

// Update rankings after tournament (admin only)
router.post('/update-tournament/:tournamentId',
  authenticate,
  [
    param('tournamentId').isInt().withMessage('Tournament ID must be an integer')
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const user = req.user as any;
      
      // Check if user has admin privileges
      if (user.role !== 'admin' && user.role !== 'state') {
        return res.status(403).json({ 
          success: false, 
          error: 'Insufficient permissions' 
        });
      }

      const { tournamentId } = req.params;

      await rankingService.updatePlayerRankings(parseInt(tournamentId));

      res.json({
        success: true,
        message: 'Rankings updated successfully'
      });
    } catch (error) {
      console.error('Error updating rankings:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update rankings' 
      });
    }
  }
);

// Recalculate positions (admin only)
router.post('/recalculate-positions',
  authenticate,
  [
    body('rankingType').isIn(Object.values(RankingType)).withMessage('Invalid ranking type'),
    body('category').isIn(Object.values(RankingCategory)).withMessage('Invalid ranking category'),
    body('stateId').optional().isInt().withMessage('State ID must be an integer'),
    body('ageGroup').optional().isString(),
    body('gender').optional().isIn(['male', 'female']).withMessage('Gender must be male or female')
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const user = req.user as any;
      
      // Check if user has admin privileges
      if (user.role !== 'admin' && user.role !== 'state') {
        return res.status(403).json({ 
          success: false, 
          error: 'Insufficient permissions' 
        });
      }

      const { rankingType, category, stateId, ageGroup, gender } = req.body;

      await rankingService.recalculatePositions(
        rankingType,
        category,
        stateId,
        ageGroup,
        gender
      );

      res.json({
        success: true,
        message: 'Positions recalculated successfully'
      });
    } catch (error) {
      console.error('Error recalculating positions:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to recalculate positions' 
      });
    }
  }
);

// Apply ranking decay (admin only, typically run by cron job)
router.post('/apply-decay',
  authenticate,
  async (req: express.Request, res: express.Response) => {
    try {
      const user = req.user as any;
      
      // Check if user has admin privileges
      if (user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          error: 'Insufficient permissions' 
        });
      }

      await rankingService.applyRankingDecay();

      res.json({
        success: true,
        message: 'Ranking decay applied successfully'
      });
    } catch (error) {
      console.error('Error applying ranking decay:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to apply ranking decay' 
      });
    }
  }
);

// Get ranking statistics
router.get('/stats',
  [
    query('category').optional().isIn(Object.values(RankingCategory)).withMessage('Invalid ranking category'),
    query('rankingType').optional().isIn(Object.values(RankingType)).withMessage('Invalid ranking type'),
    query('stateId').optional().isInt().withMessage('State ID must be an integer')
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const { category, rankingType, stateId } = req.query;

      // This would require a new method in ranking service for statistics
      // For now, we'll return basic statistics
      
      res.json({
        success: true,
        data: {
          message: 'Statistics endpoint - implementation pending',
          filters: { category, rankingType, stateId }
        }
      });
    } catch (error) {
      console.error('Error fetching ranking statistics:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch ranking statistics' 
      });
    }
  }
);

export default router;