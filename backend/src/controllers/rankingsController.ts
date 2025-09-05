import { Response } from 'express';
import { AuthRequest } from '../types/auth';
import rankingService from '../services/rankingService';
import { RankingType, RankingCategory } from '../models/Ranking';

// Get player rankings
const getPlayerRankings = async (req: AuthRequest, res: Response): Promise<void> => {
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
};

// Get rankings by category
const getRankingsByCategory = async (req: AuthRequest, res: Response): Promise<void> => {
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
};

// Get player ranking history
const getPlayerRankingHistory = async (req: AuthRequest, res: Response): Promise<void> => {
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
};

// Calculate tournament points (admin only)
const calculateTournamentPoints = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    
    // Check if user has admin privileges
    if (user.role !== 'admin' && user.role !== 'state') {
      res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
      return;
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
};

// Update rankings after tournament (admin only)
const updateTournamentRankings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    
    // Check if user has admin privileges
    if (user.role !== 'admin' && user.role !== 'state') {
      res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
      return;
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
};

// Recalculate positions (admin only)
const recalculatePositions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    
    // Check if user has admin privileges
    if (user.role !== 'admin' && user.role !== 'state') {
      res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
      return;
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
};

// Apply ranking decay (admin only, typically run by cron job)
const applyRankingDecay = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    
    // Check if user has admin privileges
    if (user.role !== 'admin') {
      res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
      return;
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
};

// Get ranking statistics
const getRankingStatistics = async (req: AuthRequest, res: Response): Promise<void> => {
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
};

export default {
  getPlayerRankings,
  getRankingsByCategory,
  getPlayerRankingHistory,
  calculateTournamentPoints,
  updateTournamentRankings,
  recalculatePositions,
  applyRankingDecay,
  getRankingStatistics
};