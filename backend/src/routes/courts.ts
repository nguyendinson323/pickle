import express from 'express';
import {
  // Facility endpoints
  searchFacilities,
  getFacilityById,
  getFacilityAnalytics,
  
  // Court endpoints
  getCourtById,
  getCourtsByFacility,
  
  // Availability endpoints
  checkCourtAvailability,
  getAvailableSlots,
  calculateBookingPrice,
  
  // Booking endpoints
  createBooking,
  cancelBooking,
  checkInBooking,
  getBookingById,
  getUserBookingHistory
} from '../controllers/courtController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';

const router = express.Router();

// FACILITY MANAGEMENT ROUTES
router.get('/facilities/search', searchFacilities);
router.get('/facilities/:id', getFacilityById);
router.get('/facilities/:facilityId/analytics', 
  authenticate,
  authorizeRoles(['club', 'partner', 'federation', 'admin']),
  getFacilityAnalytics
);

// COURT SPECIFIC ROUTES
router.get('/courts/:id', getCourtById);
router.get('/facilities/:facilityId/courts', getCourtsByFacility);

// AVAILABILITY AND PRICING ROUTES
router.get('/availability/check', checkCourtAvailability);
router.get('/availability/slots', getAvailableSlots);
router.get('/pricing/calculate', calculateBookingPrice);

// BOOKING MANAGEMENT ROUTES
router.post('/bookings', 
  authenticate,
  createBooking
);

router.put('/bookings/:id/cancel', 
  authenticate,
  cancelBooking
);

router.put('/bookings/:id/checkin', 
  authenticate,
  checkInBooking
);

router.get('/bookings/:id', 
  authenticate,
  getBookingById
);

router.get('/bookings/history/user', 
  authenticate,
  getUserBookingHistory
);

export default router;