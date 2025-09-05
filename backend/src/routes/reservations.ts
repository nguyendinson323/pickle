import express from 'express';
import { ReservationController } from '../controllers/reservationController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Reservation management routes
router.post('/reservations', 
  authenticate, 
  asyncHandler(ReservationController.createReservation)
);

router.get('/reservations/my', 
  authenticate, 
  asyncHandler(ReservationController.getUserReservations)
);

router.get('/reservations/:id', 
  authenticate, 
  asyncHandler(ReservationController.getReservationById)
);

router.put('/reservations/:id', 
  authenticate, 
  asyncHandler(ReservationController.updateReservation)
);

router.delete('/reservations/:id/cancel', 
  authenticate, 
  asyncHandler(ReservationController.cancelReservation)
);

// Payment processing
router.post('/reservations/:id/payment', 
  authenticate, 
  asyncHandler(ReservationController.processReservationPayment)
);

// Check-in and check-out
router.post('/reservations/:id/checkin', 
  authenticate, 
  asyncHandler(ReservationController.checkInReservation)
);

router.post('/reservations/:id/checkout', 
  authenticate, 
  asyncHandler(ReservationController.checkOutReservation)
);

// Availability and conflict detection
router.get('/availability/check', asyncHandler(ReservationController.checkAvailability));
router.get('/availability/slots', asyncHandler(ReservationController.getAvailableSlots));
router.get('/availability/courts/:courtId', asyncHandler(ReservationController.getCourtAvailability));
router.get('/conflicts/detect', asyncHandler(ReservationController.detectConflicts));

// Court reservations (for owners/admins)
router.get('/courts/:courtId/reservations', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'admin']), 
  asyncHandler(ReservationController.getCourtReservations)
);

export default router;