import { Router } from 'express';
import { auth, roleAuth } from '../middleware/auth';
import tournamentController from '../controllers/tournamentController';
import categoryController from '../controllers/categoryController';
import tournamentRegistrationController from '../controllers/tournamentRegistrationController';
import refereeController from '../controllers/refereeController';
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

const router = Router();

// Tournament Management Routes
router.post('/', auth, roleAuth(['admin', 'state', 'club', 'partner']), tournamentController.createTournament);
router.get('/search', tournamentController.searchTournaments);
router.get('/upcoming', tournamentController.getUpcomingTournaments);
router.get('/active', tournamentController.getActiveTournaments);
router.get('/organizer/:organizerId', auth, tournamentController.getTournamentsByOrganizer);
router.get('/:id', tournamentController.getTournament);
router.put('/:id', auth, tournamentController.updateTournament);
router.delete('/:id', auth, tournamentController.deleteTournament);
router.put('/:id/status', auth, tournamentController.updateTournamentStatus);
router.get('/:id/statistics', auth, tournamentController.getTournamentStatistics);
router.get('/:id/export', auth, tournamentController.exportTournamentData);

// Tournament Category Routes
router.post('/:tournamentId/categories', auth, categoryController.createCategory);
router.get('/:tournamentId/categories', categoryController.getCategoriesByTournament);
router.put('/categories/:id', auth, categoryController.updateCategory);
router.delete('/categories/:id', auth, categoryController.deleteCategory);
router.get('/categories/:id', categoryController.getCategoryDetails);
router.put('/categories/:id/toggle-status', auth, categoryController.toggleCategoryStatus);

// Tournament Registration Routes
router.post('/:tournamentId/register', auth, tournamentRegistrationController.registerForTournament);
router.post('/registrations/:registrationId/confirm-payment', auth, tournamentRegistrationController.confirmRegistrationPayment);
router.delete('/registrations/:registrationId', auth, tournamentRegistrationController.cancelRegistration);
router.get('/:tournamentId/registrations', auth, tournamentRegistrationController.getTournamentRegistrations);
router.get('/my-registrations', auth, tournamentRegistrationController.getPlayerRegistrations);
router.post('/registrations/:registrationId/sign-waiver', auth, tournamentRegistrationController.signWaiver);
router.post('/registrations/:registrationId/check-in', auth, tournamentRegistrationController.checkInPlayer);
router.put('/registrations/:registrationId/seed', auth, tournamentRegistrationController.updateRegistrationSeed);

// Bracket Management Routes
router.post('/:tournamentId/categories/:categoryId/bracket', auth, async (req, res) => {
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
});

router.get('/:tournamentId/brackets', async (req, res) => {
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
});

router.get('/brackets/:bracketId', async (req, res) => {
  try {
    const { bracketId } = req.params;
    
    const bracket = await TournamentBracket.findByPk(bracketId, {
      include: [
        { model: TournamentMatch, as: 'matches' },
        { model: TournamentCategory, as: 'category' }
      ]
    });
    
    if (!bracket) {
      return res.status(404).json({ error: 'Bracket not found' });
    }
    
    res.json({ bracket });
  } catch (error) {
    console.error('Error fetching bracket:', error);
    res.status(500).json({ error: 'Failed to fetch bracket' });
  }
});

router.get('/brackets/:bracketId/status', async (req, res) => {
  try {
    const { bracketId } = req.params;
    
    const status = await bracketService.getBracketStatus(Number(bracketId));
    
    res.json({ status });
  } catch (error: any) {
    console.error('Error fetching bracket status:', error);
    res.status(400).json({ error: error.message || 'Failed to fetch bracket status' });
  }
});

// Match Management Routes
router.get('/:tournamentId/matches', async (req, res) => {
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
});

router.get('/matches/:matchId', async (req, res) => {
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
      return res.status(404).json({ error: 'Match not found' });
    }
    
    res.json({ match });
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ error: 'Failed to fetch match' });
  }
});

router.put('/matches/:matchId/schedule', auth, async (req, res) => {
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
});

router.post('/matches/:matchId/start', auth, async (req, res) => {
  try {
    const { matchId } = req.params;
    
    const match = await matchService.startMatch(Number(matchId));
    
    res.json({ match });
  } catch (error: any) {
    console.error('Error starting match:', error);
    res.status(400).json({ error: error.message || 'Failed to start match' });
  }
});

router.put('/matches/:matchId/score', auth, async (req, res) => {
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
});

router.post('/matches/:matchId/complete', auth, async (req, res) => {
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
});

router.post('/matches/:matchId/cancel', auth, async (req, res) => {
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
});

router.post('/matches/:matchId/postpone', auth, async (req, res) => {
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
});

router.post('/matches/:matchId/walkover', auth, async (req, res) => {
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
});

router.post('/matches/:matchId/retirement', auth, async (req, res) => {
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
});

// Player Match Routes
router.get('/players/:playerId/matches', auth, async (req, res) => {
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
});

router.get('/my-matches', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { tournamentId } = req.query;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
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
});

// Referee Management Routes
router.get('/:tournamentId/referees/available', auth, refereeController.getAvailableReferees);
router.post('/matches/:matchId/referee', auth, refereeController.assignReferee);
router.delete('/matches/:matchId/referee', auth, refereeController.removeReferee);
router.post('/matches/:matchId/referee-request', auth, refereeController.requestReferee);
router.post('/matches/:matchId/accept-referee', auth, refereeController.acceptRefereeAssignment);
router.post('/matches/:matchId/decline-referee', auth, refereeController.declineRefereeAssignment);
router.get('/referees/:refereeId/schedule', auth, refereeController.getRefereeSchedule);
router.get('/my-referee-schedule', auth, refereeController.getMyRefereeSchedule);
router.get('/referees/:refereeId/stats', auth, refereeController.getRefereeStats);
router.get('/my-referee-stats', auth, refereeController.getMyRefereeStats);
router.get('/referees/:refereeId/performance', auth, refereeController.getRefereePerformance);
router.get('/referees/top', refereeController.getTopReferees);
router.get('/referees/check-availability', refereeController.checkAvailability);

export default router;