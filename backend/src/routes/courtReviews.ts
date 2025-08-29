import express from 'express';
import { CourtReviewController } from '../controllers/courtReviewController';
import { authenticateToken } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';

const router = express.Router();

// Review creation and management
router.post('/reviews', 
  authenticateToken, 
  CourtReviewController.createReview
);

router.get('/reviews/my', 
  authenticateToken, 
  CourtReviewController.getUserReviews
);

router.get('/reviews/:id', CourtReviewController.getReviewById);

router.put('/reviews/:id', 
  authenticateToken, 
  CourtReviewController.updateReview
);

router.delete('/reviews/:id', 
  authenticateToken, 
  CourtReviewController.deleteReview
);

// Court-specific reviews
router.get('/courts/:courtId/reviews', CourtReviewController.getCourtReviews);
router.get('/courts/:courtId/ratings', CourtReviewController.getCourtRatingsSummary);

// Owner responses to reviews
router.post('/reviews/:id/respond', 
  authenticateToken, 
  authorizeRoles(['club', 'partner', 'federation']), 
  CourtReviewController.respondToReview
);

export default router;