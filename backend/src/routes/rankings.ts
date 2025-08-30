import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import rankingsController from '../controllers/rankingsController';

const router = Router();

// Get player rankings
router.get('/player/:playerId', rankingsController.getPlayerRankings);

// Get rankings by category
router.get('/category/:category/:rankingType', rankingsController.getRankingsByCategory);

// Get player ranking history
router.get('/history/:playerId', rankingsController.getPlayerRankingHistory);

// Calculate tournament points (admin only)
router.post('/calculate-points', authenticate, rankingsController.calculateTournamentPoints);

// Update rankings after tournament (admin only)
router.post('/update-tournament/:tournamentId', authenticate, rankingsController.updateTournamentRankings);

// Recalculate positions (admin only)
router.post('/recalculate-positions', authenticate, rankingsController.recalculatePositions);

// Apply ranking decay (admin only, typically run by cron job)
router.post('/apply-decay', authenticate, rankingsController.applyRankingDecay);

// Get ranking statistics
router.get('/stats', rankingsController.getRankingStatistics);

export default router;