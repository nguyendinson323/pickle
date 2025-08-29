import axios from 'axios';
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
    const { useGoogleMaps = false, timeout = 5000 } = options;

    try {
      if (useGoogleMaps && this.GOOGLE_MAPS_API_KEY) {
        return await this.geocodeWithGoogleMaps(address, timeout);
      } else {
        return await this.geocodeWithNominatim(address, timeout);
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
      throw new Error('Unable to geocode address');
    }
  }

  private async geocodeWithGoogleMaps(address: string, timeout: number): Promise<GeocodingResult> {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    const params = {
      address,
      key: this.GOOGLE_MAPS_API_KEY,
      region: 'mx' // Bias towards Mexico
    };

    const response = await axios.get(url, {
      params,
      timeout
    });

    if (response.data.status !== 'OK' || !response.data.results?.length) {
      throw new Error(`Google Maps geocoding failed: ${response.data.status}`);
    }

    const result = response.data.results[0];
    const { lat, lng } = result.geometry.location;
    const { accuracy } = result.geometry.location_type === 'ROOFTOP' ? { accuracy: 1 } : 
                       result.geometry.location_type === 'RANGE_INTERPOLATED' ? { accuracy: 0.8 } :
                       result.geometry.location_type === 'GEOMETRIC_CENTER' ? { accuracy: 0.6 } :
                       { accuracy: 0.4 };

    const components = result.address_components;
    const city = this.extractComponent(components, ['locality', 'administrative_area_level_2']);
    const state = this.extractComponent(components, ['administrative_area_level_1']);
    const country = this.extractComponent(components, ['country']);
    const zipCode = this.extractComponent(components, ['postal_code']);

    return {
      latitude: lat,
      longitude: lng,
      address: result.formatted_address,
      city: city || '',
      state: state || '',
      zipCode,
      country: country || 'Mexico',
      accuracy
    };
  }

  private async geocodeWithNominatim(address: string, timeout: number): Promise<GeocodingResult> {
    const url = `${this.NOMINATIM_BASE_URL}/search`;
    const params = {
      q: address,
      format: 'json',
      addressdetails: 1,
      limit: 1,
      countrycodes: 'mx', // Restrict to Mexico
      'accept-language': 'es,en'
    };

    const response = await axios.get(url, {
      params,
      timeout,
      headers: {
        'User-Agent': 'PickleballApp/1.0'
      }
    });

    if (!response.data?.length) {
      throw new Error('No results found for address');
    }

    const result = response.data[0];
    const address_details = result.address || {};

    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      address: result.display_name,
      city: address_details.city || address_details.town || address_details.village || '',
      state: address_details.state || '',
      zipCode: address_details.postcode,
      country: address_details.country || 'Mexico',
      accuracy: this.estimateNominatimAccuracy(result.type)
    };
  }

  private extractComponent(components: any[], types: string[]): string | undefined {
    for (const component of components) {
      if (types.some(type => component.types.includes(type))) {
        return component.long_name;
      }
    }
    return undefined;
  }

  private estimateNominatimAccuracy(type: string): number {
    const accuracyMap: Record<string, number> = {
      'house': 1,
      'building': 0.9,
      'residential': 0.8,
      'road': 0.7,
      'neighbourhood': 0.6,
      'suburb': 0.5,
      'city': 0.4,
      'town': 0.4,
      'village': 0.4,
      'administrative': 0.3
    };

    return accuracyMap[type] || 0.5;
  }

  async reverseGeocode(
    latitude: number, 
    longitude: number, 
    options: GeocodeOptions = {}
  ): Promise<GeocodingResult> {
    const { useGoogleMaps = false, timeout = 5000 } = options;

    try {
      if (useGoogleMaps && this.GOOGLE_MAPS_API_KEY) {
        return await this.reverseGeocodeWithGoogleMaps(latitude, longitude, timeout);
      } else {
        return await this.reverseGeocodeWithNominatim(latitude, longitude, timeout);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      throw new Error('Unable to reverse geocode coordinates');
    }
  }

  private async reverseGeocodeWithGoogleMaps(
    latitude: number, 
    longitude: number, 
    timeout: number
  ): Promise<GeocodingResult> {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    const params = {
      latlng: `${latitude},${longitude}`,
      key: this.GOOGLE_MAPS_API_KEY,
      region: 'mx'
    };

    const response = await axios.get(url, { params, timeout });

    if (response.data.status !== 'OK' || !response.data.results?.length) {
      throw new Error(`Google Maps reverse geocoding failed: ${response.data.status}`);
    }

    const result = response.data.results[0];
    const components = result.address_components;
    const city = this.extractComponent(components, ['locality', 'administrative_area_level_2']);
    const state = this.extractComponent(components, ['administrative_area_level_1']);
    const country = this.extractComponent(components, ['country']);
    const zipCode = this.extractComponent(components, ['postal_code']);

    return {
      latitude,
      longitude,
      address: result.formatted_address,
      city: city || '',
      state: state || '',
      zipCode,
      country: country || 'Mexico'
    };
  }

  private async reverseGeocodeWithNominatim(
    latitude: number, 
    longitude: number, 
    timeout: number
  ): Promise<GeocodingResult> {
    const url = `${this.NOMINATIM_BASE_URL}/reverse`;
    const params = {
      lat: latitude,
      lon: longitude,
      format: 'json',
      addressdetails: 1,
      'accept-language': 'es,en'
    };

    const response = await axios.get(url, {
      params,
      timeout,
      headers: {
        'User-Agent': 'PickleballApp/1.0'
      }
    });

    if (!response.data) {
      throw new Error('No results found for coordinates');
    }

    const result = response.data;
    const address_details = result.address || {};

    return {
      latitude,
      longitude,
      address: result.display_name,
      city: address_details.city || address_details.town || address_details.village || '',
      state: address_details.state || '',
      zipCode: address_details.postcode,
      country: address_details.country || 'Mexico'
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

    // Build where conditions
    const whereConditions: any = {
      isPublic: true
    };

    if (!includeInactive) {
      whereConditions.isCurrentLocation = true;
    }

    if (excludePlayerId) {
      whereConditions.playerId = {
        [require('sequelize').Op.ne]: excludePlayerId
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

    return locationsWithDistance;
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
        // Return city center coordinates (simplified - you might want to use actual city centers)
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