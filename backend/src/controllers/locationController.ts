import { Response } from 'express';
import { AuthRequest } from '../types/auth';
// import locationService from '../services/locationService';
// import privacyService from '../services/privacyService';
import { PlayerLocation, Player } from '../models';

// Geocode an address
const geocodeAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    error: 'Geocoding service temporarily disabled'
  });
};

// Reverse geocode coordinates
const reverseGeocode = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    error: 'Reverse geocoding service temporarily disabled'
  });
};

// Create a new location for the user
const createLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
    }

    // Validate coordinates (temporarily disabled)
    // const isValid = await locationService.validateCoordinates(req.body.latitude, req.body.longitude);
    // if (!isValid) {
    //   res.status(400).json({ error: 'Invalid coordinates' });
    //   return;
    // }

    // Check if location is in Mexico (optional validation)
    // const isInMexico = await locationService.isLocationInMexico(req.body.latitude, req.body.longitude);
    // if (!isInMexico) {
    //   console.warn(`Location outside Mexico for player ${player.id}`);
    // }

    // If setting as current location, unset other current locations
    if (req.body.isCurrentLocation) {
      await PlayerLocation.update(
        { isCurrentLocation: false },
        { where: { userId: req.user.userId } }
      );
    }

    const location = await PlayerLocation.create({
      userId: req.user.userId,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country || 'Mexico',
      zipCode: req.body.zipCode,
      locationName: req.body.locationName,
      searchRadius: req.body.searchRadius || 25,
      isCurrentLocation: req.body.isCurrentLocation || false,
      isTravelLocation: req.body.isTravelLocation || false,
      travelStartDate: req.body.travelStartDate,
      travelEndDate: req.body.travelEndDate,
      privacyLevel: req.body.privacyLevel || 'city',
      isActive: req.body.isActive !== false,
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
};

// Get user's locations
const getLocations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
    }

    const locations = await PlayerLocation.findAll({
      where: { userId: req.user.userId },
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
};

// Update a location
const updateLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
    }

    const location = await PlayerLocation.findOne({
      where: {
        id: parseInt(req.params.locationId),
        userId: req.user.userId
      }
    });

    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    // Validate coordinates if provided (temporarily disabled)
    // if (req.body.latitude !== undefined && req.body.longitude !== undefined) {
    //   const isValid = await locationService.validateCoordinates(req.body.latitude, req.body.longitude);
    //   if (!isValid) {
    //     res.status(400).json({ error: 'Invalid coordinates' });
    //     return;
    //   }
    // }

    // If setting as current location, unset other current locations
    if (req.body.isCurrentLocation) {
      await PlayerLocation.update(
        { isCurrentLocation: false },
        { 
          where: { 
            userId: req.user.userId,
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
};

// Delete a location
const deleteLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.userId }
    });

    if (!player) {
      res.status(404).json({ error: 'Player profile not found' });
      return;
    }

    const deleted = await PlayerLocation.destroy({
      where: {
        id: parseInt(req.params.locationId),
        userId: req.user.userId
      }
    });

    if (deleted === 0) {
      res.status(404).json({ error: 'Location not found' });
      return;
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
};

// Find nearby locations
const findNearbyLocations = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    error: 'Nearby locations service temporarily disabled'
  });
};

// Calculate distance between two points
const calculateDistance = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    error: 'Distance calculation service temporarily disabled'
  });
};

export default {
  geocodeAddress,
  reverseGeocode,
  createLocation,
  getLocations,
  updateLocation,
  deleteLocation,
  findNearbyLocations,
  calculateDistance
};