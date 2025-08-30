import express from 'express';
import {
  createCourt,
  getCourts,
  getCourtById,
  updateCourt,
  deleteCourt,
  getCourtsNearLocation,
  getCourtsByOwner,
  updateCourtImages,
  getCourtStats
} from '../controllers/courtController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';

const router = express.Router();

// Court management routes
router.post('/courts', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'federation']), 
  createCourt
);

router.get('/courts', getCourts);
router.get('/courts/:id', getCourtById);

router.put('/courts/:id', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'federation']), 
  updateCourt
);

router.delete('/courts/:id', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'federation']), 
  deleteCourt
);

// Location-based and owner-specific routes
router.get('/courts/near/location', getCourtsNearLocation);
router.get('/courts/owner/:ownerType/:ownerId', getCourtsByOwner);

// Court images
router.put('/courts/:id/images', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'federation']), 
  updateCourtImages
);

// Court statistics
router.get('/courts/:id/stats', getCourtStats);

export default router;