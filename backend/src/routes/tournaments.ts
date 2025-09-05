import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import tournamentController from '../controllers/tournamentController';
import categoryController from '../controllers/categoryController';
import tournamentRegistrationController from '../controllers/tournamentRegistrationController';
import refereeController from '../controllers/refereeController';
import tournamentsController from '../controllers/tournamentsController';

const router = Router();

// Tournament Management Routes
router.post('/', authenticate, authorize('admin', 'state', 'club', 'partner'), tournamentController.createTournament);
router.get('/search', tournamentController.searchTournaments);
router.get('/upcoming', tournamentController.getUpcomingTournaments);
router.get('/active', tournamentController.getActiveTournaments);
router.get('/organizer/:organizerId', authenticate, tournamentController.getTournamentsByOrganizer);
router.get('/:id', tournamentController.getTournament);
router.put('/:id', authenticate, tournamentController.updateTournament);
router.delete('/:id', authenticate, tournamentController.deleteTournament);
router.put('/:id/status', authenticate, tournamentController.updateTournamentStatus);
router.get('/:id/statistics', authenticate, tournamentController.getTournamentStatistics);
router.get('/:id/export', authenticate, tournamentController.exportTournamentData);

// Tournament Category Routes
router.post('/:tournamentId/categories', authenticate, categoryController.createCategory);
router.get('/:tournamentId/categories', categoryController.getCategoriesByTournament);
router.put('/categories/:id', authenticate, categoryController.updateCategory);
router.delete('/categories/:id', authenticate, categoryController.deleteCategory);
router.get('/categories/:id', categoryController.getCategoryDetails);
router.put('/categories/:id/toggle-status', authenticate, categoryController.toggleCategoryStatus);

// Tournament Registration Routes
router.post('/:tournamentId/register', authenticate, tournamentRegistrationController.registerForTournament);
router.post('/registrations/:registrationId/confirm-payment', authenticate, tournamentRegistrationController.confirmRegistrationPayment);
router.delete('/registrations/:registrationId', authenticate, tournamentRegistrationController.cancelRegistration);
router.get('/:tournamentId/registrations', authenticate, tournamentRegistrationController.getTournamentRegistrations);
router.get('/my-registrations', authenticate, tournamentRegistrationController.getPlayerRegistrations);
router.post('/registrations/:registrationId/sign-waiver', authenticate, tournamentRegistrationController.signWaiver);
router.post('/registrations/:registrationId/check-in', authenticate, tournamentRegistrationController.checkInPlayer);
router.put('/registrations/:registrationId/seed', authenticate, tournamentRegistrationController.updateRegistrationSeed);

// Bracket Management Routes
router.post('/:tournamentId/categories/:categoryId/bracket', authenticate, tournamentsController.generateBracket);
router.get('/:tournamentId/brackets', tournamentsController.getTournamentBrackets);
router.get('/brackets/:bracketId', tournamentsController.getBracket);
router.get('/brackets/:bracketId/status', tournamentsController.getBracketStatus);

// Match Management Routes
router.get('/:tournamentId/matches', tournamentsController.getTournamentMatches);
router.get('/matches/:matchId', tournamentsController.getMatch);
router.put('/matches/:matchId/schedule', authenticate, tournamentsController.scheduleMatch);
router.post('/matches/:matchId/start', authenticate, tournamentsController.startMatch);
router.put('/matches/:matchId/score', authenticate, tournamentsController.updateMatchScore);
router.post('/matches/:matchId/complete', authenticate, tournamentsController.completeMatch);
router.post('/matches/:matchId/cancel', authenticate, tournamentsController.cancelMatch);
router.post('/matches/:matchId/postpone', authenticate, tournamentsController.postponeMatch);
router.post('/matches/:matchId/walkover', authenticate, tournamentsController.recordWalkover);
router.post('/matches/:matchId/retirement', authenticate, tournamentsController.recordRetirement);

// Player Match Routes
router.get('/players/:playerId/matches', authenticate, tournamentsController.getPlayerMatches);
router.get('/my-matches', authenticate, tournamentsController.getMyMatches);

// Referee Management Routes
router.get('/:tournamentId/referees/available', authenticate, refereeController.getAvailableReferees);
router.post('/matches/:matchId/referee', authenticate, refereeController.assignReferee);
router.delete('/matches/:matchId/referee', authenticate, refereeController.removeReferee);
router.get('/referees/:refereeId/schedule', authenticate, refereeController.getRefereeSchedule);
router.get('/referees/:refereeId/stats', authenticate, refereeController.getRefereeStatistics);

export default router;