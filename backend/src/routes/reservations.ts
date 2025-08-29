import express from 'express';
import { ReservationController } from '../controllers/reservationController';
import { authenticateToken } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';

const router = express.Router();

// Reservation management routes
router.post('/reservations', 
  authenticateToken, 
  ReservationController.createReservation
);

router.get('/reservations/my', 
  authenticateToken, 
  ReservationController.getUserReservations
);

router.get('/reservations/:id', 
  authenticateToken, 
  ReservationController.getReservationById
);

router.put('/reservations/:id', 
  authenticateToken, 
  ReservationController.updateReservation
);

router.delete('/reservations/:id/cancel', 
  authenticateToken, 
  ReservationController.cancelReservation
);

// Payment processing
router.post('/reservations/:id/payment', 
  authenticateToken, 
  ReservationController.processReservationPayment
);

// Check-in and check-out
router.post('/reservations/:id/checkin', 
  authenticateToken, 
  ReservationController.checkInReservation
);

router.post('/reservations/:id/checkout', 
  authenticateToken, 
  ReservationController.checkOutReservation
);

// Availability and conflict detection
router.get('/availability/check', ReservationController.checkAvailability);
router.get('/availability/slots', ReservationController.getAvailableSlots);
router.get('/availability/courts/:courtId', ReservationController.getCourtAvailability);
router.get('/conflicts/detect', ReservationController.detectConflicts);

// Court reservations (for owners/admins)
router.get('/courts/:courtId/reservations', 
  authenticateToken, 
  authorizeRoles(['club', 'partner', 'federation']), 
  ReservationController.getCourtReservations
);

export default router;