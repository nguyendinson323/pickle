import { Op } from 'sequelize';
import { 
  Player, 
  PlayerLocation, 
  PlayerFinderRequest, 
  PlayerFinderMatch,
  PlayerPrivacySetting,
  User
} from '../models';
import locationService from './locationService';

interface MatchingCriteria {
  skillLevel: string;
  distance: number;
  ageRange?: { min: number; max: number };
  gender?: string;
  playingStyle?: string;
  availability?: {
    days: string[];
    timeStart?: string;
    timeEnd?: string;
  };
}

interface MatchResult {
  player: Player;
  location: PlayerLocation;
  matchScore: number;
  distance: number;
  matchReasons: string[];
}

interface FinderRequestFilters {
  skillLevel?: string;
  maxDistance?: number;
  location?: { latitude: number; longitude: number };
  status?: string[];
  playingStyle?: string;
  limit?: number;
  offset?: number;
}

class PlayerFinderService {
  private readonly SKILL_LEVELS = ['beginner', 'intermediate', 'advanced', 'pro'];
  private readonly SKILL_LEVEL_SCORES = {
    'beginner': 1,
    'intermediate': 2,
    'advanced': 3,
    'pro': 4
  };

  async createFinderRequest(
    playerId: number, 
    requestData: Partial<PlayerFinderRequest>
  ): Promise<PlayerFinderRequest> {
    const player = await Player.findByPk(playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    // Validate location exists
    if (requestData.locationId) {
      const location = await PlayerLocation.findOne({
        where: { 
          id: requestData.locationId,
          playerId
        }
      });
      
      if (!location) {
        throw new Error('Location not found or not owned by player');
      }
    }

    // Set expiration date if not provided
    if (!requestData.expiresAt) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // Default 30 days
      requestData.expiresAt = expiresAt;
    }

    const finderRequest = await PlayerFinderRequest.create({
      requesterId: playerId,
      currentPlayers: 1,
      ...requestData
    });

    // Auto-match with existing players
    await this.findMatches(finderRequest.id);

    return finderRequest;
  }

  async findMatches(requestId: number): Promise<PlayerFinderMatch[]> {
    const request = await PlayerFinderRequest.findByPk(requestId, {
      include: [
        {
          model: PlayerLocation,
          as: 'location'
        },
        {
          model: Player,
          as: 'requester',
          include: [
            {
              model: User,
              as: 'user'
            }
          ]
        }
      ]
    });

    if (!request) {
      throw new Error('Finder request not found');
    }

    const criteria: MatchingCriteria = {
      skillLevel: request.skillLevel,
      distance: request.maxDistance,
      ageRange: request.ageRangeMin && request.ageRangeMax ? {
        min: request.ageRangeMin,
        max: request.ageRangeMax
      } : undefined,
      gender: request.preferredGender,
      playingStyle: request.playingStyle,
      availability: {
        days: request.availabilityDays,
        timeStart: request.availabilityTimeStart,
        timeEnd: request.availabilityTimeEnd
      }
    };

    const potentialMatches = await this.findPotentialMatches(
      request.location!,
      criteria,
      request.requesterId
    );

    const matches: PlayerFinderMatch[] = [];

    for (const match of potentialMatches) {
      // Check if match already exists
      const existingMatch = await PlayerFinderMatch.findOne({
        where: {
          requestId,
          playerId: match.player.id
        }
      });

      if (!existingMatch) {
        const newMatch = await PlayerFinderMatch.create({
          requestId,
          playerId: match.player.id,
          matchScore: match.matchScore,
          distance: match.distance,
          status: 'pending',
          requestedAt: new Date(),
          matchReasons: match.matchReasons
        });

        matches.push(newMatch);
      }
    }

    return matches;
  }

  private async findPotentialMatches(
    centerLocation: PlayerLocation,
    criteria: MatchingCriteria,
    excludePlayerId: number
  ): Promise<MatchResult[]> {
    // Get nearby locations
    const nearbyLocations = await locationService.findNearbyLocations(
      centerLocation.latitude,
      centerLocation.longitude,
      criteria.distance,
      {
        excludePlayerId,
        limit: 100
      }
    );

    const matches: MatchResult[] = [];

    for (const locationWithDistance of nearbyLocations) {
      const location = locationWithDistance as PlayerLocation & { distance: number };
      
      // Get player with privacy settings
      const player = await Player.findByPk(location.playerId, {
        include: [
          {
            model: User,
            as: 'user'
          },
          {
            model: PlayerPrivacySetting,
            as: 'privacySettings'
          }
        ]
      });

      if (!player || !player.canBeFound) {
        continue;
      }

      // Check privacy settings
      if (!this.checkPrivacySettings(player.privacySettings, criteria.distance)) {
        continue;
      }

      // Calculate match score
      const matchResult = await this.calculateMatchScore(player, location, criteria);
      
      if (matchResult.matchScore >= 40) { // Minimum match threshold
        matches.push(matchResult);
      }
    }

    // Sort by match score (highest first)
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  private checkPrivacySettings(
    privacySettings: PlayerPrivacySetting | null,
    requestDistance: number
  ): boolean {
    if (!privacySettings) {
      return true; // Default allow if no settings
    }

    return (
      privacySettings.allowFinderRequests &&
      privacySettings.maxDistance >= requestDistance &&
      privacySettings.profileVisibility !== 'private'
    );
  }

  private async calculateMatchScore(
    player: Player,
    location: PlayerLocation & { distance: number },
    criteria: MatchingCriteria
  ): Promise<MatchResult> {
    let score = 0;
    const matchReasons: string[] = [];

    // Skill level matching (30% weight)
    const skillScore = this.calculateSkillMatch(player.nrtpLevel || 'beginner', criteria.skillLevel);
    score += skillScore * 0.3;
    if (skillScore > 70) {
      matchReasons.push('Nivel de habilidad compatible');
    }

    // Distance score (25% weight)
    const distanceScore = this.calculateDistanceScore(location.distance, criteria.distance);
    score += distanceScore * 0.25;
    if (location.distance <= criteria.distance * 0.5) {
      matchReasons.push('Ubicación cercana');
    }

    // Age compatibility (20% weight)
    if (criteria.ageRange) {
      const ageScore = this.calculateAgeScore(player.dateOfBirth, criteria.ageRange);
      score += ageScore * 0.2;
      if (ageScore > 80) {
        matchReasons.push('Rango de edad compatible');
      }
    } else {
      score += 80 * 0.2; // No age preference = perfect score
    }

    // Gender preference (15% weight)
    const genderScore = this.calculateGenderScore(player.gender, criteria.gender);
    score += genderScore * 0.15;
    if (genderScore === 100) {
      matchReasons.push('Preferencia de género cumplida');
    }

    // Premium boost (10% weight)
    if (player.isPremium) {
      score += 100 * 0.1;
      matchReasons.push('Jugador premium');
    } else {
      score += 50 * 0.1;
    }

    // Ranking bonus (if available)
    if (player.rankingPosition && player.rankingPosition <= 100) {
      matchReasons.push('Jugador rankeado');
    }

    return {
      player,
      location: location as PlayerLocation,
      matchScore: Math.round(score),
      distance: location.distance,
      matchReasons
    };
  }

  private calculateSkillMatch(playerSkill: string, requestedSkill: string): number {
    const playerLevel = this.SKILL_LEVEL_SCORES[playerSkill as keyof typeof this.SKILL_LEVEL_SCORES] || 1;
    const requestedLevel = this.SKILL_LEVEL_SCORES[requestedSkill as keyof typeof this.SKILL_LEVEL_SCORES] || 1;
    
    const difference = Math.abs(playerLevel - requestedLevel);
    
    if (difference === 0) return 100;
    if (difference === 1) return 80;
    if (difference === 2) return 60;
    return 40;
  }

  private calculateDistanceScore(distance: number, maxDistance: number): number {
    if (distance > maxDistance) return 0;
    
    // Linear decay from 100 to 60
    const ratio = distance / maxDistance;
    return Math.max(60, 100 - (ratio * 40));
  }

  private calculateAgeScore(
    dateOfBirth: Date,
    ageRange: { min: number; max: number }
  ): number {
    const age = new Date().getFullYear() - dateOfBirth.getFullYear();
    
    if (age >= ageRange.min && age <= ageRange.max) {
      return 100;
    }
    
    // Calculate how far outside the range
    const minDistance = Math.max(0, ageRange.min - age);
    const maxDistance = Math.max(0, age - ageRange.max);
    const totalDistance = minDistance + maxDistance;
    
    // Decay score based on distance from range
    if (totalDistance <= 5) return 80;
    if (totalDistance <= 10) return 60;
    if (totalDistance <= 15) return 40;
    return 20;
  }

  private calculateGenderScore(playerGender: string, preferredGender?: string): number {
    if (!preferredGender || preferredGender === 'any') {
      return 100;
    }
    
    return playerGender.toLowerCase() === preferredGender.toLowerCase() ? 100 : 0;
  }

  async updateMatchStatus(
    matchId: number,
    playerId: number,
    status: 'accepted' | 'declined',
    message?: string
  ): Promise<PlayerFinderMatch> {
    const match = await PlayerFinderMatch.findOne({
      where: {
        id: matchId,
        playerId
      },
      include: [
        {
          model: PlayerFinderRequest,
          as: 'request'
        }
      ]
    });

    if (!match) {
      throw new Error('Match not found');
    }

    if (match.status !== 'pending') {
      throw new Error('Match already responded to');
    }

    match.status = status;
    match.respondedAt = new Date();
    match.message = message;
    await match.save();

    // Update request current players if accepted
    if (status === 'accepted' && match.request) {
      await PlayerFinderRequest.update(
        { 
          currentPlayers: match.request.currentPlayers + 1 
        },
        { 
          where: { id: match.request.id } 
        }
      );

      // Check if request is full
      if (match.request.currentPlayers + 1 >= match.request.maxPlayers) {
        await PlayerFinderRequest.update(
          { 
            status: 'completed',
            isActive: false
          },
          { 
            where: { id: match.request.id } 
          }
        );
      }
    }

    return match;
  }

  async getActiveRequests(filters: FinderRequestFilters = {}): Promise<{
    requests: PlayerFinderRequest[];
    total: number;
  }> {
    const {
      skillLevel,
      maxDistance,
      location,
      status = ['active'],
      playingStyle,
      limit = 20,
      offset = 0
    } = filters;

    const whereConditions: any = {
      status: {
        [Op.in]: status
      },
      isActive: true,
      expiresAt: {
        [Op.gt]: new Date()
      }
    };

    if (skillLevel) {
      whereConditions.skillLevel = skillLevel;
    }

    if (maxDistance) {
      whereConditions.maxDistance = {
        [Op.lte]: maxDistance
      };
    }

    if (playingStyle) {
      whereConditions.playingStyle = playingStyle;
    }

    const { count, rows } = await PlayerFinderRequest.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Player,
          as: 'requester',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'profileImageUrl']
            }
          ]
        },
        {
          model: PlayerLocation,
          as: 'location'
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    // Filter by distance if location provided
    let filteredRequests = rows;
    if (location) {
      filteredRequests = rows.filter(request => {
        if (!request.location) return false;
        
        const distance = locationService.calculateDistance(
          location.latitude,
          location.longitude,
          request.location.latitude,
          request.location.longitude
        );
        
        return distance <= (maxDistance || request.maxDistance);
      });
    }

    return {
      requests: filteredRequests,
      total: count
    };
  }

  async getPlayerMatches(playerId: number): Promise<PlayerFinderMatch[]> {
    return await PlayerFinderMatch.findAll({
      where: {
        playerId
      },
      include: [
        {
          model: PlayerFinderRequest,
          as: 'request',
          include: [
            {
              model: Player,
              as: 'requester',
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'firstName', 'lastName', 'profileImageUrl']
                }
              ]
            },
            {
              model: PlayerLocation,
              as: 'location'
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  async getRequestMatches(requestId: number): Promise<PlayerFinderMatch[]> {
    return await PlayerFinderMatch.findAll({
      where: {
        requestId
      },
      include: [
        {
          model: Player,
          as: 'player',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'profileImageUrl']
            }
          ]
        }
      ],
      order: [['matchScore', 'DESC'], ['createdAt', 'ASC']]
    });
  }

  async expireOldRequests(): Promise<number> {
    const result = await PlayerFinderRequest.update(
      {
        status: 'cancelled',
        isActive: false
      },
      {
        where: {
          [Op.or]: [
            {
              expiresAt: {
                [Op.lt]: new Date()
              }
            },
            {
              createdAt: {
                [Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
              },
              status: 'active'
            }
          ]
        }
      }
    );

    return result[0]; // Number of affected rows
  }

  async cancelRequest(requestId: number, playerId: number): Promise<void> {
    const request = await PlayerFinderRequest.findOne({
      where: {
        id: requestId,
        requesterId: playerId
      }
    });

    if (!request) {
      throw new Error('Request not found or not owned by player');
    }

    request.status = 'cancelled';
    request.isActive = false;
    await request.save();
  }
}

export default new PlayerFinderService();