import axios from 'axios';
import NodeCache from 'node-cache';
import { QueryTypes } from 'sequelize';
import sequelize from '../config/database';
import User from '../models/User';
import Player from '../models/Player';
import PlayerLocation from '../models/PlayerLocation';

// Cache geocoding results for 24 hours to reduce API calls
const geocodingCache = new NodeCache({ stdTTL: 86400 });

interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
}

interface NearbyPlayer {
  userId: number;
  distance: number;
  user: any;
  location: any;
}

class LocationService {
  /**
   * Get coordinates from address using free OpenStreetMap Nominatim API
   * Alternative to Google Geocoding API
   */
  async geocodeAddress(address: string): Promise<LocationData | null> {
    const cacheKey = `geocode_${address}`;
    const cached = geocodingCache.get(cacheKey);
    
    if (cached) {
      return cached as LocationData;
    }

    try {
      // Using OpenStreetMap Nominatim (free alternative to Google)
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: address,
          format: 'json',
          addressdetails: 1,
          limit: 1,
          countrycodes: 'mx', // Restrict to Mexico
        },
        headers: {
          'User-Agent': 'Mexican-Pickleball-Federation/1.0'
        }
      });

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        const locationData: LocationData = {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          city: result.address?.city || result.address?.town || result.address?.village || 'Unknown',
          state: result.address?.state || 'Unknown',
          country: result.address?.country || 'Mexico'
        };

        // Cache the result
        geocodingCache.set(cacheKey, locationData);
        
        return locationData;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }

    return null;
  }

  /**
   * Calculate distance between two points using Haversine formula
   * No API calls needed - pure math calculation
   */
  calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Find nearby players using database geospatial queries
   * No external API calls needed
   */
  async findNearbyPlayers(
    centerLat: number,
    centerLon: number,
    radiusKm: number,
    filters: {
      excludeUserId?: number;
      nrtpLevel?: string[];
      gender?: string;
      ageRange?: { min: number; max: number };
    } = {}
  ): Promise<NearbyPlayer[]> {
    try {
      // Using raw SQL with PostgreSQL earth distance functions
      // This is more efficient than Google Maps API for our use case
      let query = `
        SELECT 
          u.id as user_id,
          u.username,
          u.email,
          p.full_name,
          p.nrtp_level,
          p.gender,
          p.date_of_birth,
          p.can_be_found,
          p.profile_photo_url,
          pl.city,
          pl.state,
          pl.privacy_level,
          pl.latitude,
          pl.longitude,
          (6371 * acos(
            cos(radians($1)) * 
            cos(radians(pl.latitude)) * 
            cos(radians(pl.longitude) - radians($2)) + 
            sin(radians($1)) * 
            sin(radians(pl.latitude))
          )) AS distance
        FROM users u
        JOIN players p ON u.id = p.user_id  
        JOIN player_locations pl ON u.id = pl.user_id
        WHERE 
          u.is_active = true
          AND p.can_be_found = true
          AND pl.is_active = true
          AND pl.is_current_location = true
          AND (6371 * acos(
            cos(radians($1)) * 
            cos(radians(pl.latitude)) * 
            cos(radians(pl.longitude) - radians($2)) + 
            sin(radians($1)) * 
            sin(radians(pl.latitude))
          )) <= $3
      `;

      const queryParams = [centerLat, centerLon, radiusKm];
      let paramCount = 3;

      if (filters.excludeUserId) {
        paramCount++;
        query += ` AND u.id != $${paramCount}`;
        queryParams.push(filters.excludeUserId);
      }

      if (filters.gender && filters.gender !== 'any') {
        paramCount++;
        query += ` AND p.gender = $${paramCount}`;
        queryParams.push(filters.gender as any);
      }

      if (filters.nrtpLevel && filters.nrtpLevel.length > 0) {
        paramCount++;
        query += ` AND p.nrtp_level = ANY($${paramCount}::varchar[])`;
        queryParams.push(filters.nrtpLevel as any);
      }

      if (filters.ageRange) {
        const currentDate = new Date();
        const minBirthYear = currentDate.getFullYear() - filters.ageRange.max;
        const maxBirthYear = currentDate.getFullYear() - filters.ageRange.min;
        
        paramCount++;
        query += ` AND EXTRACT(YEAR FROM p.date_of_birth) BETWEEN $${paramCount}`;
        queryParams.push(minBirthYear);
        
        paramCount++;
        query += ` AND $${paramCount}`;
        queryParams.push(maxBirthYear);
      }

      query += `
        ORDER BY distance ASC
        LIMIT 50
      `;

      const results = await sequelize.query(query, {
        bind: queryParams,
        type: QueryTypes.SELECT
      }) as any[];

      return results.map(row => ({
        userId: row.user_id,
        distance: parseFloat(row.distance),
        user: {
          id: row.user_id,
          username: row.username,
          email: row.email,
          playerProfile: {
            fullName: row.full_name,
            nrtpLevel: row.nrtp_level,
            gender: row.gender,
            dateOfBirth: row.date_of_birth,
            canBeFound: row.can_be_found,
            profilePhotoUrl: row.profile_photo_url
          }
        },
        location: {
          city: row.city,
          state: row.state,
          privacyLevel: row.privacy_level,
          // Only include exact coordinates if privacy allows
          latitude: row.privacy_level === 'exact' ? parseFloat(row.latitude) : null,
          longitude: row.privacy_level === 'exact' ? parseFloat(row.longitude) : null
        }
      }));
    } catch (error) {
      console.error('Error finding nearby players:', error);
      return [];
    }
  }

  /**
   * Get city/state coordinates from common Mexican locations
   * No external API needed for common cities
   */
  async getMexicanLocationCoordinates(city: string, state: string): Promise<{
    latitude: number;
    longitude: number;
  } | null> {
    // Common Mexican cities coordinates (to reduce API calls)
    const commonMexicanCities: Record<string, Record<string, { lat: number; lng: number }>> = {
      'Ciudad de México': {
        'Ciudad de México': { lat: 19.4326, lng: -99.1332 }
      },
      'Guadalajara': {
        'Jalisco': { lat: 20.6597, lng: -103.3496 }
      },
      'Monterrey': {
        'Nuevo León': { lat: 25.6866, lng: -100.3161 }
      },
      'Puebla': {
        'Puebla': { lat: 19.0414, lng: -98.2063 }
      },
      'Tijuana': {
        'Baja California': { lat: 32.5149, lng: -117.0382 }
      },
      'León': {
        'Guanajuato': { lat: 21.1619, lng: -101.6743 }
      },
      'Juárez': {
        'Chihuahua': { lat: 31.6904, lng: -106.4245 }
      },
      'Cancún': {
        'Quintana Roo': { lat: 21.1619, lng: -86.8515 }
      },
      'Mérida': {
        'Yucatán': { lat: 20.9674, lng: -89.5926 }
      },
      'Mexicali': {
        'Baja California': { lat: 32.6519, lng: -115.4681 }
      }
    };

    // Check if city is in our common cities database
    const cityKey = Object.keys(commonMexicanCities).find(key => 
      key.toLowerCase().includes(city.toLowerCase())
    );
    
    if (cityKey) {
      const stateKey = Object.keys(commonMexicanCities[cityKey]).find(key =>
        key.toLowerCase().includes(state.toLowerCase())
      );
      
      if (stateKey) {
        const coords = commonMexicanCities[cityKey][stateKey];
        return { latitude: coords.lat, longitude: coords.lng };
      }
    }

    // Fallback to Nominatim for locations not in our database
    const geocoded = await this.geocodeAddress(`${city}, ${state}, Mexico`);
    if (geocoded) {
      return {
        latitude: geocoded.latitude,
        longitude: geocoded.longitude
      };
    }

    return null;
  }

  /**
   * Reverse geocode coordinates to get address information
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<LocationData | null> {
    const cacheKey = `reverse_${latitude}_${longitude}`;
    const cached = geocodingCache.get(cacheKey);
    
    if (cached) {
      return cached as LocationData;
    }

    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat: latitude,
          lon: longitude,
          format: 'json',
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'Mexican-Pickleball-Federation/1.0'
        }
      });

      if (response.data && response.data.address) {
        const address = response.data.address;
        const locationData: LocationData = {
          latitude,
          longitude,
          city: address.city || address.town || address.village || 'Unknown',
          state: address.state || 'Unknown',
          country: address.country || 'Mexico'
        };

        geocodingCache.set(cacheKey, locationData);
        return locationData;
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }

    return null;
  }

  /**
   * Validate coordinates are within Mexico bounds
   */
  isWithinMexico(latitude: number, longitude: number): boolean {
    // Mexico's approximate bounding box
    const mexicoBounds = {
      north: 32.7186,
      south: 14.5388,
      east: -86.7104,
      west: -118.4662
    };

    return latitude >= mexicoBounds.south && 
           latitude <= mexicoBounds.north && 
           longitude >= mexicoBounds.west && 
           longitude <= mexicoBounds.east;
  }

  /**
   * Get distance between two cities (cached for performance)
   */
  async getCityDistance(
    city1: string, state1: string,
    city2: string, state2: string
  ): Promise<number | null> {
    const coords1 = await this.getMexicanLocationCoordinates(city1, state1);
    const coords2 = await this.getMexicanLocationCoordinates(city2, state2);

    if (coords1 && coords2) {
      return this.calculateDistance(
        coords1.latitude, coords1.longitude,
        coords2.latitude, coords2.longitude
      );
    }

    return null;
  }

  /**
   * Format location for display based on privacy level
   */
  formatLocationForDisplay(location: any): string {
    switch (location.privacyLevel) {
      case 'exact':
        return location.address || `${location.city}, ${location.state}`;
      case 'city':
        return `${location.city}, ${location.state}`;
      case 'state':
        return location.state;
      default:
        return `${location.city}, ${location.state}`;
    }
  }
}

export default new LocationService();