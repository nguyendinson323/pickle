# 04. Player Finder System - Complete Implementation Guide

## Overview
The Player Finder system is a critical premium feature that allows players to find other players nearby for matches. This includes location-based search, notification system, privacy controls, and integration with Google Maps API (with cost-free alternatives explored).

## System Requirements from Overview

### Core Features Required
1. **Location-Based Player Search**: Find players in same area, state, or when traveling
2. **Automatic Matching**: System finds nearby matches and sends notifications
3. **Dual Notification System**: Both SMS and email notifications to interested players
4. **Privacy Controls**: Players can toggle "Can Be Found" / "Not Visible" setting
5. **Travel Mode**: Find players when traveling to other locations
6. **Coach Finder**: Similar system for finding coaches nearby
7. **Premium Feature**: Part of paid subscription model

## Step-by-Step Implementation Plan

### Phase 1: Privacy-First Player Search Foundation

#### 1.1 Player Location Model Updates (`backend/src/models/PlayerLocation.ts`)
```typescript
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface PlayerLocationAttributes {
  id: number;
  userId: number;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  isCurrentLocation: boolean;
  isTravelLocation: boolean;
  travelStartDate?: Date;
  travelEndDate?: Date;
  searchRadius: number; // in kilometers
  lastUpdated: Date;
  isActive: boolean;
  privacyLevel: 'exact' | 'city' | 'state'; // How precise to show location
}

interface PlayerLocationCreationAttributes 
  extends Optional<PlayerLocationAttributes, 'id' | 'lastUpdated'> {}

class PlayerLocation extends Model<
  PlayerLocationAttributes,
  PlayerLocationCreationAttributes
> implements PlayerLocationAttributes {
  public id!: number;
  public userId!: number;
  public latitude!: number;
  public longitude!: number;
  public city!: string;
  public state!: string;
  public country!: string;
  public isCurrentLocation!: boolean;
  public isTravelLocation!: boolean;
  public travelStartDate?: Date;
  public travelEndDate?: Date;
  public searchRadius!: number;
  public lastUpdated!: Date;
  public isActive!: boolean;
  public privacyLevel!: 'exact' | 'city' | 'state';

  // Calculated distance field (populated by queries)
  public distance?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PlayerLocation.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Mexico'
  },
  isCurrentLocation: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  isTravelLocation: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  travelStartDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  travelEndDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  searchRadius: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 25, // 25km default radius
    validate: {
      min: 5,
      max: 100
    }
  },
  lastUpdated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  privacyLevel: {
    type: DataTypes.ENUM('exact', 'city', 'state'),
    allowNull: false,
    defaultValue: 'city'
  }
}, {
  sequelize,
  tableName: 'player_locations',
  modelName: 'PlayerLocation',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['latitude', 'longitude']
    },
    {
      fields: ['city', 'state']
    },
    {
      fields: ['isActive', 'isCurrentLocation']
    }
  ]
});

export default PlayerLocation;
```

#### 1.2 Player Finder Request Model (`backend/src/models/PlayerFinderRequest.ts`)
```typescript
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface PlayerFinderRequestAttributes {
  id: number;
  requesterId: number;
  locationId: number;
  nrtpLevelMin?: string;
  nrtpLevelMax?: string;
  preferredGender?: 'male' | 'female' | 'any';
  preferredAgeMin?: number;
  preferredAgeMax?: number;
  searchRadius: number;
  availableTimeSlots: object; // JSON with time preferences
  message?: string;
  isActive: boolean;
  expiresAt: Date;
}

interface PlayerFinderRequestCreationAttributes 
  extends Optional<PlayerFinderRequestAttributes, 'id'> {}

class PlayerFinderRequest extends Model<
  PlayerFinderRequestAttributes,
  PlayerFinderRequestCreationAttributes
> implements PlayerFinderRequestAttributes {
  public id!: number;
  public requesterId!: number;
  public locationId!: number;
  public nrtpLevelMin?: string;
  public nrtpLevelMax?: string;
  public preferredGender?: 'male' | 'female' | 'any';
  public preferredAgeMin?: number;
  public preferredAgeMax?: number;
  public searchRadius!: number;
  public availableTimeSlots!: object;
  public message?: string;
  public isActive!: boolean;
  public expiresAt!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PlayerFinderRequest.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  requesterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  locationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'player_locations',
      key: 'id'
    }
  },
  nrtpLevelMin: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  nrtpLevelMax: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  preferredGender: {
    type: DataTypes.ENUM('male', 'female', 'any'),
    allowNull: true,
    defaultValue: 'any'
  },
  preferredAgeMin: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 18,
      max: 100
    }
  },
  preferredAgeMax: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 18,
      max: 100
    }
  },
  searchRadius: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 25,
    validate: {
      min: 5,
      max: 100
    }
  },
  availableTimeSlots: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'player_finder_requests',
  modelName: 'PlayerFinderRequest',
  timestamps: true
});

export default PlayerFinderRequest;
```

### Phase 2: Location Services (Cost-Free Implementation)

#### 2.1 Location Service Without Google Maps API (`backend/src/services/locationService.ts`)
```typescript
import axios from 'axios';
import NodeCache from 'node-cache';

// Cache geocoding results for 24 hours to reduce API calls
const geocodingCache = new NodeCache({ stdTTL: 86400 });

class LocationService {
  /**
   * Get coordinates from address using free OpenStreetMap Nominatim API
   * Alternative to Google Geocoding API
   */
  async geocodeAddress(address: string): Promise<{
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
  } | null> {
    const cacheKey = `geocode_${address}`;
    const cached = geocodingCache.get(cacheKey);
    
    if (cached) {
      return cached as any;
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
        const locationData = {
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
  ): Promise<Array<{
    userId: number;
    distance: number;
    user: any;
    location: any;
  }>> {
    // Using raw SQL with PostgreSQL earth distance functions
    // This is more efficient than Google Maps API for our use case
    const query = `
      SELECT 
        u.id as user_id,
        u.username,
        u.profile_photo_url,
        p.full_name,
        p.nrtp_level,
        p.gender,
        p.date_of_birth,
        p.can_be_found,
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
        ${filters.excludeUserId ? 'AND u.id != $4' : ''}
      ORDER BY distance ASC
      LIMIT 50
    `;

    const queryParams = [centerLat, centerLon, radiusKm];
    if (filters.excludeUserId) {
      queryParams.push(filters.excludeUserId);
    }

    try {
      const [results] = await sequelize.query(query, {
        bind: queryParams,
        type: QueryTypes.SELECT
      });

      return (results as any[]).map(row => ({
        userId: row.user_id,
        distance: parseFloat(row.distance),
        user: {
          id: row.user_id,
          username: row.username,
          profilePhotoUrl: row.profile_photo_url,
          playerProfile: {
            fullName: row.full_name,
            nrtpLevel: row.nrtp_level,
            gender: row.gender,
            dateOfBirth: row.date_of_birth
          }
        },
        location: {
          city: row.city,
          state: row.state,
          privacyLevel: row.privacy_level,
          // Only include exact coordinates if privacy allows
          latitude: row.privacy_level === 'exact' ? row.latitude : null,
          longitude: row.privacy_level === 'exact' ? row.longitude : null
        }
      }));
    } catch (error) {
      console.error('Error finding nearby players:', error);
      return [];
    }
  }

  /**
   * Get city/state coordinates from free Mexican postal codes database
   * Alternative to Google Places API for Mexican locations
   */
  async getMexicanLocationCoordinates(city: string, state: string): Promise<{
    latitude: number;
    longitude: number;
  } | null> {
    // Using a free database of Mexican cities and their coordinates
    // This data can be seeded from free government sources
    try {
      const location = await MexicanCity.findOne({
        where: {
          city: { [Op.iLike]: city },
          state: { [Op.iLike]: state }
        }
      });

      if (location) {
        return {
          latitude: location.latitude,
          longitude: location.longitude
        };
      }

      // Fallback to Nominatim for locations not in our database
      return await this.geocodeAddress(`${city}, ${state}, Mexico`);
    } catch (error) {
      console.error('Error getting Mexican location:', error);
      return null;
    }
  }
}

export default new LocationService();
```

### Phase 3: Player Finder Service with Matching Algorithm

#### 3.1 Player Finder Service (`backend/src/services/playerFinderService.ts`)
```typescript
import { Op, QueryTypes } from 'sequelize';
import User from '../models/User';
import Player from '../models/Player';
import PlayerLocation from '../models/PlayerLocation';
import PlayerFinderRequest from '../models/PlayerFinderRequest';
import PlayerFinderMatch from '../models/PlayerFinderMatch';
import locationService from './locationService';
import notificationService from './notificationService';

class PlayerFinderService {
  /**
   * Create a new player finder request
   */
  async createFinderRequest(requestData: {
    userId: number;
    location: {
      address?: string;
      latitude?: number;
      longitude?: number;
      city: string;
      state: string;
      isTravelLocation: boolean;
      travelStartDate?: Date;
      travelEndDate?: Date;
    };
    preferences: {
      nrtpLevelMin?: string;
      nrtpLevelMax?: string;
      preferredGender?: string;
      preferredAgeMin?: number;
      preferredAgeMax?: number;
      searchRadius: number;
      availableTimeSlots: object;
      message?: string;
    };
  }) {
    const { userId, location, preferences } = requestData;

    // Geocode location if coordinates not provided
    let coordinates = {
      latitude: location.latitude,
      longitude: location.longitude
    };

    if (!coordinates.latitude || !coordinates.longitude) {
      const geocoded = await locationService.geocodeAddress(
        location.address || `${location.city}, ${location.state}, Mexico`
      );
      
      if (geocoded) {
        coordinates = {
          latitude: geocoded.latitude,
          longitude: geocoded.longitude
        };
      } else {
        throw new Error('Unable to geocode the provided location');
      }
    }

    // Create or update player location
    const [playerLocation] = await PlayerLocation.upsert({
      userId,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      city: location.city,
      state: location.state,
      country: 'Mexico',
      isCurrentLocation: !location.isTravelLocation,
      isTravelLocation: location.isTravelLocation,
      travelStartDate: location.travelStartDate,
      travelEndDate: location.travelEndDate,
      searchRadius: preferences.searchRadius,
      lastUpdated: new Date(),
      isActive: true
    });

    // Create finder request
    const finderRequest = await PlayerFinderRequest.create({
      requesterId: userId,
      locationId: playerLocation.id,
      nrtpLevelMin: preferences.nrtpLevelMin,
      nrtpLevelMax: preferences.nrtpLevelMax,
      preferredGender: preferences.preferredGender as any,
      preferredAgeMin: preferences.preferredAgeMin,
      preferredAgeMax: preferences.preferredAgeMax,
      searchRadius: preferences.searchRadius,
      availableTimeSlots: preferences.availableTimeSlots,
      message: preferences.message,
      isActive: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // Immediately search for matches
    await this.findMatches(finderRequest.id);

    return finderRequest;
  }

  /**
   * Find and create matches for a finder request
   */
  async findMatches(requestId: number) {
    const request = await PlayerFinderRequest.findByPk(requestId, {
      include: [
        {
          model: PlayerLocation,
          as: 'location'
        },
        {
          model: User,
          as: 'requester',
          include: [
            {
              model: Player,
              as: 'playerProfile'
            }
          ]
        }
      ]
    });

    if (!request || !request.isActive) {
      return [];
    }

    // Find nearby players
    const nearbyPlayers = await locationService.findNearbyPlayers(
      request.location.latitude,
      request.location.longitude,
      request.searchRadius,
      {
        excludeUserId: request.requesterId,
        nrtpLevel: this.buildNrtpLevelRange(request.nrtpLevelMin, request.nrtpLevelMax),
        gender: request.preferredGender === 'any' ? undefined : request.preferredGender,
        ageRange: request.preferredAgeMin && request.preferredAgeMax ? {
          min: request.preferredAgeMin,
          max: request.preferredAgeMax
        } : undefined
      }
    );

    const matches = [];

    for (const nearbyPlayer of nearbyPlayers) {
      // Check if match already exists
      const existingMatch = await PlayerFinderMatch.findOne({
        where: {
          requestId: request.id,
          matchedUserId: nearbyPlayer.userId
        }
      });

      if (!existingMatch) {
        // Calculate compatibility score
        const compatibilityScore = this.calculateCompatibilityScore(
          request,
          nearbyPlayer
        );

        // Create match
        const match = await PlayerFinderMatch.create({
          requestId: request.id,
          matchedUserId: nearbyPlayer.userId,
          distance: nearbyPlayer.distance,
          compatibilityScore,
          status: 'pending',
          matchedAt: new Date()
        });

        matches.push(match);

        // Send notification to matched player
        await this.sendMatchNotification(request, nearbyPlayer, match);
      }
    }

    return matches;
  }

  /**
   * Calculate compatibility score between requester and potential match
   */
  private calculateCompatibilityScore(
    request: any,
    candidate: any
  ): number {
    let score = 100;

    // Distance penalty (closer is better)
    const distancePenalty = Math.min(candidate.distance * 2, 30);
    score -= distancePenalty;

    // NRTP level compatibility (similar levels are better)
    if (request.nrtpLevelMin && request.nrtpLevelMax && candidate.user.playerProfile.nrtpLevel) {
      const candidateLevel = parseFloat(candidate.user.playerProfile.nrtpLevel);
      const minLevel = parseFloat(request.nrtpLevelMin);
      const maxLevel = parseFloat(request.nrtpLevelMax);
      
      if (candidateLevel < minLevel || candidateLevel > maxLevel) {
        score -= 20; // Outside preferred range
      } else {
        // Bonus for being in the middle of preferred range
        const midPoint = (minLevel + maxLevel) / 2;
        const levelDifference = Math.abs(candidateLevel - midPoint);
        score += Math.max(0, 10 - levelDifference * 2);
      }
    }

    // Age compatibility (if specified)
    if (request.preferredAgeMin && request.preferredAgeMax && candidate.user.playerProfile.dateOfBirth) {
      const candidateAge = this.calculateAge(candidate.user.playerProfile.dateOfBirth);
      if (candidateAge < request.preferredAgeMin || candidateAge > request.preferredAgeMax) {
        score -= 15;
      }
    }

    // Gender preference
    if (request.preferredGender && 
        request.preferredGender !== 'any' && 
        request.preferredGender !== candidate.user.playerProfile.gender) {
      score -= 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Send notification to matched player
   */
  private async sendMatchNotification(
    request: any,
    matchedPlayer: any,
    match: any
  ) {
    const requesterName = request.requester.playerProfile?.fullName || request.requester.username;
    const locationText = `${request.location.city}, ${request.location.state}`;

    const emailContent = {
      to: matchedPlayer.user.email,
      subject: '🏓 Someone wants to play pickleball with you!',
      template: 'player-match-notification',
      data: {
        playerName: matchedPlayer.user.playerProfile.fullName,
        requesterName,
        location: locationText,
        distance: `${match.distance}km`,
        nrtpLevel: request.requester.playerProfile?.nrtpLevel,
        message: request.message,
        matchUrl: `${process.env.FRONTEND_URL}/player/matches/${match.id}`,
        viewRequestUrl: `${process.env.FRONTEND_URL}/player/finder/requests/${request.id}`
      }
    };

    // Send email notification
    await notificationService.sendEmail(emailContent);

    // Send SMS if phone number is available
    if (matchedPlayer.user.playerProfile?.mobilePhone) {
      const smsContent = `🏓 ${requesterName} wants to play pickleball in ${locationText}! Distance: ${match.distance}km. View details: ${process.env.FRONTEND_URL}/player/matches/${match.id}`;
      
      await notificationService.sendSMS({
        to: matchedPlayer.user.playerProfile.mobilePhone,
        message: smsContent
      });
    }

    // Create in-app notification
    await notificationService.createNotification({
      userId: matchedPlayer.userId,
      type: 'player_match',
      title: 'New player match found!',
      message: `${requesterName} wants to play pickleball in ${locationText}`,
      data: {
        matchId: match.id,
        requestId: request.id
      }
    });
  }

  /**
   * Handle match response (accept/decline)
   */
  async respondToMatch(
    matchId: number,
    userId: number,
    response: 'accepted' | 'declined',
    message?: string
  ) {
    const match = await PlayerFinderMatch.findByPk(matchId, {
      include: [
        {
          model: PlayerFinderRequest,
          as: 'request',
          include: [
            {
              model: User,
              as: 'requester',
              include: [{ model: Player, as: 'playerProfile' }]
            }
          ]
        }
      ]
    });

    if (!match || match.matchedUserId !== userId) {
      throw new Error('Match not found or unauthorized');
    }

    // Update match status
    await match.update({
      status: response,
      responseMessage: message,
      respondedAt: new Date()
    });

    // Notify the original requester
    const requesterEmail = match.request.requester.email;
    const matchedPlayerName = await this.getPlayerName(userId);

    if (response === 'accepted') {
      // Send acceptance notification
      await notificationService.sendEmail({
        to: requesterEmail,
        subject: '🎉 Your pickleball match request was accepted!',
        template: 'match-accepted',
        data: {
          matchedPlayerName,
          message,
          contactInfo: await this.getContactInfo(userId, match.request.requesterId)
        }
      });
    } else {
      // Send decline notification (optional, might be too spammy)
      await notificationService.createNotification({
        userId: match.request.requesterId,
        type: 'match_declined',
        title: 'Match request declined',
        message: `${matchedPlayerName} declined your match request${message ? ': ' + message : ''}`
      });
    }

    return match;
  }

  /**
   * Get active finder requests for a user
   */
  async getUserFinderRequests(userId: number) {
    return await PlayerFinderRequest.findAll({
      where: {
        requesterId: userId,
        isActive: true,
        expiresAt: { [Op.gt]: new Date() }
      },
      include: [
        {
          model: PlayerLocation,
          as: 'location'
        },
        {
          model: PlayerFinderMatch,
          as: 'matches',
          include: [
            {
              model: User,
              as: 'matchedUser',
              include: [{ model: Player, as: 'playerProfile' }]
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Get matches for a user (requests where they were matched)
   */
  async getUserMatches(userId: number) {
    return await PlayerFinderMatch.findAll({
      where: {
        matchedUserId: userId,
        status: 'pending'
      },
      include: [
        {
          model: PlayerFinderRequest,
          as: 'request',
          include: [
            {
              model: User,
              as: 'requester',
              include: [{ model: Player, as: 'playerProfile' }]
            },
            {
              model: PlayerLocation,
              as: 'location'
            }
          ]
        }
      ],
      order: [['matchedAt', 'DESC']]
    });
  }

  // Helper methods
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  private buildNrtpLevelRange(min?: string, max?: string): string[] | undefined {
    if (!min && !max) return undefined;
    
    const levels = ['1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5'];
    const minIndex = min ? levels.indexOf(min) : 0;
    const maxIndex = max ? levels.indexOf(max) : levels.length - 1;
    
    return levels.slice(minIndex, maxIndex + 1);
  }

  private async getPlayerName(userId: number): Promise<string> {
    const user = await User.findByPk(userId, {
      include: [{ model: Player, as: 'playerProfile' }]
    });
    
    return user?.playerProfile?.fullName || user?.username || 'Unknown Player';
  }

  private async getContactInfo(matchedUserId: number, requesterId: number) {
    // Only share contact info if match is accepted
    const user = await User.findByPk(matchedUserId, {
      include: [{ model: Player, as: 'playerProfile' }]
    });

    return {
      name: user?.playerProfile?.fullName || user?.username,
      email: user?.email,
      phone: user?.playerProfile?.mobilePhone
    };
  }
}

export default new PlayerFinderService();
```

### Phase 4: Frontend Implementation

#### 4.1 Player Finder Page (`frontend/src/pages/playerFinder/PlayerFinderPage.tsx`)
```typescript
const PlayerFinderPage: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState<'search' | 'requests' | 'matches'>('search');
  const [showCreateRequest, setShowCreateRequest] = useState(false);

  // Check if user has premium access
  const hasPlayerFinderAccess = user?.membership?.planType === 'premium' || 
                                user?.role === 'admin';

  if (!hasPlayerFinderAccess) {
    return <PlayerFinderUpgrade />;
  }

  return (
    <DashboardLayout title="Find Players">
      <div className="space-y-6">
        {/* Privacy Status Banner */}
        <PlayerVisibilityBanner />

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'search', name: 'Find Players', icon: MagnifyingGlassIcon },
              { id: 'requests', name: 'My Requests', icon: PaperAirplaneIcon },
              { id: 'matches', name: 'Matches', icon: HeartIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon
                  className={`-ml-0.5 mr-2 h-5 w-5 ${
                    activeTab === tab.id
                      ? 'text-primary-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Find Players to Play With
              </h2>
              <button
                onClick={() => setShowCreateRequest(true)}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Create Request</span>
              </button>
            </div>
            
            <PlayerSearchInterface />
          </div>
        )}

        {activeTab === 'requests' && <MyFinderRequests />}
        {activeTab === 'matches' && <MatchedRequests />}
      </div>

      {/* Create Request Modal */}
      {showCreateRequest && (
        <CreateFinderRequestModal 
          isOpen={showCreateRequest}
          onClose={() => setShowCreateRequest(false)}
        />
      )}
    </DashboardLayout>
  );
};
```

#### 4.2 Create Finder Request Modal (`frontend/src/components/playerFinder/CreateFinderRequestModal.tsx`)
```typescript
interface CreateFinderRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateFinderRequestModal: React.FC<CreateFinderRequestModalProps> = ({
  isOpen,
  onClose
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Location data
    searchType: 'current', // 'current' or 'travel'
    city: '',
    state: '',
    address: '',
    travelDates: { start: '', end: '' },
    
    // Preferences
    searchRadius: 25,
    nrtpLevelMin: '',
    nrtpLevelMax: '',
    preferredGender: 'any',
    ageRange: { min: '', max: '' },
    
    // Availability
    availableTimes: {},
    message: ''
  });

  const [isCreating, setIsCreating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation && formData.searchType === 'current') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, [formData.searchType]);

  const handleSubmit = async () => {
    setIsCreating(true);
    
    try {
      const requestData = {
        location: {
          ...currentLocation,
          city: formData.city,
          state: formData.state,
          address: formData.address,
          isTravelLocation: formData.searchType === 'travel',
          travelStartDate: formData.travelDates.start ? new Date(formData.travelDates.start) : undefined,
          travelEndDate: formData.travelDates.end ? new Date(formData.travelDates.end) : undefined,
        },
        preferences: {
          searchRadius: formData.searchRadius,
          nrtpLevelMin: formData.nrtpLevelMin,
          nrtpLevelMax: formData.nrtpLevelMax,
          preferredGender: formData.preferredGender,
          preferredAgeMin: formData.ageRange.min ? parseInt(formData.ageRange.min) : undefined,
          preferredAgeMax: formData.ageRange.max ? parseInt(formData.ageRange.max) : undefined,
          availableTimeSlots: formData.availableTimes,
          message: formData.message
        }
      };

      await apiService.post('/player-finder/requests', requestData);
      
      toast.success('Player finder request created! We\'ll notify you when we find matches.');
      onClose();
    } catch (error) {
      console.error('Failed to create finder request:', error);
      toast.error('Failed to create request. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Find Players to Play With
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`flex items-center ${
                  stepNum < 3 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      step > stepNum ? 'bg-primary-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Location</span>
            <span>Preferences</span>
            <span>Availability</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {step === 1 && (
            <LocationStep 
              formData={formData}
              setFormData={setFormData}
              currentLocation={currentLocation}
            />
          )}
          
          {step === 2 && (
            <PreferencesStep 
              formData={formData}
              setFormData={setFormData}
            />
          )}
          
          {step === 3 && (
            <AvailabilityStep 
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="btn-secondary disabled:opacity-50"
          >
            Previous
          </button>
          
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="btn-primary"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isCreating}
              className="btn-primary disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating Request...
                </>
              ) : (
                'Create Request'
              )}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
```

## Implementation Priority

### Week 1 - Foundation (Critical)
1. **Database Models**: PlayerLocation, PlayerFinderRequest, PlayerFinderMatch
2. **Location Service**: Cost-free geocoding and distance calculations
3. **Privacy Controls**: Can Be Found toggle and location privacy levels

### Week 2 - Core Matching System (High Priority)
1. **Player Finder Service**: Matching algorithm and notifications
2. **Basic Frontend Interface**: Search and create request functionality
3. **Notification System**: Email and SMS alerts for matches

### Week 3 - Advanced Features (Medium Priority)
1. **Travel Mode**: Finding players when traveling
2. **Coach Finder**: Extended system for finding coaches
3. **Match Management**: Accept/decline responses and contact exchange

### Week 4 - Premium Integration (Low Priority)
1. **Premium Feature Gates**: Membership validation
2. **Usage Analytics**: Track feature usage for billing
3. **Advanced Filters**: More sophisticated matching criteria

## Cost-Free Implementation Strategy

### 1. **No Google Maps API Costs**
- Use OpenStreetMap Nominatim for geocoding (free)
- Use mathematical distance calculations (Haversine formula)
- Maintain Mexican cities database for quick lookups
- Use PostgreSQL geospatial functions for efficient queries

### 2. **Efficient Notification System**
- Batch notifications to reduce SMS costs
- Use email as primary notification method
- Implement smart notification preferences
- Use in-app notifications for real-time updates

### 3. **Smart Caching Strategy**
- Cache geocoding results for 24 hours
- Cache search results for frequently requested areas
- Use database indexes for fast location queries
- Implement lazy loading for UI components

## Expected Results

After full implementation:
- ✅ Players can find nearby players without Google Maps API costs
- ✅ Automatic matching with dual notification system (email + SMS)
- ✅ Complete privacy controls with "Can Be Found" toggle
- ✅ Travel mode for finding players in other locations
- ✅ Premium feature integration with membership validation
- ✅ Coach finder functionality
- ✅ Match management with accept/decline workflow
- ✅ Real-time notifications and updates

This Player Finder system provides the core functionality requested in the overview while maintaining cost efficiency and respecting user privacy preferences.