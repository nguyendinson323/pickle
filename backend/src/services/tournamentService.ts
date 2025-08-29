import { 
  Tournament, 
  TournamentCategory, 
  TournamentRegistration, 
  TournamentBracket,
  TournamentMatch,
  User,
  Payment
} from '../models';
import { Op } from 'sequelize';
import sequelize from '../config/database';
import notificationService from './notificationService';

class TournamentService {
  // Check if user can create tournament of specific level
  canCreateTournament(userRole: string, tournamentLevel: string): boolean {
    const permissions: Record<string, string[]> = {
      admin: ['National', 'State', 'Municipal', 'Local'],
      state: ['State', 'Municipal', 'Local'],
      club: ['Local'],
      partner: ['Local']
    };

    return permissions[userRole]?.includes(tournamentLevel) || false;
  }

  // Validate tournament status transition
  isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
    const transitions: Record<string, string[]> = {
      draft: ['open'],
      open: ['registration_closed', 'cancelled'],
      registration_closed: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    };

    return transitions[currentStatus]?.includes(newStatus) || false;
  }

  // Start tournament
  async startTournament(tournamentId: number): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      const tournament = await Tournament.findByPk(tournamentId, {
        include: [
          { model: TournamentCategory, as: 'categories' },
          { model: TournamentRegistration, as: 'registrations' }
        ],
        transaction
      });

      if (!tournament) {
        throw new Error('Tournament not found');
      }

      // Update tournament status
      await tournament.update({ status: 'in_progress' }, { transaction });

      // Generate brackets for each category if not already generated
      for (const category of tournament.categories || []) {
        const existingBracket = await TournamentBracket.findOne({
          where: { tournamentId, categoryId: category.id },
          transaction
        });

        if (!existingBracket) {
          await this.generateBracketForCategory(tournamentId, category.id, transaction);
        }
      }

      // Notify all registered players
      const registrations = tournament.registrations || [];
      for (const registration of registrations) {
        await notificationService.createNotification({
          userId: registration.playerId,
          type: 'tournament',
          title: 'Tournament Started',
          message: `The tournament "${tournament.name}" has started. Check your matches!`,
          link: `/tournaments/${tournamentId}`
        });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Complete tournament
  async completeTournament(tournamentId: number): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      const tournament = await Tournament.findByPk(tournamentId, {
        include: [
          { model: TournamentBracket, as: 'brackets' },
          { model: TournamentMatch, as: 'matches' }
        ],
        transaction
      });

      if (!tournament) {
        throw new Error('Tournament not found');
      }

      // Check if all matches are completed
      const incompleteMatches = tournament.matches?.filter(m => 
        m.status !== 'completed' && m.status !== 'cancelled'
      );

      if (incompleteMatches && incompleteMatches.length > 0) {
        throw new Error('Cannot complete tournament with incomplete matches');
      }

      // Update tournament status
      await tournament.update({ status: 'completed' }, { transaction });

      // Process prize distribution
      await this.distributePrizes(tournamentId, transaction);

      // Update player rankings
      await this.updatePlayerRankings(tournamentId, transaction);

      // Notify winners
      for (const bracket of tournament.brackets || []) {
        if (bracket.winnerPlayerId) {
          await notificationService.createNotification({
            userId: bracket.winnerPlayerId,
            type: 'tournament',
            title: 'Congratulations!',
            message: `You won the ${bracket.name} category in ${tournament.name}!`,
            link: `/tournaments/${tournamentId}/results`
          });
        }
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Generate bracket for category
  async generateBracketForCategory(tournamentId: number, categoryId: number, transaction?: any): Promise<TournamentBracket> {
    const category = await TournamentCategory.findByPk(categoryId, {
      include: [
        { 
          model: TournamentRegistration, 
          as: 'registrations',
          where: { status: 'paid' },
          include: [{ model: User, as: 'player' }]
        }
      ],
      transaction
    });

    if (!category) {
      throw new Error('Category not found');
    }

    const players = category.registrations?.map(r => ({
      id: r.playerId,
      name: r.player?.username,
      seed: r.seedNumber
    })) || [];

    // Generate bracket structure based on player count
    const bracketData = this.generateSingleEliminationBracket(players);

    const bracket = await TournamentBracket.create({
      tournamentId,
      categoryId,
      name: category.name,
      bracketType: 'single_elimination',
      seedingMethod: 'ranking',
      totalRounds: Math.ceil(Math.log2(players.length)),
      currentRound: 1,
      isComplete: false,
      bracketData,
      settings: {
        consolationMatch: true,
        bestOf: 3
      },
      generatedDate: new Date()
    }, { transaction });

    // Create first round matches
    await this.createMatchesFromBracket(bracket, transaction);

    return bracket;
  }

  // Generate single elimination bracket structure
  generateSingleEliminationBracket(players: any[]): any {
    const totalPlayers = players.length;
    const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(totalPlayers)));
    const byesNeeded = nextPowerOf2 - totalPlayers;

    // Sort players by seed
    const seededPlayers = [...players].sort((a, b) => (a.seed || 999) - (b.seed || 999));

    // Add byes
    for (let i = 0; i < byesNeeded; i++) {
      seededPlayers.push({ id: null, name: 'BYE', seed: null });
    }

    // Create bracket structure
    const rounds = [];
    const totalRounds = Math.log2(nextPowerOf2);

    for (let round = 1; round <= totalRounds; round++) {
      const matchesInRound = nextPowerOf2 / Math.pow(2, round);
      const roundMatches = [];

      for (let match = 0; match < matchesInRound; match++) {
        roundMatches.push({
          round,
          matchNumber: match + 1,
          player1: round === 1 ? seededPlayers[match * 2] : null,
          player2: round === 1 ? seededPlayers[match * 2 + 1] : null,
          winner: null
        });
      }

      rounds.push(roundMatches);
    }

    return { rounds, players: seededPlayers };
  }

  // Create matches from bracket
  async createMatchesFromBracket(bracket: TournamentBracket, transaction?: any): Promise<void> {
    const bracketData = bracket.bracketData;
    const firstRoundMatches = bracketData.rounds[0];

    for (const match of firstRoundMatches) {
      // Skip BYE matches
      if (match.player1?.name === 'BYE' || match.player2?.name === 'BYE') {
        const winner = match.player1?.name !== 'BYE' ? match.player1 : match.player2;
        match.winner = winner;
        continue;
      }

      await TournamentMatch.create({
        tournamentId: bracket.tournamentId,
        categoryId: bracket.categoryId,
        bracketId: bracket.id,
        round: 'round_16', // Adjust based on total rounds
        matchNumber: match.matchNumber,
        player1Id: match.player1?.id,
        player2Id: match.player2?.id,
        status: 'scheduled'
      }, { transaction });
    }
  }

  // Get tournament statistics
  async getTournamentStatistics(tournamentId: number): Promise<any> {
    const tournament = await Tournament.findByPk(tournamentId, {
      include: [
        { model: TournamentCategory, as: 'categories' },
        { model: TournamentRegistration, as: 'registrations' },
        { model: TournamentMatch, as: 'matches' }
      ]
    });

    if (!tournament) {
      throw new Error('Tournament not found');
    }

    const stats = {
      totalCategories: tournament.categories?.length || 0,
      totalRegistrations: tournament.registrations?.length || 0,
      totalMatches: tournament.matches?.length || 0,
      completedMatches: tournament.matches?.filter(m => m.status === 'completed').length || 0,
      revenue: tournament.registrations?.reduce((sum, r) => sum + Number(r.amountPaid), 0) || 0,
      registrationsByCategory: {},
      matchesByStatus: {},
      playersByState: {}
    };

    // Group registrations by category
    for (const registration of tournament.registrations || []) {
      const categoryId = registration.categoryId;
      if (!stats.registrationsByCategory[categoryId]) {
        stats.registrationsByCategory[categoryId] = 0;
      }
      stats.registrationsByCategory[categoryId]++;
    }

    // Group matches by status
    for (const match of tournament.matches || []) {
      if (!stats.matchesByStatus[match.status]) {
        stats.matchesByStatus[match.status] = 0;
      }
      stats.matchesByStatus[match.status]++;
    }

    return stats;
  }

  // Distribute prizes
  async distributePrizes(tournamentId: number, transaction?: any): Promise<void> {
    const tournament = await Tournament.findByPk(tournamentId, {
      include: [{ model: TournamentBracket, as: 'brackets' }],
      transaction
    });

    if (!tournament || !tournament.prizePool) {
      return;
    }

    const prizeDistribution = tournament.prizeDistribution || {
      first: 0.5,
      second: 0.3,
      third: 0.15,
      fourth: 0.05
    };

    for (const bracket of tournament.brackets || []) {
      if (bracket.winnerPlayerId) {
        const firstPrize = Number(tournament.prizePool) * prizeDistribution.first;
        // Create payment record for prize
        await Payment.create({
          userId: bracket.winnerPlayerId,
          amount: firstPrize,
          paymentType: 'prize',
          paymentMethod: 'transfer',
          status: 'pending',
          referenceType: 'tournament',
          referenceId: tournamentId,
          description: `First place prize - ${tournament.name}`
        }, { transaction });
      }

      if (bracket.runnerUpPlayerId) {
        const secondPrize = Number(tournament.prizePool) * prizeDistribution.second;
        await Payment.create({
          userId: bracket.runnerUpPlayerId,
          amount: secondPrize,
          paymentType: 'prize',
          paymentMethod: 'transfer',
          status: 'pending',
          referenceType: 'tournament',
          referenceId: tournamentId,
          description: `Second place prize - ${tournament.name}`
        }, { transaction });
      }
    }
  }

  // Update player rankings
  async updatePlayerRankings(tournamentId: number, transaction?: any): Promise<void> {
    // This would update player ranking points based on tournament results
    // Implementation depends on ranking system design
    const tournament = await Tournament.findByPk(tournamentId, {
      include: [{ model: TournamentMatch, as: 'matches' }],
      transaction
    });

    if (!tournament) {
      return;
    }

    // Calculate points based on tournament level
    const pointsMap = {
      National: { win: 100, loss: 25 },
      State: { win: 50, loss: 15 },
      Municipal: { win: 25, loss: 10 },
      Local: { win: 10, loss: 5 }
    };

    const points = pointsMap[tournament.level] || { win: 5, loss: 2 };

    for (const match of tournament.matches || []) {
      if (match.status === 'completed' && match.winnerId) {
        // Update winner's ranking points
        const winner = await User.findByPk(match.winnerId, { transaction });
        if (winner) {
          const currentPoints = winner.rankingPoints || 0;
          await winner.update({ 
            rankingPoints: currentPoints + points.win 
          }, { transaction });
        }

        // Update loser's ranking points
        if (match.loserId) {
          const loser = await User.findByPk(match.loserId, { transaction });
          if (loser) {
            const currentPoints = loser.rankingPoints || 0;
            await loser.update({ 
              rankingPoints: currentPoints + points.loss 
            }, { transaction });
          }
        }
      }
    }
  }

  // Export tournament data to CSV
  async exportToCSV(tournament: any): Promise<string> {
    let csv = 'Tournament Export\n';
    csv += `Name,${tournament.name}\n`;
    csv += `Start Date,${tournament.startDate}\n`;
    csv += `End Date,${tournament.endDate}\n`;
    csv += `Status,${tournament.status}\n\n`;

    csv += 'Registrations\n';
    csv += 'Player,Category,Status,Registration Date\n';
    
    for (const registration of tournament.registrations || []) {
      csv += `${registration.player?.username},${registration.category?.name},${registration.status},${registration.registrationDate}\n`;
    }

    csv += '\nMatches\n';
    csv += 'Round,Player 1,Player 2,Score,Winner\n';
    
    for (const match of tournament.matches || []) {
      csv += `${match.round},${match.player1?.username},${match.player2?.username},${JSON.stringify(match.score)},${match.winner?.username}\n`;
    }

    return csv;
  }

  // Check player eligibility
  async checkPlayerEligibility(playerId: number, categoryId: number): Promise<{ eligible: boolean, reasons: string[] }> {
    const reasons: string[] = [];
    let eligible = true;

    const category = await TournamentCategory.findByPk(categoryId);
    const player = await User.findByPk(playerId, {
      include: [{ model: TournamentRegistration, as: 'tournamentRegistrations' }]
    });

    if (!category || !player) {
      return { eligible: false, reasons: ['Invalid player or category'] };
    }

    // Check age requirements
    if (category.minAge || category.maxAge) {
      const playerAge = this.calculateAge(player.dateOfBirth);
      if (category.minAge && playerAge < category.minAge) {
        eligible = false;
        reasons.push(`Must be at least ${category.minAge} years old`);
      }
      if (category.maxAge && playerAge > category.maxAge) {
        eligible = false;
        reasons.push(`Must be no more than ${category.maxAge} years old`);
      }
    }

    // Check gender requirements
    if (category.genderRequirement !== 'open' && player.gender !== category.genderRequirement) {
      eligible = false;
      reasons.push(`Category is for ${category.genderRequirement} only`);
    }

    // Check ranking requirements
    if (category.minRankingPoints && player.rankingPoints < category.minRankingPoints) {
      eligible = false;
      reasons.push(`Requires at least ${category.minRankingPoints} ranking points`);
    }
    if (category.maxRankingPoints && player.rankingPoints > category.maxRankingPoints) {
      eligible = false;
      reasons.push(`Maximum ${category.maxRankingPoints} ranking points allowed`);
    }

    // Check if already registered
    const existingRegistration = player.tournamentRegistrations?.find(r => 
      r.categoryId === categoryId && r.status !== 'cancelled'
    );
    if (existingRegistration) {
      eligible = false;
      reasons.push('Already registered for this category');
    }

    return { eligible, reasons };
  }

  // Calculate age from date of birth
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}

export default new TournamentService();