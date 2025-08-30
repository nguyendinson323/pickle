import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import playerFinderController from '../controllers/playerFinderController';

const router = Router();

// Create a new finder request
router.post('/requests', authenticate, playerFinderController.createFinderRequest);

// Get active finder requests with filters
router.get('/requests', authenticate, playerFinderController.getActiveRequests);

// Get user's own finder requests
router.get('/my-requests', authenticate, playerFinderController.getMyRequests);

// Get matches for current user
router.get('/matches', authenticate, playerFinderController.getMatches);

// Get matches for a specific request
router.get('/requests/:requestId/matches', authenticate, playerFinderController.getRequestMatches);

// Accept or decline a match
router.patch('/matches/:matchId', authenticate, playerFinderController.updateMatchStatus);

// Cancel a finder request
router.patch('/requests/:requestId/cancel', authenticate, playerFinderController.cancelRequest);

// Force find new matches for a request
router.post('/requests/:requestId/find-matches', authenticate, playerFinderController.findMatches);

export default router;