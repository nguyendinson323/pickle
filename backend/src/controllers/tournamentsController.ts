import { Response } from 'express';
import { AuthRequest } from '../types/auth';
import bracketService from '../services/bracketService';
import matchService from '../services/matchService';
import { 
  Tournament,
  TournamentBracket, 
  TournamentCategory, 
  TournamentMatch, 
  User, 
  Court 
} from '../models';

// Bracket Management
const generateBracket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const { bracketType = 'single_elimination', seedingMethod = 'ranking' } = req.body;
    
    const bracket = await bracketService.generateBracket(
      Number(categoryId), 
      bracketType, 
      seedingMethod
    );
    
    res.json({ bracket });
  } catch (error: any) {
    console.error('Error generating bracket:', error);
    res.status(400).json({ error: error.message || 'Failed to generate bracket' });
  }
};

const getTournamentBrackets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tournamentId } = req.params;
    
    const brackets = await TournamentBracket.findAll({
      where: { tournamentId: Number(tournamentId) },
      include: [
        { model: TournamentCategory, as: 'category' }
      ]
    });
    
    res.json({ brackets });
  } catch (error) {
    console.error('Error fetching brackets:', error);
    res.status(500).json({ error: 'Failed to fetch brackets' });
  }
};

const getBracket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bracketId } = req.params;
    
    const bracket = await TournamentBracket.findByPk(bracketId, {
      include: [
        { model: TournamentMatch, as: 'matches' },
        { model: TournamentCategory, as: 'category' }
      ]
    });
    
    if (!bracket) {
      res.status(404).json({ error: 'Bracket not found' });
      return;
    }
    
    res.json({ bracket });
  } catch (error) {
    console.error('Error fetching bracket:', error);
    res.status(500).json({ error: 'Failed to fetch bracket' });
  }
};

const getBracketStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bracketId } = req.params;
    
    const status = await bracketService.getBracketStatus(Number(bracketId));
    
    res.json({ status });
  } catch (error: any) {
    console.error('Error fetching bracket status:', error);
    res.status(400).json({ error: error.message || 'Failed to fetch bracket status' });
  }
};

// Match Management
const getTournamentMatches = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tournamentId } = req.params;
    const { date } = req.query;
    
    const matches = await matchService.getMatchSchedule(
      Number(tournamentId),
      date as string
    );
    
    res.json({ matches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
};

const getMatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { matchId } = req.params;
    
    const match = await TournamentMatch.findByPk(matchId, {
      include: [
        { model: User, as: 'player1', attributes: ['id', 'username'] },
        { model: User, as: 'player2', attributes: ['id', 'username'] },
        { model: User, as: 'player1Partner', attributes: ['id', 'username'] },
        { model: User, as: 'player2Partner', attributes: ['id', 'username'] },
        { model: User, as: 'referee', attributes: ['id', 'username'] },
        { model: Court, as: 'court' },
        { model: TournamentCategory, as: 'category' },
        { model: Tournament, as: 'tournament' }
      ]
    });
    
    if (!match) {
      res.status(404).json({ error: 'Match not found' });
      return;
    }
    
    res.json({ match });
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ error: 'Failed to fetch match' });
  }
};

const scheduleMatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { matchId } = req.params;
    const { courtId, scheduledDate, scheduledTime } = req.body;
    
    const match = await matchService.scheduleMatch(
      Number(matchId),
      courtId,
      scheduledDate,
      scheduledTime
    );
    
    res.json({ match });
  } catch (error: any) {
    console.error('Error scheduling match:', error);
    res.status(400).json({ error: error.message || 'Failed to schedule match' });
  }
};

const startMatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { matchId } = req.params;
    
    const match = await matchService.startMatch(Number(matchId));
    
    res.json({ match });
  } catch (error: any) {
    console.error('Error starting match:', error);
    res.status(400).json({ error: error.message || 'Failed to start match' });
  }
};

const updateMatchScore = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { matchId } = req.params;
    const { score, isPartial = true } = req.body;
    
    const match = await matchService.updateScore(
      Number(matchId),
      score,
      isPartial
    );
    
    res.json({ match });
  } catch (error: any) {
    console.error('Error updating score:', error);
    res.status(400).json({ error: error.message || 'Failed to update score' });
  }
};

const completeMatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { matchId } = req.params;
    const { winner } = req.body;
    
    const match = await matchService.completeMatch(
      Number(matchId),
      winner
    );
    
    res.json({ match });
  } catch (error: any) {
    console.error('Error completing match:', error);
    res.status(400).json({ error: error.message || 'Failed to complete match' });
  }
};

const cancelMatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { matchId } = req.params;
    const { reason } = req.body;
    
    const match = await matchService.cancelMatch(
      Number(matchId),
      reason
    );
    
    res.json({ match });
  } catch (error: any) {
    console.error('Error cancelling match:', error);
    res.status(400).json({ error: error.message || 'Failed to cancel match' });
  }
};

const postponeMatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { matchId } = req.params;
    const { newDate, newTime, reason } = req.body;
    
    const match = await matchService.postponeMatch(
      Number(matchId),
      newDate,
      newTime,
      reason
    );
    
    res.json({ match });
  } catch (error: any) {
    console.error('Error postponing match:', error);
    res.status(400).json({ error: error.message || 'Failed to postpone match' });
  }
};

const recordWalkover = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { matchId } = req.params;
    const { winnerId, reason } = req.body;
    
    const match = await matchService.recordWalkover(
      Number(matchId),
      winnerId,
      reason
    );
    
    res.json({ match });
  } catch (error: any) {
    console.error('Error recording walkover:', error);
    res.status(400).json({ error: error.message || 'Failed to record walkover' });
  }
};

const recordRetirement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { matchId } = req.params;
    const { retiringPlayerId, score, reason } = req.body;
    
    const match = await matchService.recordRetirement(
      Number(matchId),
      retiringPlayerId,
      score,
      reason
    );
    
    res.json({ match });
  } catch (error: any) {
    console.error('Error recording retirement:', error);
    res.status(400).json({ error: error.message || 'Failed to record retirement' });
  }
};

// Player Match Routes
const getPlayerMatches = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { playerId } = req.params;
    const { tournamentId } = req.query;
    
    const matches = await matchService.getPlayerMatches(
      Number(playerId),
      tournamentId ? Number(tournamentId) : undefined
    );
    
    res.json({ matches });
  } catch (error) {
    console.error('Error fetching player matches:', error);
    res.status(500).json({ error: 'Failed to fetch player matches' });
  }
};

const getMyMatches = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { tournamentId } = req.query;
    
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    const matches = await matchService.getPlayerMatches(
      userId,
      tournamentId ? Number(tournamentId) : undefined
    );
    
    res.json({ matches });
  } catch (error) {
    console.error('Error fetching player matches:', error);
    res.status(500).json({ error: 'Failed to fetch player matches' });
  }
};

export default {
  generateBracket,
  getTournamentBrackets,
  getBracket,
  getBracketStatus,
  getTournamentMatches,
  getMatch,
  scheduleMatch,
  startMatch,
  updateMatchScore,
  completeMatch,
  cancelMatch,
  postponeMatch,
  recordWalkover,
  recordRetirement,
  getPlayerMatches,
  getMyMatches
};