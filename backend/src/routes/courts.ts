import express from 'express';
import { CourtController } from '../controllers/courtController';
import { ReservationController } from '../controllers/reservationController';
import { CourtReviewController } from '../controllers/courtReviewController';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';

const router = express.Router();

// Court management routes
router.post('/courts', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'federation']), 
  CourtController.createCourt
);

router.get('/courts', CourtController.getCourts);
router.get('/courts/:id', CourtController.getCourtById);

router.put('/courts/:id', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'federation']), 
  CourtController.updateCourt
);

router.delete('/courts/:id', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'federation']), 
  CourtController.deleteCourt
);

// Location-based and owner-specific routes
router.get('/courts/near/location', CourtController.getCourtsNearLocation);
router.get('/courts/owner/:ownerType/:ownerId', CourtController.getCourtsByOwner);

// Court images
router.put('/courts/:id/images', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'federation']), 
  CourtController.updateCourtImages
);

// Court statistics
router.get('/courts/:id/stats', CourtController.getCourtStats);

export default router;