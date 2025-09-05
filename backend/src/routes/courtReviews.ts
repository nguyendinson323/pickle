import express from 'express';
import courtReviewController from '../controllers/courtReviewController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Review creation and management
router.post('/reviews', 
  authenticate, 
  asyncHandler(courtReviewController.createReview)
);

router.get('/reviews/my', 
  authenticate, 
  asyncHandler(courtReviewController.getUserReviews)
);

// Individual review by ID - using getCourtReviews for now as getReviewById doesn't exist
// router.get('/reviews/:id', asyncHandler(courtReviewController.getReviewById));

router.put('/reviews/:id', 
  authenticate, 
  asyncHandler(courtReviewController.updateReview)
);

router.delete('/reviews/:id', 
  authenticate, 
  asyncHandler(courtReviewController.deleteReview)
);

// Court-specific reviews
router.get('/courts/:courtId/reviews', asyncHandler(courtReviewController.getCourtReviews));
// Ratings summary - method doesn't exist in controller
// router.get('/courts/:courtId/ratings', asyncHandler(courtReviewController.getCourtRatingsSummary));

// Owner responses to reviews
router.post('/reviews/:id/respond', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'admin']), 
  asyncHandler(courtReviewController.respondToReview)
);

export default router;