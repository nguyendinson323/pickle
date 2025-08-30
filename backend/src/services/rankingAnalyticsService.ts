import { 
  Ranking, 
  RankingHistory,
  PointCalculation,
  Tournament,
  Player,
  State
} from '../models';
import { 
  RankingType, 
  RankingCategory 
} from '../models/Ranking';
import { Op } from 'sequelize';
import sequelize from '../config/database';

interface RankingAnalyticsData {
  totalPlayers: number;
  activeRankings: number;
  averagePoints: number;
  topPlayers: any[];
  recentChanges: any[];
  distributionByState: any[];
  distributionByAgeGroup: any[];
  distributionByGender: any[];
  tournamentActivity: any[];
  pointsDistribution: any[];
}

interface PlayerProgressData {
  playerId: number;
  currentRankings: any[];
  rankingHistory: any[];
  tournamentParticipation: any[];
  pointsEvolution: any[];
  achievements: any[];
}

interface StateRankingAnalytics {
  stateId: number;
  stateName: string;
  totalPlayers: number;
  averagePoints: number;
  topPlayers: any[];
  recentActivity: any[];
  growthTrends: any[];
}

class RankingAnalyticsService {

  // Get comprehensive ranking analytics
  async getRankingAnalytics(
    category: RankingCategory,
    rankingType: RankingType,
    options: {
      stateId?: number;
      ageGroup?: string;
      gender?: string;
      dateRange?: { start: Date; end: Date };
    } = {}
  ): Promise<RankingAnalyticsData> {
    try {
      const { stateId, ageGroup, gender, dateRange } = options;

      // Build base where clause
      const baseWhere: any = {
        category,
        rankingType,
        isActive: true
      };

      if (stateId) baseWhere.stateId = stateId;
      if (ageGroup) baseWhere.ageGroup = ageGroup;
      if (gender) baseWhere.gender = gender;

      // Get basic statistics
      const [
        totalPlayersResult,
        activeRankingsResult,
        averagePointsResult
      ] = await Promise.all([
        Ranking.count({ where: baseWhere }),
        Ranking.count({ where: { ...baseWhere, points: { [Op.gt]: 0 } } }),
        Ranking.findOne({
          where: baseWhere,
          attributes: [[sequelize.fn('AVG', sequelize.col('points')), 'avgPoints']],
          raw: true
        })
      ]);

      const totalPlayers = totalPlayersResult;
      const activeRankings = activeRankingsResult;
      const averagePoints = parseFloat((averagePointsResult as any)?.avgPoints || '0');

      // Get top players
      const topPlayers = await Ranking.findAll({
        where: baseWhere,
        include: [{ model: Player }],
        order: [['position', 'ASC']],
        limit: 10
      });

      // Get recent ranking changes
      const historyWhere: any = { rankingType, category };
      if (stateId) historyWhere.stateId = stateId;
      if (ageGroup) historyWhere.ageGroup = ageGroup;
      if (gender) historyWhere.gender = gender;
      if (dateRange) {
        historyWhere.changeDate = {
          [Op.between]: [dateRange.start, dateRange.end]
        };
      } else {
        // Default to last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        historyWhere.changeDate = {
          [Op.gte]: thirtyDaysAgo
        };
      }

      const recentChanges = await RankingHistory.findAll({
        where: historyWhere,
        include: [
          { model: Player },
          { model: Tournament }
        ],
        order: [['changeDate', 'DESC']],
        limit: 20
      });

      // Get distribution by state (only if not filtering by specific state)
      let distributionByState = [];
      if (!stateId) {
        distributionByState = await Ranking.findAll({
          where: { category, rankingType, isActive: true },
          include: [{ model: State }],
          attributes: [
            'stateId',
            [sequelize.fn('COUNT', sequelize.col('Ranking.id')), 'playerCount'],
            [sequelize.fn('AVG', sequelize.col('points')), 'averagePoints']
          ],
          group: ['stateId', 'State.id', 'State.name'],
          order: [[sequelize.fn('COUNT', sequelize.col('Ranking.id')), 'DESC']]
        });
      }

      // Get distribution by age group (only if not filtering by specific age group)
      let distributionByAgeGroup = [];
      if (!ageGroup) {
        distributionByAgeGroup = await Ranking.findAll({
          where: baseWhere,
          attributes: [
            'ageGroup',
            [sequelize.fn('COUNT', sequelize.col('id')), 'playerCount'],
            [sequelize.fn('AVG', sequelize.col('points')), 'averagePoints']
          ],
          group: ['ageGroup'],
          order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
        });
      }

      // Get distribution by gender (only if not filtering by specific gender)
      let distributionByGender = [];
      if (!gender) {
        distributionByGender = await Ranking.findAll({
          where: baseWhere,
          attributes: [
            'gender',
            [sequelize.fn('COUNT', sequelize.col('id')), 'playerCount'],
            [sequelize.fn('AVG', sequelize.col('points')), 'averagePoints']
          ],
          group: ['gender'],
          order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
        });
      }

      // Get tournament activity
      const tournamentActivity = await PointCalculation.findAll({
        where: {
          ...(dateRange && {
            calculatedAt: {
              [Op.between]: [dateRange.start, dateRange.end]
            }
          })
        },
        include: [
          { model: Tournament },
          { model: Player }
        ],
        attributes: [
          [sequelize.fn('DATE', sequelize.col('calculatedAt')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('PointCalculation.id')), 'participantCount'],
          [sequelize.fn('AVG', sequelize.col('totalPoints')), 'averagePoints']
        ],
        group: [sequelize.fn('DATE', sequelize.col('calculatedAt'))],
        order: [[sequelize.fn('DATE', sequelize.col('calculatedAt')), 'DESC']],
        limit: 30
      });

      // Get points distribution
      const pointsDistribution = await Ranking.findAll({
        where: baseWhere,
        attributes: [
          [sequelize.literal(`
            CASE 
              WHEN points = 0 THEN '0'
              WHEN points <= 100 THEN '1-100'
              WHEN points <= 500 THEN '101-500'
              WHEN points <= 1000 THEN '501-1000'
              WHEN points <= 2000 THEN '1001-2000'
              ELSE '2000+'
            END
          `), 'pointRange'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'playerCount']
        ],
        group: ['pointRange'],
        order: [['pointRange', 'ASC']]
      });

      return {
        totalPlayers,
        activeRankings,
        averagePoints,
        topPlayers,
        recentChanges,
        distributionByState,
        distributionByAgeGroup,
        distributionByGender,
        tournamentActivity,
        pointsDistribution
      };

    } catch (error) {
      throw new Error(`Failed to get ranking analytics: ${error.message}`);
    }
  }

  // Get player progress analytics
  async getPlayerProgress(
    playerId: number,
    dateRange?: { start: Date; end: Date }
  ): Promise<PlayerProgressData> {
    try {
      // Get current rankings
      const currentRankings = await Ranking.findAll({
        where: { playerId, isActive: true },
        include: [{ model: State }],
        order: [['category', 'ASC'], ['rankingType', 'ASC']]
      });

      // Get ranking history
      const historyWhere: any = { playerId };
      if (dateRange) {
        historyWhere.changeDate = {
          [Op.between]: [dateRange.start, dateRange.end]
        };
      }

      const rankingHistory = await RankingHistory.findAll({
        where: historyWhere,
        include: [{ model: Tournament }],
        order: [['changeDate', 'DESC']],
        limit: 50
      });

      // Get tournament participation
      const tournamentWhere: any = { playerId };
      if (dateRange) {
        tournamentWhere.calculatedAt = {
          [Op.between]: [dateRange.start, dateRange.end]
        };
      }

      const tournamentParticipation = await PointCalculation.findAll({
        where: tournamentWhere,
        include: [{ model: Tournament }],
        order: [['calculatedAt', 'DESC']],
        limit: 20
      });

      // Get points evolution over time
      const pointsEvolution = await RankingHistory.findAll({
        where: {
          playerId,
          ...(dateRange && {
            changeDate: {
              [Op.between]: [dateRange.start, dateRange.end]
            }
          })
        },
        attributes: [
          'changeDate',
          'rankingType',
          'category',
          'newPoints',
          'positionChange'
        ],
        order: [['changeDate', 'ASC']]
      });

      // Calculate achievements
      const achievements = await this.calculatePlayerAchievements(playerId, dateRange);

      return {
        playerId,
        currentRankings,
        rankingHistory,
        tournamentParticipation,
        pointsEvolution,
        achievements
      };

    } catch (error) {
      throw new Error(`Failed to get player progress: ${error.message}`);
    }
  }

  // Get state ranking analytics
  async getStateRankingAnalytics(
    stateId: number,
    dateRange?: { start: Date; end: Date }
  ): Promise<StateRankingAnalytics> {
    try {
      const state = await State.findByPk(stateId);
      if (!state) {
        throw new Error('State not found');
      }

      // Get total players in state
      const totalPlayers = await Ranking.count({
        where: { stateId, isActive: true }
      });

      // Get average points
      const averagePointsResult = await Ranking.findOne({
        where: { stateId, isActive: true },
        attributes: [[sequelize.fn('AVG', sequelize.col('points')), 'avgPoints']],
        raw: true
      });
      const averagePoints = parseFloat((averagePointsResult as any)?.avgPoints || '0');

      // Get top players
      const topPlayers = await Ranking.findAll({
        where: { 
          stateId, 
          isActive: true,
          category: RankingCategory.STATE
        },
        include: [{ model: Player }],
        order: [['position', 'ASC']],
        limit: 10
      });

      // Get recent activity
      const activityWhere: any = { stateId };
      if (dateRange) {
        activityWhere.changeDate = {
          [Op.between]: [dateRange.start, dateRange.end]
        };
      } else {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        activityWhere.changeDate = {
          [Op.gte]: thirtyDaysAgo
        };
      }

      const recentActivity = await RankingHistory.findAll({
        where: activityWhere,
        include: [
          { model: Player },
          { model: Tournament }
        ],
        order: [['changeDate', 'DESC']],
        limit: 15
      });

      // Get growth trends (monthly)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const growthTrends = await RankingHistory.findAll({
        where: {
          stateId,
          changeDate: {
            [Op.gte]: sixMonthsAgo
          }
        },
        attributes: [
          [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('changeDate')), 'month'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'activityCount'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('playerId'))), 'activePlayers'],
          [sequelize.fn('AVG', sequelize.col('pointsChange')), 'averagePointsChange']
        ],
        group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('changeDate'))],
        order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('changeDate')), 'ASC']]
      });

      return {
        stateId,
        stateName: state.name,
        totalPlayers,
        averagePoints,
        topPlayers,
        recentActivity,
        growthTrends
      };

    } catch (error) {
      throw new Error(`Failed to get state analytics: ${error.message}`);
    }
  }

  // Calculate player achievements
  private async calculatePlayerAchievements(
    playerId: number,
    dateRange?: { start: Date; end: Date }
  ): Promise<any[]> {
    const achievements = [];

    try {
      // Get player's best positions
      const bestPositions = await Ranking.findAll({
        where: { playerId, isActive: true },
        order: [['position', 'ASC']],
        limit: 3
      });

      bestPositions.forEach(ranking => {
        if (ranking.position === 1) {
          achievements.push({
            type: 'first_place',
            title: `#1 in ${ranking.category} ${ranking.rankingType}`,
            description: `Achieved first place in ${ranking.category} ${ranking.rankingType} rankings`,
            points: ranking.points,
            achievedAt: ranking.lastCalculated
          });
        } else if (ranking.position <= 3) {
          achievements.push({
            type: 'top_three',
            title: `#${ranking.position} in ${ranking.category} ${ranking.rankingType}`,
            description: `Achieved top 3 position in ${ranking.category} ${ranking.rankingType} rankings`,
            points: ranking.points,
            achievedAt: ranking.lastCalculated
          });
        } else if (ranking.position <= 10) {
          achievements.push({
            type: 'top_ten',
            title: `#${ranking.position} in ${ranking.category} ${ranking.rankingType}`,
            description: `Achieved top 10 position in ${ranking.category} ${ranking.rankingType} rankings`,
            points: ranking.points,
            achievedAt: ranking.lastCalculated
          });
        }
      });

      // Get tournament participation achievements
      const tournamentCount = await PointCalculation.count({
        where: {
          playerId,
          ...(dateRange && {
            calculatedAt: {
              [Op.between]: [dateRange.start, dateRange.end]
            }
          })
        }
      });

      if (tournamentCount >= 10) {
        achievements.push({
          type: 'active_player',
          title: 'Active Tournament Player',
          description: `Participated in ${tournamentCount} tournaments`,
          count: tournamentCount
        });
      }

      // Get biggest point gains
      const biggestGain = await RankingHistory.findOne({
        where: {
          playerId,
          pointsChange: { [Op.gt]: 0 },
          ...(dateRange && {
            changeDate: {
              [Op.between]: [dateRange.start, dateRange.end]
            }
          })
        },
        order: [['pointsChange', 'DESC']]
      });

      if (biggestGain && biggestGain.pointsChange > 100) {
        achievements.push({
          type: 'big_gain',
          title: 'Breakthrough Performance',
          description: `Gained ${biggestGain.pointsChange} points in a single tournament`,
          points: biggestGain.pointsChange,
          achievedAt: biggestGain.changeDate
        });
      }

      // Get consistency achievements (multiple tournaments with positive gains)
      const consistentGains = await RankingHistory.count({
        where: {
          playerId,
          pointsChange: { [Op.gt]: 0 },
          ...(dateRange && {
            changeDate: {
              [Op.between]: [dateRange.start, dateRange.end]
            }
          })
        }
      });

      if (consistentGains >= 5) {
        achievements.push({
          type: 'consistent_improvement',
          title: 'Consistent Improvement',
          description: `Achieved positive results in ${consistentGains} tournaments`,
          count: consistentGains
        });
      }

      return achievements;

    } catch (error) {
      console.error('Error calculating achievements:', error);
      return [];
    }
  }

  // Get tournament impact analysis
  async getTournamentImpactAnalysis(tournamentId: number): Promise<any> {
    try {
      const tournament = await Tournament.findByPk(tournamentId);
      if (!tournament) {
        throw new Error('Tournament not found');
      }

      // Get all point calculations for this tournament
      const pointCalculations = await PointCalculation.findAll({
        where: { tournamentId },
        include: [{ model: Player }],
        order: [['totalPoints', 'DESC']]
      });

      // Get all ranking changes caused by this tournament
      const rankingChanges = await RankingHistory.findAll({
        where: { tournamentId },
        include: [{ model: Player }],
        order: [['pointsChange', 'DESC']]
      });

      // Calculate statistics
      const totalParticipants = pointCalculations.length;
      const averagePoints = pointCalculations.reduce((sum, pc) => sum + pc.totalPoints, 0) / totalParticipants;
      const maxPoints = Math.max(...pointCalculations.map(pc => pc.totalPoints));
      const minPoints = Math.min(...pointCalculations.map(pc => pc.totalPoints));

      const positiveChanges = rankingChanges.filter(rc => rc.pointsChange > 0).length;
      const negativeChanges = rankingChanges.filter(rc => rc.pointsChange < 0).length;
      const biggestGainer = rankingChanges.reduce((max, rc) => 
        rc.pointsChange > max.pointsChange ? rc : max, 
        rankingChanges[0]
      );

      return {
        tournament,
        statistics: {
          totalParticipants,
          averagePoints,
          maxPoints,
          minPoints,
          positiveChanges,
          negativeChanges
        },
        topPerformers: pointCalculations.slice(0, 10),
        biggestChanges: rankingChanges.slice(0, 10),
        biggestGainer
      };

    } catch (error) {
      throw new Error(`Failed to analyze tournament impact: ${error.message}`);
    }
  }

  // Get ranking trends over time
  async getRankingTrends(
    category: RankingCategory,
    rankingType: RankingType,
    options: {
      stateId?: number;
      playerId?: number;
      period: 'week' | 'month' | 'quarter' | 'year';
      limit?: number;
    }
  ): Promise<any[]> {
    try {
      const { stateId, playerId, period, limit = 12 } = options;

      let dateGrouping: string;
      switch (period) {
        case 'week':
          dateGrouping = 'week';
          break;
        case 'month':
          dateGrouping = 'month';
          break;
        case 'quarter':
          dateGrouping = 'quarter';
          break;
        case 'year':
          dateGrouping = 'year';
          break;
        default:
          dateGrouping = 'month';
      }

      const where: any = { rankingType, category };
      if (stateId) where.stateId = stateId;
      if (playerId) where.playerId = playerId;

      const trends = await RankingHistory.findAll({
        where,
        attributes: [
          [sequelize.fn('DATE_TRUNC', dateGrouping, sequelize.col('changeDate')), 'period'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalChanges'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('playerId'))), 'activePlayers'],
          [sequelize.fn('AVG', sequelize.col('pointsChange')), 'averagePointsChange'],
          [sequelize.fn('SUM', sequelize.literal('CASE WHEN points_change > 0 THEN 1 ELSE 0 END')), 'positiveChanges'],
          [sequelize.fn('SUM', sequelize.literal('CASE WHEN points_change < 0 THEN 1 ELSE 0 END')), 'negativeChanges']
        ],
        group: [sequelize.fn('DATE_TRUNC', dateGrouping, sequelize.col('changeDate'))],
        order: [[sequelize.fn('DATE_TRUNC', dateGrouping, sequelize.col('changeDate')), 'DESC']],
        limit
      });

      return trends;

    } catch (error) {
      throw new Error(`Failed to get ranking trends: ${error.message}`);
    }
  }

  // Get performance comparison between players
  async getPlayerComparison(playerIds: number[]): Promise<any> {
    try {
      if (playerIds.length > 10) {
        throw new Error('Maximum 10 players can be compared at once');
      }

      const comparisons = await Promise.all(
        playerIds.map(async (playerId) => {
          const [player, rankings, recentHistory, tournamentStats] = await Promise.all([
            Player.findByPk(playerId),
            Ranking.findAll({ where: { playerId, isActive: true } }),
            RankingHistory.findAll({
              where: { playerId },
              order: [['changeDate', 'DESC']],
              limit: 10
            }),
            PointCalculation.findAll({
              where: { playerId },
              attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'tournamentCount'],
                [sequelize.fn('AVG', sequelize.col('totalPoints')), 'averagePoints'],
                [sequelize.fn('MAX', sequelize.col('totalPoints')), 'bestPerformance'],
                [sequelize.fn('AVG', sequelize.col('finalPlacement')), 'averagePlacement']
              ],
              raw: true
            })
          ]);

          return {
            player,
            rankings,
            recentHistory,
            stats: tournamentStats[0] || {
              tournamentCount: 0,
              averagePoints: 0,
              bestPerformance: 0,
              averagePlacement: 0
            }
          };
        })
      );

      return {
        players: comparisons,
        comparisonDate: new Date()
      };

    } catch (error) {
      throw new Error(`Failed to compare players: ${error.message}`);
    }
  }
}

export default new RankingAnalyticsService();