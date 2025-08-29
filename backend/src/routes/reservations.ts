import express from 'express';
import { ReservationController } from '../controllers/reservationController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';

const router = express.Router();

// Reservation management routes
router.post('/reservations', 
  authenticate, 
  ReservationController.createReservation
);

router.get('/reservations/my', 
  authenticate, 
  ReservationController.getUserReservations
);

router.get('/reservations/:id', 
  authenticate, 
  ReservationController.getReservationById
);

router.put('/reservations/:id', 
  authenticate, 
  ReservationController.updateReservation
);

router.delete('/reservations/:id/cancel', 
  authenticate, 
  ReservationController.cancelReservation
);

// Payment processing
router.post('/reservations/:id/payment', 
  authenticate, 
  ReservationController.processReservationPayment
);

// Check-in and check-out
router.post('/reservations/:id/checkin', 
  authenticate, 
  ReservationController.checkInReservation
);

router.post('/reservations/:id/checkout', 
  authenticate, 
  ReservationController.checkOutReservation
);

// Availability and conflict detection
router.get('/availability/check', ReservationController.checkAvailability);
router.get('/availability/slots', ReservationController.getAvailableSlots);
router.get('/availability/courts/:courtId', ReservationController.getCourtAvailability);
router.get('/conflicts/detect', ReservationController.detectConflicts);

// Court reservations (for owners/admins)
router.get('/courts/:courtId/reservations', 
  authenticate, 
  authorizeRoles(['club', 'partner', 'federation']), 
  ReservationController.getCourtReservations
);

export default router;