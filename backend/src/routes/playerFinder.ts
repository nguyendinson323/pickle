import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createFinderRequest,
  getUserFinderRequests,
  getUserMatches,
  respondToMatch,
  getMatchDetails,
  getUserLocation,
  updateUserLocation,
  cancelFinderRequest,
  triggerMatchSearch
} from '../controllers/playerFinderController';

const router = Router();

// All player finder routes require authentication
router.use(authenticate);

// Player finder requests
router.post('/requests', createFinderRequest);
router.get('/requests', getUserFinderRequests);
router.delete('/requests/:requestId', cancelFinderRequest);
router.post('/requests/:requestId/search', triggerMatchSearch);

// Player matches
router.get('/matches', getUserMatches);
router.post('/matches/:matchId/respond', respondToMatch);
router.get('/matches/:matchId', getMatchDetails);

// Location management
router.get('/location', getUserLocation);
router.post('/location', updateUserLocation);

export default router;