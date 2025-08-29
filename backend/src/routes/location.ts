import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body, param, query } from 'express-validator';
import locationService from '../services/locationService';
import privacyService from '../services/privacyService';
import { PlayerLocation, Player } from '../models';

const router = Router();

// Geocode an address
router.post('/geocode',
  authenticateToken,
  [
    body('address').notEmpty().trim().isLength({ min: 5, max: 500 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const result = await locationService.geocodeAddress(req.body.address, {
        useGoogleMaps: req.body.useGoogleMaps === true
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error geocoding address:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to geocode address'
      });
    }
  }
);

// Reverse geocode coordinates
router.post('/reverse-geocode',
  authenticateToken,
  [
    body('latitude').isFloat({ min: -90, max: 90 }),
    body('longitude').isFloat({ min: -180, max: 180 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const result = await locationService.reverseGeocode(
        req.body.latitude,
        req.body.longitude,
        {
          useGoogleMaps: req.body.useGoogleMaps === true
        }
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reverse geocode coordinates'
      });
    }
  }
);

// Create a new location for the user
router.post('/locations',
  authenticateToken,
  [
    body('latitude').isFloat({ min: -90, max: 90 }),
    body('longitude').isFloat({ min: -180, max: 180 }),
    body('address').notEmpty().trim().isLength({ max: 500 }),
    body('city').notEmpty().trim().isLength({ max: 100 }),
    body('state').notEmpty().trim().isLength({ max: 100 }),
    body('country').optional().trim().isLength({ max: 100 }),
    body('zipCode').optional().trim().isLength({ max: 20 }),
    body('locationName').optional().trim().isLength({ max: 100 }),
    body('radius').optional().isInt({ min: 1, max: 100 }),
    body('isPublic').optional().isBoolean(),
    body('isCurrentLocation').optional().isBoolean()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const player = await Player.findOne({
        where: { userId: req.user!.id }
      });

      if (!player) {
        return res.status(404).json({ error: 'Player profile not found' });
      }

      // Validate coordinates
      const isValid = await locationService.validateCoordinates(req.body.latitude, req.body.longitude);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid coordinates' });
      }

      // Check if location is in Mexico (optional validation)
      const isInMexico = await locationService.isLocationInMexico(req.body.latitude, req.body.longitude);
      if (!isInMexico) {
        console.warn(`Location outside Mexico for player ${player.id}`);
      }

      // If setting as current location, unset other current locations
      if (req.body.isCurrentLocation) {
        await PlayerLocation.update(
          { isCurrentLocation: false },
          { where: { playerId: player.id } }
        );
      }

      const location = await PlayerLocation.create({
        playerId: player.id,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country || 'Mexico',
        zipCode: req.body.zipCode,
        locationName: req.body.locationName,
        radius: req.body.radius || 10,
        isPublic: req.body.isPublic !== false, // default true
        isCurrentLocation: req.body.isCurrentLocation || false,
        lastUpdated: new Date()
      });

      res.status(201).json({
        success: true,
        data: location
      });
    } catch (error) {
      console.error('Error creating location:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create location'
      });
    }
  }
);

// Get user's locations
router.get('/locations',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const player = await Player.findOne({
        where: { userId: req.user!.id }
      });

      if (!player) {
        return res.status(404).json({ error: 'Player profile not found' });
      }

      const locations = await PlayerLocation.findAll({
        where: { playerId: player.id },
        order: [['isCurrentLocation', 'DESC'], ['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: locations
      });
    } catch (error) {
      console.error('Error fetching locations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch locations'
      });
    }
  }
);

// Update a location
router.put('/locations/:locationId',
  authenticateToken,
  [
    param('locationId').isInt({ min: 1 }),
    body('latitude').optional().isFloat({ min: -90, max: 90 }),
    body('longitude').optional().isFloat({ min: -180, max: 180 }),
    body('address').optional().trim().isLength({ max: 500 }),
    body('city').optional().trim().isLength({ max: 100 }),
    body('state').optional().trim().isLength({ max: 100 }),
    body('country').optional().trim().isLength({ max: 100 }),
    body('zipCode').optional().trim().isLength({ max: 20 }),
    body('locationName').optional().trim().isLength({ max: 100 }),
    body('radius').optional().isInt({ min: 1, max: 100 }),
    body('isPublic').optional().isBoolean(),
    body('isCurrentLocation').optional().isBoolean()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const player = await Player.findOne({
        where: { userId: req.user!.id }
      });

      if (!player) {
        return res.status(404).json({ error: 'Player profile not found' });
      }

      const location = await PlayerLocation.findOne({
        where: {
          id: parseInt(req.params.locationId),
          playerId: player.id
        }
      });

      if (!location) {
        return res.status(404).json({ error: 'Location not found' });
      }

      // Validate coordinates if provided
      if (req.body.latitude !== undefined && req.body.longitude !== undefined) {
        const isValid = await locationService.validateCoordinates(req.body.latitude, req.body.longitude);
        if (!isValid) {
          return res.status(400).json({ error: 'Invalid coordinates' });
        }
      }

      // If setting as current location, unset other current locations
      if (req.body.isCurrentLocation) {
        await PlayerLocation.update(
          { isCurrentLocation: false },
          { 
            where: { 
              playerId: player.id,
              id: { [require('sequelize').Op.ne]: location.id }
            } 
          }
        );
      }

      // Update location
      await location.update({
        ...req.body,
        lastUpdated: new Date()
      });

      res.json({
        success: true,
        data: location
      });
    } catch (error) {
      console.error('Error updating location:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update location'
      });
    }
  }
);

// Delete a location
router.delete('/locations/:locationId',
  authenticateToken,
  [
    param('locationId').isInt({ min: 1 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const player = await Player.findOne({
        where: { userId: req.user!.id }
      });

      if (!player) {
        return res.status(404).json({ error: 'Player profile not found' });
      }

      const deleted = await PlayerLocation.destroy({
        where: {
          id: parseInt(req.params.locationId),
          playerId: player.id
        }
      });

      if (deleted === 0) {
        return res.status(404).json({ error: 'Location not found' });
      }

      res.json({
        success: true,
        message: 'Location deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting location:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete location'
      });
    }
  }
);

// Find nearby locations
router.get('/nearby',
  authenticateToken,
  [
    query('latitude').isFloat({ min: -90, max: 90 }),
    query('longitude').isFloat({ min: -180, max: 180 }),
    query('radius').optional().isInt({ min: 1, max: 100 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const player = await Player.findOne({
        where: { userId: req.user!.id }
      });

      if (!player) {
        return res.status(404).json({ error: 'Player profile not found' });
      }

      const latitude = parseFloat(req.query.latitude as string);
      const longitude = parseFloat(req.query.longitude as string);
      const radius = req.query.radius ? parseInt(req.query.radius as string) : 25;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      const nearbyLocations = await locationService.findNearbyLocations(
        latitude,
        longitude,
        radius,
        {
          excludePlayerId: player.id,
          limit
        }
      );

      // Filter locations based on privacy settings
      const filteredLocations = [];
      for (const location of nearbyLocations) {
        const canShow = await privacyService.canShowPlayerInFinder(
          location.playerId,
          player.id,
          location.distance
        );
        
        if (canShow.canShow) {
          // Get privacy settings for location precision
          const privacySettings = await privacyService.getOrCreatePrivacySettings(location.playerId);
          const privacyLocation = locationService.getLocationPrivacyLevel(
            location as any,
            privacySettings.locationPrecision
          );
          
          filteredLocations.push({
            ...location,
            latitude: privacyLocation.latitude,
            longitude: privacyLocation.longitude,
            displayAddress: privacyLocation.displayAddress
          });
        }
      }

      res.json({
        success: true,
        data: filteredLocations,
        meta: {
          searchCenter: { latitude, longitude },
          radius,
          totalFound: filteredLocations.length
        }
      });
    } catch (error) {
      console.error('Error finding nearby locations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to find nearby locations'
      });
    }
  }
);

// Calculate distance between two points
router.post('/calculate-distance',
  authenticateToken,
  [
    body('lat1').isFloat({ min: -90, max: 90 }),
    body('lon1').isFloat({ min: -180, max: 180 }),
    body('lat2').isFloat({ min: -90, max: 90 }),
    body('lon2').isFloat({ min: -180, max: 180 }),
    body('unit').optional().isIn(['km', 'miles'])
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const distance = locationService.calculateDistance(
        req.body.lat1,
        req.body.lon1,
        req.body.lat2,
        req.body.lon2,
        { unit: req.body.unit || 'km' }
      );

      res.json({
        success: true,
        data: {
          distance,
          unit: req.body.unit || 'km'
        }
      });
    } catch (error) {
      console.error('Error calculating distance:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate distance'
      });
    }
  }
);

export default router;