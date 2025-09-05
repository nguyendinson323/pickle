import cron from 'node-cron';
import { 
  Tournament,
  TournamentMatch,
  Ranking,
  PointCalculation,
  Player
} from '../models';
import rankingService from './rankingService';
import NotificationService from './notificationService';

const notificationService = new NotificationService();
import sequelize from '../config/database';
import { Op } from 'sequelize';

class AutomatedRankingService {
  private isInitialized = false;

  // Initialize automated ranking processes
  initialize() {
    if (this.isInitialized) {
      console.log('Automated ranking service already initialized');
      return;
    }

    console.log('Initializing automated ranking service...');

    // Schedule daily ranking decay check (runs at 2 AM every day)
    cron.schedule('0 2 * * *', async () => {
      console.log('Running daily ranking decay process...');
      try {
        await this.processRankingDecay();
      } catch (error) {
        console.error('Error in daily ranking decay:', error);
      }
    });

    // Schedule completed tournament check (runs every hour)
    cron.schedule('0 * * * *', async () => {
      console.log('Checking for completed tournaments to process...');
      try {
        await this.processCompletedTournaments();
      } catch (error) {
        console.error('Error processing completed tournaments:', error);
      }
    });

    // Schedule weekly ranking position recalculation (runs Sunday at 3 AM)
    cron.schedule('0 3 * * 0', async () => {
      console.log('Running weekly ranking position recalculation...');
      try {
        await this.recalculateAllRankingPositions();
      } catch (error) {
        console.error('Error in weekly ranking recalculation:', error);
      }
    });

    // Schedule monthly ranking statistics update (runs 1st day of month at 4 AM)
    cron.schedule('0 4 1 * *', async () => {
      console.log('Running monthly ranking statistics update...');
      try {
        await this.updateRankingStatistics();
      } catch (error) {
        console.error('Error in monthly statistics update:', error);
      }
    });

    // Schedule notification for expiring credentials (runs daily at 9 AM)
    cron.schedule('0 9 * * *', async () => {
      console.log('Checking for players needing ranking activity notifications...');
      try {
        await this.sendActivityReminders();
      } catch (error) {
        console.error('Error sending activity reminders:', error);
      }
    });

    this.isInitialized = true;
    console.log('Automated ranking service initialized successfully');
  }

  // Process ranking decay for inactive players
  async processRankingDecay(): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      console.log('Starting ranking decay process...');
      
      await rankingService.applyRankingDecay();
      
      console.log('Ranking decay process completed successfully');
      await transaction.commit();

    } catch (error) {
      await transaction.rollback();
      console.error('Error in ranking decay process:', error);
      throw error;
    }
  }

  // Process completed tournaments that haven't been processed for rankings
  async processCompletedTournaments(): Promise<void> {
    try {
      // Find completed tournaments that haven't been processed for rankings
      const completedTournaments = await Tournament.findAll({
        where: {
          status: 'completed',
          endDate: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        },
        include: [
          {
            model: PointCalculation,
            as: 'pointCalculations',
            required: false
          }
        ]
      });

      // Filter tournaments that don't have point calculations yet
      const unprocessedTournaments = completedTournaments.filter(
        tournament => !(tournament as any).pointCalculations || (tournament as any).pointCalculations.length === 0
      );

      if (unprocessedTournaments.length === 0) {
        console.log('No unprocessed completed tournaments found');
        return;
      }

      console.log(`Found ${unprocessedTournaments.length} completed tournaments to process`);

      for (const tournament of unprocessedTournaments) {
        try {
          console.log(`Processing tournament: ${tournament.name} (ID: ${tournament.id})`);

          // Check if tournament has final results
          const finalMatches = await TournamentMatch.findAll({
            where: {
              tournamentId: tournament.id,
              status: 'completed'
            }
          });

          if (finalMatches.length === 0) {
            console.log(`Tournament ${tournament.id} has no completed matches, skipping`);
            continue;
          }

          // Process tournament rankings
          await this.processTournamentResults(tournament.id);

          console.log(`Successfully processed tournament ${tournament.id}`);

        } catch (error) {
          console.error(`Error processing tournament ${tournament.id}:`, error);
          // Continue with other tournaments
        }
      }

    } catch (error) {
      console.error('Error in processing completed tournaments:', error);
      throw error;
    }
  }

  // Process tournament results and update rankings
  private async processTournamentResults(tournamentId: number): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      // Get tournament details
      const tournament = await Tournament.findByPk(tournamentId, { transaction });
      if (!tournament) {
        throw new Error('Tournament not found');
      }

      // Get completed matches with final standings
      const matches = await TournamentMatch.findAll({
        where: {
          tournamentId,
          status: 'completed'
        },
        transaction
      });

      if (matches.length === 0) {
        throw new Error('No completed matches found');
      }

      // Calculate points for each participant
      // This is a simplified version - in reality, you'd need to determine
      // final placements, match wins/losses, etc.
      const participantResults = this.calculateTournamentPlacements(matches);

      for (const result of participantResults) {
        try {
          // Calculate tournament points
          await rankingService.calculateTournamentPoints(
            result.playerId,
            tournamentId,
            result.finalPlacement,
            participantResults.length,
            result.matchesWon,
            result.matchesLost,
            result.averageOpponentRating
          );

        } catch (error) {
          console.error(`Error calculating points for player ${result.playerId}:`, error);
          // Continue with other players
        }
      }

      // Update rankings based on tournament results
      await rankingService.updatePlayerRankings(tournamentId);

      await transaction.commit();

      // Send notifications to participants about ranking updates
      await this.notifyRankingUpdates(tournamentId, participantResults);

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Calculate tournament placements from match results
  private calculateTournamentPlacements(matches: any[]): any[] {
    // This is a simplified calculation
    // In reality, you'd need a more sophisticated algorithm based on bracket structure
    
    const playerStats = new Map();

    // Calculate wins/losses for each player
    matches.forEach(match => {
      const winnerId = match.winnerId;
      const loserId = match.player1Id === winnerId ? match.player2Id : match.player1Id;

      // Update winner stats
      if (!playerStats.has(winnerId)) {
        playerStats.set(winnerId, { playerId: winnerId, wins: 0, losses: 0 });
      }
      playerStats.get(winnerId).wins++;

      // Update loser stats
      if (!playerStats.has(loserId)) {
        playerStats.set(loserId, { playerId: loserId, wins: 0, losses: 0 });
      }
      playerStats.get(loserId).losses++;
    });

    // Convert to array and calculate placements
    const results = Array.from(playerStats.values())
      .map(stats => ({
        playerId: stats.playerId,
        matchesWon: stats.wins,
        matchesLost: stats.losses,
        winRate: stats.wins / (stats.wins + stats.losses)
      }))
      .sort((a, b) => b.winRate - a.winRate) // Sort by win rate
      .map((player, index) => ({
        ...player,
        finalPlacement: index + 1,
        averageOpponentRating: 1500 // Placeholder - should calculate actual average
      }));

    return results;
  }

  // Recalculate all ranking positions
  async recalculateAllRankingPositions(): Promise<void> {
    try {
      console.log('Starting weekly ranking position recalculation...');

      // Get all unique ranking categories
      const categories = await Ranking.findAll({
        attributes: ['rankingType', 'category', 'stateId', 'ageGroup', 'gender'],
        group: ['rankingType', 'category', 'stateId', 'ageGroup', 'gender'],
        raw: true
      });

      console.log(`Found ${categories.length} ranking categories to recalculate`);

      for (const category of categories) {
        try {
          await rankingService.recalculatePositions(
            category.rankingType,
            category.category,
            category.stateId,
            category.ageGroup,
            category.gender
          );
        } catch (error) {
          console.error(`Error recalculating category ${category.rankingType}/${category.category}:`, error);
          // Continue with other categories
        }
      }

      console.log('Weekly ranking position recalculation completed');

    } catch (error) {
      console.error('Error in weekly ranking recalculation:', error);
      throw error;
    }
  }

  // Update ranking statistics
  async updateRankingStatistics(): Promise<void> {
    try {
      console.log('Starting monthly ranking statistics update...');

      // This would update various cached statistics, generate reports, etc.
      // Implementation would depend on specific requirements

      // Example: Update player activity statuses
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      await Ranking.update(
        { isActive: false },
        {
          where: {
            lastTournamentDate: {
              [Op.lt]: sixMonthsAgo
            },
            isActive: true
          }
        }
      );

      console.log('Monthly ranking statistics update completed');

    } catch (error) {
      console.error('Error in monthly statistics update:', error);
      throw error;
    }
  }

  // Send activity reminders to inactive players
  async sendActivityReminders(): Promise<void> {
    try {
      // Find players who haven't participated in tournaments recently
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const inactivePlayers = await Ranking.findAll({
        where: {
          lastTournamentDate: {
            [Op.lt]: threeMonthsAgo
          },
          isActive: true,
          points: {
            [Op.gt]: 0 // Only notify players who have some points
          }
        },
        include: [{ model: Player, as: 'player' }],
        limit: 50 // Limit to avoid spam
      });

      if (inactivePlayers.length === 0) {
        console.log('No inactive players found for reminders');
        return;
      }

      console.log(`Sending activity reminders to ${inactivePlayers.length} inactive players`);

      for (const ranking of inactivePlayers) {
        try {
          await notificationService.sendNotification({
            userId: (ranking as any).player.userId.toString(),
            type: 'system',
            category: 'warning',
            title: 'Ranking Activity Reminder',
            message: `Your ranking position may decline due to inactivity. Participate in tournaments to maintain your ranking!`
          });
        } catch (error) {
          console.error(`Error sending reminder to player ${ranking.playerId}:`, error);
          // Continue with other players
        }
      }

    } catch (error) {
      console.error('Error sending activity reminders:', error);
      throw error;
    }
  }

  // Send ranking update notifications
  private async notifyRankingUpdates(tournamentId: number, results: any[]): Promise<void> {
    try {
      const tournament = await Tournament.findByPk(tournamentId);
      if (!tournament) return;

      for (const result of results) {
        try {
          const message = `Your rankings have been updated after ${tournament.name}. Check your new position!`;
          
          await notificationService.sendNotification({
            userId: result.playerId.toString(),
            type: 'system',
            category: 'info',
            title: 'Rankings Updated',
            message: message
          });
        } catch (error) {
          console.error(`Error sending notification to player ${result.playerId}:`, error);
          // Continue with other players
        }
      }
    } catch (error) {
      console.error('Error sending ranking update notifications:', error);
    }
  }

  // Manual tournament processing trigger
  async processTournamentManually(tournamentId: number): Promise<void> {
    console.log(`Manually processing tournament ${tournamentId}...`);
    await this.processTournamentResults(tournamentId);
  }

  // Stop all scheduled tasks
  stop(): void {
    if (this.isInitialized) {
      cron.getTasks().forEach((task, name) => {
        task.destroy();
        console.log(`Stopped scheduled task: ${name}`);
      });
      this.isInitialized = false;
      console.log('Automated ranking service stopped');
    }
  }

  // Get service status
  getStatus(): any {
    return {
      isInitialized: this.isInitialized,
      scheduledTasks: cron.getTasks().size,
      lastProcessed: new Date()
    };
  }
}

export default new AutomatedRankingService();