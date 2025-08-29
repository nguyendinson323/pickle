import { 
  Ranking, 
  RankingHistory,
  PointCalculation,
  Tournament,
  TournamentMatch,
  Player,
  State
} from '../models';
import { 
  RankingType, 
  RankingCategory 
} from '../models/Ranking';
import { Op } from 'sequelize';
import sequelize from '../config/database';

interface TournamentPointValues {
  National: number;
  State: number;
  Municipal: number;
  Local: number;
}

interface PlacementMultipliers {
  1: number; // Winner
  2: number; // Runner-up
  3: number; // Semi-finalist
  4: number; // Semi-finalist
  default: number; // Other placements
}

class RankingService {
  private readonly TOURNAMENT_POINTS: TournamentPointValues = {
    National: 1000,
    State: 500,
    Municipal: 250,
    Local: 100
  };

  private readonly PLACEMENT_MULTIPLIERS: PlacementMultipliers = {
    1: 1.0,      // Winner: 100%
    2: 0.7,      // Runner-up: 70%
    3: 0.5,      // Semi-finalist: 50%
    4: 0.5,      // Semi-finalist: 50%
    default: 0.3 // Other placements: 30%
  };

  private readonly LEVEL_MULTIPLIERS = {
    'Beginner': 0.8,
    'Intermediate': 1.0,
    'Advanced': 1.2,
    'Professional': 1.5
  };

  private readonly DECAY_FACTOR = 0.95; // 5% decay per period
  private readonly ACTIVITY_BONUS_THRESHOLD = 5; // Minimum tournaments for bonus
  private readonly MAX_ACTIVITY_BONUS = 50; // Maximum activity bonus points

  // Calculate base points for a tournament
  private getBasePoints(tournamentLevel: string): number {
    return this.TOURNAMENT_POINTS[tournamentLevel as keyof TournamentPointValues] || this.TOURNAMENT_POINTS.Local;
  }

  // Calculate placement multiplier based on final position
  private getPlacementMultiplier(finalPosition: number, totalPlayers: number): number {
    if (finalPosition <= 4) {
      return this.PLACEMENT_MULTIPLIERS[finalPosition as keyof PlacementMultipliers] || this.PLACEMENT_MULTIPLIERS.default;
    }
    
    // Calculate percentage-based multiplier for other positions
    const positionPercentile = (totalPlayers - finalPosition + 1) / totalPlayers;
    
    if (positionPercentile >= 0.8) return 0.4; // Top 20%
    if (positionPercentile >= 0.6) return 0.3; // Top 40%
    if (positionPercentile >= 0.4) return 0.2; // Top 60%
    return 0.1; // Bottom 40%
  }

  // Calculate level multiplier based on player's skill level
  private getLevelMultiplier(playerLevel?: string): number {
    if (!playerLevel) return 1.0;
    return this.LEVEL_MULTIPLIERS[playerLevel as keyof typeof this.LEVEL_MULTIPLIERS] || 1.0;
  }

  // Calculate opponent bonus based on average opponent rating
  private calculateOpponentBonus(averageOpponentRating: number, playerRating: number): number {
    if (averageOpponentRating <= playerRating) return 0;
    
    const ratingDifference = averageOpponentRating - playerRating;
    return Math.min(ratingDifference * 0.1, 100); // Max 100 bonus points
  }

  // Calculate activity bonus based on tournament participation
  private calculateActivityBonus(tournamentsPlayed: number): number {
    if (tournamentsPlayed < this.ACTIVITY_BONUS_THRESHOLD) return 0;
    
    const bonus = (tournamentsPlayed - this.ACTIVITY_BONUS_THRESHOLD) * 5;
    return Math.min(bonus, this.MAX_ACTIVITY_BONUS);
  }

  // Calculate participation bonus based on match performance
  private calculateParticipationBonus(matchesWon: number, matchesLost: number): number {
    const totalMatches = matchesWon + matchesLost;
    if (totalMatches === 0) return 1.0;
    
    const winRate = matchesWon / totalMatches;
    return 1.0 + (winRate * 0.2); // Up to 20% bonus for 100% win rate
  }

  // Calculate points for a tournament result
  async calculateTournamentPoints(
    playerId: number,
    tournamentId: number,
    finalPlacement: number,
    totalPlayers: number,
    matchesWon: number = 0,
    matchesLost: number = 0,
    averageOpponentRating: number = 0
  ): Promise<PointCalculation> {
    const transaction = await sequelize.transaction();

    try {
      // Get tournament and player details
      const tournament = await Tournament.findByPk(tournamentId);
      const player = await Player.findByPk(playerId);

      if (!tournament || !player) {
        throw new Error('Tournament or player not found');
      }

      // Calculate base points
      const basePoints = this.getBasePoints(tournament.level);
      
      // Calculate multipliers and bonuses
      const placementMultiplier = this.getPlacementMultiplier(finalPlacement, totalPlayers);
      const levelMultiplier = this.getLevelMultiplier(player.nrtpLevel);
      const opponentBonus = this.calculateOpponentBonus(averageOpponentRating, player.currentRating);
      
      // Get player's tournament count for activity bonus
      const playerTournaments = await PointCalculation.count({
        where: { playerId },
        transaction
      });
      const activityBonus = this.calculateActivityBonus(playerTournaments + 1);
      
      const participationBonus = this.calculateParticipationBonus(matchesWon, matchesLost);

      // Calculate total points
      const calculatedPoints = (basePoints * placementMultiplier * levelMultiplier * participationBonus) + opponentBonus + activityBonus;
      const totalPoints = Math.round(calculatedPoints * 100) / 100;

      // Create point calculation record
      const pointCalculation = await PointCalculation.create({
        tournamentId,
        playerId,
        basePoints,
        placementMultiplier,
        levelMultiplier,
        opponentBonus,
        activityBonus,
        participationBonus,
        totalPoints,
        finalPlacement,
        totalPlayers,
        matchesWon,
        matchesLost,
        averageOpponentRating,
        calculationDetails: {
          tournamentLevel: tournament.level,
          playerLevel: player.nrtpLevel,
          calculation: {
            basePoints,
            placementMultiplier,
            levelMultiplier,
            participationBonus,
            opponentBonus,
            activityBonus,
            totalPoints
          }
        },
        calculatedAt: new Date()
      }, { transaction });

      await transaction.commit();
      return pointCalculation;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Update player rankings after tournament completion
  async updatePlayerRankings(tournamentId: number): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      // Get all point calculations for this tournament
      const pointCalculations = await PointCalculation.findAll({
        where: { tournamentId },
        include: [
          { 
            model: Tournament,
            include: [{ model: State }]
          },
          { model: Player }
        ],
        transaction
      });

      if (!pointCalculations.length) {
        throw new Error('No point calculations found for tournament');
      }

      const tournament = pointCalculations[0].Tournament;
      
      // Update rankings for each category
      await Promise.all([
        this.updateNationalRankings(pointCalculations, transaction),
        this.updateStateRankings(pointCalculations, tournament.stateId, transaction),
        this.updateAgeGroupRankings(pointCalculations, transaction),
        this.updateGenderRankings(pointCalculations, transaction)
      ]);

      await transaction.commit();

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Update national rankings
  private async updateNationalRankings(
    pointCalculations: PointCalculation[], 
    transaction: any
  ): Promise<void> {
    for (const calculation of pointCalculations) {
      const player = calculation.Player;
      
      // Get or create national ranking for each type
      for (const rankingType of Object.values(RankingType)) {
        await this.updateRankingRecord({
          playerId: calculation.playerId,
          rankingType,
          category: RankingCategory.NATIONAL,
          points: calculation.totalPoints,
          tournamentId: calculation.tournamentId,
          gender: player.gender,
          ageGroup: this.calculateAgeGroup(player.birthDate),
          transaction
        });
      }
    }
  }

  // Update state rankings
  private async updateStateRankings(
    pointCalculations: PointCalculation[],
    stateId: number,
    transaction: any
  ): Promise<void> {
    for (const calculation of pointCalculations) {
      const player = calculation.Player;
      
      for (const rankingType of Object.values(RankingType)) {
        await this.updateRankingRecord({
          playerId: calculation.playerId,
          rankingType,
          category: RankingCategory.STATE,
          points: calculation.totalPoints,
          tournamentId: calculation.tournamentId,
          stateId,
          gender: player.gender,
          ageGroup: this.calculateAgeGroup(player.birthDate),
          transaction
        });
      }
    }
  }

  // Update age group rankings
  private async updateAgeGroupRankings(
    pointCalculations: PointCalculation[],
    transaction: any
  ): Promise<void> {
    for (const calculation of pointCalculations) {
      const player = calculation.Player;
      const ageGroup = this.calculateAgeGroup(player.birthDate);
      
      for (const rankingType of Object.values(RankingType)) {
        await this.updateRankingRecord({
          playerId: calculation.playerId,
          rankingType,
          category: RankingCategory.AGE_GROUP,
          points: calculation.totalPoints,
          tournamentId: calculation.tournamentId,
          ageGroup,
          gender: player.gender,
          transaction
        });
      }
    }
  }

  // Update gender rankings
  private async updateGenderRankings(
    pointCalculations: PointCalculation[],
    transaction: any
  ): Promise<void> {
    for (const calculation of pointCalculations) {
      const player = calculation.Player;
      
      for (const rankingType of Object.values(RankingType)) {
        await this.updateRankingRecord({
          playerId: calculation.playerId,
          rankingType,
          category: RankingCategory.GENDER,
          points: calculation.totalPoints,
          tournamentId: calculation.tournamentId,
          gender: player.gender,
          ageGroup: this.calculateAgeGroup(player.birthDate),
          transaction
        });
      }
    }
  }

  // Update individual ranking record
  private async updateRankingRecord(params: {
    playerId: number;
    rankingType: RankingType;
    category: RankingCategory;
    points: number;
    tournamentId: number;
    stateId?: number;
    ageGroup?: string;
    gender?: string;
    transaction: any;
  }): Promise<void> {
    const {
      playerId,
      rankingType,
      category,
      points,
      tournamentId,
      stateId,
      ageGroup,
      gender,
      transaction
    } = params;

    // Find existing ranking
    const existingRanking = await Ranking.findOne({
      where: {
        playerId,
        rankingType,
        category,
        ...(stateId && { stateId }),
        ...(ageGroup && { ageGroup }),
        ...(gender && { gender })
      },
      transaction
    });

    if (existingRanking) {
      // Update existing ranking
      const oldPoints = existingRanking.points;
      const oldPosition = existingRanking.position;
      const newPoints = oldPoints + points;

      await existingRanking.update({
        previousPoints: oldPoints,
        previousPosition: oldPosition,
        points: newPoints,
        tournamentsPlayed: existingRanking.tournamentsPlayed + 1,
        lastTournamentDate: new Date(),
        lastCalculated: new Date()
      }, { transaction });

      // Create history record
      await RankingHistory.create({
        playerId,
        rankingType,
        category,
        oldPosition,
        newPosition: oldPosition, // Will be updated after position recalculation
        oldPoints,
        newPoints,
        pointsChange: points,
        positionChange: 0, // Will be updated after position recalculation
        changeReason: `Tournament completion: ${tournamentId}`,
        tournamentId,
        changeDate: new Date(),
        stateId,
        ageGroup,
        gender
      }, { transaction });

    } else {
      // Create new ranking
      await Ranking.create({
        playerId,
        rankingType,
        category,
        position: 1, // Temporary, will be recalculated
        points,
        previousPosition: 0,
        previousPoints: 0,
        stateId,
        ageGroup,
        gender,
        tournamentsPlayed: 1,
        lastTournamentDate: new Date(),
        activityBonus: 0,
        decayFactor: 1.0,
        lastCalculated: new Date(),
        isActive: true
      }, { transaction });

      // Create history record for new ranking
      await RankingHistory.create({
        playerId,
        rankingType,
        category,
        oldPosition: 0,
        newPosition: 1, // Will be updated after position recalculation
        oldPoints: 0,
        newPoints: points,
        pointsChange: points,
        positionChange: 1,
        changeReason: `First tournament participation: ${tournamentId}`,
        tournamentId,
        changeDate: new Date(),
        stateId,
        ageGroup,
        gender
      }, { transaction });
    }
  }

  // Recalculate positions for all rankings in a category
  async recalculatePositions(
    rankingType: RankingType,
    category: RankingCategory,
    stateId?: number,
    ageGroup?: string,
    gender?: string
  ): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      // Get all rankings in this category ordered by points
      const rankings = await Ranking.findAll({
        where: {
          rankingType,
          category,
          isActive: true,
          ...(stateId && { stateId }),
          ...(ageGroup && { ageGroup }),
          ...(gender && { gender })
        },
        order: [['points', 'DESC']],
        transaction
      });

      // Update positions
      for (let i = 0; i < rankings.length; i++) {
        const ranking = rankings[i];
        const newPosition = i + 1;
        const oldPosition = ranking.position;

        if (oldPosition !== newPosition) {
          await ranking.update({
            previousPosition: oldPosition,
            position: newPosition
          }, { transaction });

          // Update history record with new position
          await RankingHistory.update({
            newPosition,
            positionChange: oldPosition - newPosition
          }, {
            where: {
              playerId: ranking.playerId,
              rankingType,
              category,
              oldPosition,
              ...(stateId && { stateId }),
              ...(ageGroup && { ageGroup }),
              ...(gender && { gender })
            },
            order: [['changeDate', 'DESC']],
            limit: 1,
            transaction
          });
        }
      }

      await transaction.commit();

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Calculate age group from birth date
  private calculateAgeGroup(birthDate: Date): string {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    const actualAge = monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate()) 
      ? age - 1 
      : age;

    if (actualAge < 19) return 'Under 19';
    if (actualAge < 35) return '19-34';
    if (actualAge < 50) return '35-49';
    if (actualAge < 65) return '50-64';
    return '65+';
  }

  // Get player rankings
  async getPlayerRankings(playerId: number): Promise<Ranking[]> {
    return await Ranking.findAll({
      where: { playerId, isActive: true },
      order: [['category', 'ASC'], ['rankingType', 'ASC']]
    });
  }

  // Get ranking by category
  async getRankingsByCategory(
    category: RankingCategory,
    rankingType: RankingType,
    options: {
      stateId?: number;
      ageGroup?: string;
      gender?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ rankings: Ranking[], total: number }> {
    const { stateId, ageGroup, gender, limit = 50, offset = 0 } = options;

    const where: any = {
      category,
      rankingType,
      isActive: true
    };

    if (stateId) where.stateId = stateId;
    if (ageGroup) where.ageGroup = ageGroup;
    if (gender) where.gender = gender;

    const { count, rows } = await Ranking.findAndCountAll({
      where,
      include: [{ model: Player }],
      order: [['position', 'ASC']],
      limit,
      offset
    });

    return { rankings: rows, total: count };
  }

  // Get ranking history for a player
  async getPlayerRankingHistory(
    playerId: number,
    rankingType?: RankingType,
    category?: RankingCategory,
    limit: number = 20
  ): Promise<RankingHistory[]> {
    const where: any = { playerId };
    
    if (rankingType) where.rankingType = rankingType;
    if (category) where.category = category;

    return await RankingHistory.findAll({
      where,
      order: [['changeDate', 'DESC']],
      limit,
      include: [{ model: Tournament }]
    });
  }

  // Apply decay to rankings (called periodically)
  async applyRankingDecay(): Promise<void> {
    const transaction = await sequelize.transaction();
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - 6); // 6 months without activity

    try {
      const inactiveRankings = await Ranking.findAll({
        where: {
          lastTournamentDate: {
            [Op.lt]: cutoffDate
          },
          isActive: true
        },
        transaction
      });

      for (const ranking of inactiveRankings) {
        const newPoints = ranking.points * this.DECAY_FACTOR;
        const oldPosition = ranking.position;

        await ranking.update({
          previousPoints: ranking.points,
          points: newPoints,
          decayFactor: this.DECAY_FACTOR,
          lastCalculated: new Date()
        }, { transaction });

        // Create history record
        await RankingHistory.create({
          playerId: ranking.playerId,
          rankingType: ranking.rankingType,
          category: ranking.category,
          oldPosition,
          newPosition: oldPosition, // Will be updated after recalculation
          oldPoints: ranking.points,
          newPoints,
          pointsChange: newPoints - ranking.points,
          positionChange: 0,
          changeReason: 'Ranking decay due to inactivity',
          changeDate: new Date(),
          stateId: ranking.stateId,
          ageGroup: ranking.ageGroup,
          gender: ranking.gender
        }, { transaction });
      }

      await transaction.commit();

      // Recalculate positions after decay
      const categories = await Ranking.findAll({
        attributes: ['rankingType', 'category', 'stateId', 'ageGroup', 'gender'],
        group: ['rankingType', 'category', 'stateId', 'ageGroup', 'gender']
      });

      for (const cat of categories) {
        await this.recalculatePositions(
          cat.rankingType,
          cat.category,
          cat.stateId,
          cat.ageGroup,
          cat.gender
        );
      }

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new RankingService();