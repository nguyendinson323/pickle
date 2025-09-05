import { Op, QueryTypes } from 'sequelize';
import User from '../models/User';
import Player from '../models/Player';
import PlayerLocation from '../models/PlayerLocation';
import PlayerFinderRequest from '../models/PlayerFinderRequest';
import PlayerFinderMatch from '../models/PlayerFinderMatch';
import locationService from './locationService';
import notificationService from './notificationService';
import sequelize from '../config/database';

interface CreateFinderRequestData {
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
}

class PlayerFinderService {
  /**
   * Create a new player finder request
   */
  async createFinderRequest(requestData: CreateFinderRequestData) {
    const { userId, location, preferences } = requestData;

    // Check if user has premium access or is admin admin
    const user = await User.findByPk(userId, {
      include: [{ model: Player, as: 'playerProfile' }]
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check player finder access (premium feature)
    const hasAccess = user.role === 'admin' || 
                     ((user as any).playerProfile?.isPremium) || 
                     false; // Add membership check here

    if (!hasAccess) {
      throw new Error('Player Finder is a premium feature. Please upgrade your membership.');
    }

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

    // Validate coordinates are within Mexico
    if (!locationService.isWithinMexico(coordinates.latitude, coordinates.longitude)) {
      throw new Error('Player Finder is currently only available within Mexico');
    }

    // Create or update player location
    const [playerLocation] = await PlayerLocation.upsert({
      playerId: userId,
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
      isActive: true,
      privacyLevel: 'city' // Default privacy level
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
      (request as any).location.latitude,
      (request as any).location.longitude,
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
          matchedAt: new Date(),
          contactShared: false
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
  private calculateCompatibilityScore(request: any, candidate: any): number {
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
  private async sendMatchNotification(request: any, matchedPlayer: any, match: any) {
    const requesterName = request.requester.playerProfile?.fullName || request.requester.username;
    const locationText = `${request.location.city}, ${request.location.state}`;

    try {
      // Create in-app notification
      await new notificationService().sendNotification({
        userId: matchedPlayer.userId.toString(),
        type: 'match',
        category: 'info',
        title: 'New player match found!',
        message: `${requesterName} wants to play pickleball in ${locationText} (${match.distance}km away)`
      });
    } catch (error) {
      console.error('Failed to send match notification:', error);
      // Don't throw - notification failure shouldn't break matching
    }
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
            },
            {
              model: PlayerLocation,
              as: 'location'
            }
          ]
        }
      ]
    });

    if (!match || match.matchedUserId !== userId) {
      throw new Error('Match not found or unauthorized');
    }

    if (match.status !== 'pending') {
      throw new Error('Match has already been responded to');
    }

    // Update match status
    await match.update({
      status: response,
      responseMessage: message,
      respondedAt: new Date()
    });

    // Notify the original requester
    const requesterEmail = (match as any).request.requester.email;
    const matchedPlayerName = await this.getPlayerName(userId);
    const locationText = `${(match as any).request.location.city}, ${(match as any).request.location.state}`;

    if (response === 'accepted') {
      // Mark contact as shared
      await match.update({ contactShared: true });

      // Send acceptance notification
      await new notificationService().sendNotification({
        userId: (match as any).request.requesterId.toString(),
        type: 'match',
        category: 'success',
        title: '🎉 Your pickleball match request was accepted!',
        message: `${matchedPlayerName} accepted your request to play in ${locationText}${message ? ': ' + message : ''}`
      });
    } else {
      // Send decline notification (in-app only to avoid spam)
      await new notificationService().sendNotification({
        userId: (match as any).request.requesterId.toString(),
        type: 'match',
        category: 'info',
        title: 'Match request declined',
        message: `${matchedPlayerName} declined your request${message ? ': ' + message : ''}`
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

  /**
   * Get user's location for player finder
   */
  async getUserLocation(userId: number) {
    return await PlayerLocation.findOne({
      where: {
        playerId: userId,
        isActive: true,
        isCurrentLocation: true
      }
    });
  }

  /**
   * Update user's location settings
   */
  async updateUserLocation(userId: number, locationData: Partial<{
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    address: string;
    searchRadius: number;
    privacyLevel: 'exact' | 'city' | 'state';
  }>) {
    const location = await this.getUserLocation(userId);
    
    if (location) {
      return await location.update({
        ...locationData,
        lastUpdated: new Date()
      });
    } else {
      return await PlayerLocation.create({
        playerId: userId,
        latitude: locationData.latitude!,
        longitude: locationData.longitude!,
        city: locationData.city!,
        state: locationData.state!,
        address: locationData.address,
        country: 'Mexico',
        isCurrentLocation: true,
        isTravelLocation: false,
        searchRadius: locationData.searchRadius || 25,
        privacyLevel: locationData.privacyLevel || 'city',
        isActive: true,
        lastUpdated: new Date()
      });
    }
  }

  /**
   * Cancel/deactivate finder request
   */
  async cancelFinderRequest(requestId: number, userId: number) {
    const request = await PlayerFinderRequest.findOne({
      where: {
        id: requestId,
        requesterId: userId
      }
    });

    if (!request) {
      throw new Error('Finder request not found or unauthorized');
    }

    await request.update({ isActive: false });
    return request;
  }

  /**
   * Get match details
   */
  async getMatchDetails(matchId: number, userId: number) {
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
            },
            {
              model: PlayerLocation,
              as: 'location'
            }
          ]
        }
      ]
    });

    if (!match) {
      throw new Error('Match not found');
    }

    // Check authorization
    const isRequester = (match as any).request.requesterId === userId;
    const isMatched = match.matchedUserId === userId;

    if (!isRequester && !isMatched) {
      throw new Error('Unauthorized to view this match');
    }

    return match;
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
    
    if (minIndex === -1 || maxIndex === -1) return undefined;
    
    return levels.slice(minIndex, maxIndex + 1);
  }

  private async getPlayerName(userId: number): Promise<string> {
    const user = await User.findByPk(userId, {
      include: [{ model: Player, as: 'playerProfile' }]
    });
    
    return (user as any)?.playerProfile?.fullName || user?.username || 'Unknown Player';
  }

  private async getContactInfo(matchedUserId: number, requesterId: number) {
    // Only share contact info if match is accepted
    const user = await User.findByPk(matchedUserId, {
      include: [{ model: Player, as: 'playerProfile' }]
    });

    if (!user) return null;

    return {
      name: (user as any).playerProfile?.fullName || user.username,
      email: user.email,
      phone: (user as any).playerProfile?.mobilePhone
    };
  }
}

export default new PlayerFinderService();