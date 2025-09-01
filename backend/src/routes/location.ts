import { Router } from 'express';
import { authenticate } from '../middleware/auth';
// import locationController from '../controllers/locationController';

const router = Router();

// Location routes temporarily disabled for compilation
// TODO: Enable these when locationService is implemented

// router.post('/geocode', authenticate, locationController.geocodeAddress);
// router.post('/reverse-geocode', authenticate, locationController.reverseGeocode);
// router.post('/locations', authenticate, locationController.createLocation);
// router.get('/locations', authenticate, locationController.getLocations);
// router.put('/locations/:locationId', authenticate, locationController.updateLocation);
// router.delete('/locations/:locationId', authenticate, locationController.deleteLocation);
// router.get('/nearby', authenticate, locationController.findNearbyLocations);
// router.post('/calculate-distance', authenticate, locationController.calculateDistance);

export default router;