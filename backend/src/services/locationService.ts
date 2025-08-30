// LocationService - Geolocation and distance calculation service
import { PlayerLocation } from '../models';

interface GeocodingResult {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  accuracy?: number;
}

interface GeocodeOptions {
  timeout?: number;
  useGoogleMaps?: boolean;
}

interface DistanceCalculationOptions {
  unit?: 'km' | 'miles';
}

class LocationService {
  private readonly GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  private readonly NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
  private readonly EARTH_RADIUS_KM = 6371;
  private readonly EARTH_RADIUS_MILES = 3959;

  async geocodeAddress(
    address: string, 
    options: GeocodeOptions = {}
  ): Promise<GeocodingResult> {
    // Placeholder implementation - geocoding services disabled
    console.warn('Geocoding service disabled - using placeholder coordinates');
    
    return {
      latitude: 19.4326, // Mexico City coordinates as default
      longitude: -99.1332,
      address: address,
      city: 'Ciudad de México',
      state: 'CDMX',
      country: 'Mexico',
      accuracy: 0.5
    };
  }

  async reverseGeocode(
    latitude: number, 
    longitude: number, 
    options: GeocodeOptions = {}
  ): Promise<GeocodingResult> {
    // Placeholder implementation - reverse geocoding disabled
    console.warn('Reverse geocoding service disabled - using placeholder address');
    
    return {
      latitude,
      longitude,
      address: `Coordinates: ${latitude}, ${longitude}`,
      city: 'Ciudad de México',
      state: 'CDMX',
      country: 'Mexico'
    };
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    options: DistanceCalculationOptions = {}
  ): number {
    const { unit = 'km' } = options;
    const radius = unit === 'km' ? this.EARTH_RADIUS_KM : this.EARTH_RADIUS_MILES;

    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = radius * c;

    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  async findNearbyLocations(
    centerLatitude: number,
    centerLongitude: number,
    radiusKm: number,
    options: {
      includeInactive?: boolean;
      limit?: number;
      excludePlayerId?: number;
    } = {}
  ): Promise<Array<PlayerLocation & { distance: number }>> {
    const { includeInactive = false, limit = 50, excludePlayerId } = options;
    const { Op } = require('sequelize');

    // Build where conditions
    const whereConditions: any = {
      isPublic: true
    };

    if (!includeInactive) {
      whereConditions.isCurrentLocation = true;
    }

    if (excludePlayerId) {
      whereConditions.playerId = {
        [Op.ne]: excludePlayerId
      };
    }

    // Get all locations (we'll filter by distance afterwards)
    const locations = await PlayerLocation.findAll({
      where: whereConditions,
      limit: limit * 2, // Get more to account for distance filtering
      include: [
        {
          model: require('../models').Player,
          as: 'player',
          include: [
            {
              model: require('../models').User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'profileImageUrl']
            }
          ]
        }
      ]
    });

    // Calculate distances and filter by radius
    const locationsWithDistance = locations
      .map(location => {
        const distance = this.calculateDistance(
          centerLatitude,
          centerLongitude,
          location.latitude,
          location.longitude
        );

        return {
          ...location.toJSON(),
          distance
        };
      })
      .filter(location => location.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    return locationsWithDistance as any;
  }

  async validateCoordinates(latitude: number, longitude: number): Promise<boolean> {
    return (
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }

  async isLocationInMexico(latitude: number, longitude: number): Promise<boolean> {
    // Mexico approximate boundaries
    const mexicoBounds = {
      north: 32.72,
      south: 14.53,
      east: -86.71,
      west: -118.40
    };

    return (
      latitude >= mexicoBounds.south &&
      latitude <= mexicoBounds.north &&
      longitude >= mexicoBounds.west &&
      longitude <= mexicoBounds.east
    );
  }

  formatLocationForDisplay(location: PlayerLocation): string {
    const parts = [];
    
    if (location.locationName) {
      parts.push(location.locationName);
    }
    
    if (location.city) {
      parts.push(location.city);
    }
    
    if (location.state) {
      parts.push(location.state);
    }

    return parts.join(', ');
  }

  getLocationPrivacyLevel(
    location: PlayerLocation,
    precision: 'exact' | 'approximate' | 'city_only'
  ): { latitude: number; longitude: number; displayAddress: string } {
    switch (precision) {
      case 'exact':
        return {
          latitude: location.latitude,
          longitude: location.longitude,
          displayAddress: location.address
        };
      
      case 'approximate':
        // Add small random offset (within ~1km)
        const latOffset = (Math.random() - 0.5) * 0.018; // ~1km in degrees
        const lonOffset = (Math.random() - 0.5) * 0.018;
        
        return {
          latitude: location.latitude + latOffset,
          longitude: location.longitude + lonOffset,
          displayAddress: `Cerca de ${location.city}, ${location.state}`
        };
      
      case 'city_only':
        // Return city center coordinates (simplified)
        return {
          latitude: Math.floor(location.latitude * 10) / 10,
          longitude: Math.floor(location.longitude * 10) / 10,
          displayAddress: `${location.city}, ${location.state}`
        };
      
      default:
        return this.getLocationPrivacyLevel(location, 'approximate');
    }
  }
}

export default new LocationService();