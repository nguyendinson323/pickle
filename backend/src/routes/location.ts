import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import locationController from '../controllers/locationController';

const router = Router();

// Geocode an address
router.post('/geocode', authenticate, locationController.geocodeAddress);

// Reverse geocode coordinates
router.post('/reverse-geocode', authenticate, locationController.reverseGeocode);

// Create a new location for the user
router.post('/locations', authenticate, locationController.createLocation);

// Get user's locations
router.get('/locations', authenticate, locationController.getLocations);

// Update a location
router.put('/locations/:locationId', authenticate, locationController.updateLocation);

// Delete a location
router.delete('/locations/:locationId', authenticate, locationController.deleteLocation);

// Find nearby locations
router.get('/nearby', authenticate, locationController.findNearbyLocations);

// Calculate distance between two points
router.post('/calculate-distance', authenticate, locationController.calculateDistance);

export default router;