import { 
  Tournament, 
  TournamentCategory, 
  TournamentRegistration, 
  TournamentBracket,
  TournamentMatch,
  User,
  Payment
} from '../models';
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
      for (const category of (tournament as any).categories || []) {
        const existingBracket = await TournamentBracket.findOne({
          where: { tournamentId, categoryId: category.id },
          transaction
        });

        if (!existingBracket) {
          await this.generateBracketForCategory(tournamentId, category.id, transaction);
        }
      }

      // Notify all registered players about tournament start
      const registrations = (tournament as any).registrations || [];
      for (const registration of registrations) {
        await new notificationService().sendNotification({
          userId: registration.playerId.toString(),
          type: 'tournament',
          category: 'info',
          templateType: 'tournament_started',
          data: {
            tournamentName: tournament.name,
            tournamentLevel: tournament.level,
            startDate: tournament.startDate,
            venue: tournament.venueName,
            registrationFee: (tournament as any).registrationFee || 0
          },
          actionUrl: `/tournaments/${tournamentId}`,
          relatedEntityType: 'tournament',
          relatedEntityId: tournamentId.toString(),
          channels: { email: true, push: true, sms: true, inApp: true } // Multi-channel notification for important event
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
          { model: TournamentMatch, as: 'matches' },
          { model: TournamentRegistration, as: 'registrations' }
        ],
        transaction
      });

      if (!tournament) {
        throw new Error('Tournament not found');
      }

      // Check if all matches are completed
      const incompleteMatches = (tournament as any).matches?.filter((m: any) => 
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

      // Notify winners with multi-channel approach
      for (const bracket of (tournament as any).brackets || []) {
        if (bracket.winnerPlayerId) {
          await new notificationService().sendNotification({
            userId: bracket.winnerPlayerId,
            type: 'tournament',
            category: 'success',
            templateType: 'tournament_winner',
            data: {
              tournamentName: tournament.name,
              categoryName: bracket.name,
              tournamentLevel: tournament.level,
              prizeAmount: bracket.prizeAmount,
              venue: tournament.venueName
            },
            actionUrl: `/tournaments/${tournamentId}/results`,
            relatedEntityType: 'tournament',
            relatedEntityId: tournamentId.toString(),
            channels: { email: true, push: true, sms: true, inApp: true },
          });
        }
      }

      // Notify all participants about tournament completion
      const allParticipants = (tournament as any).registrations || [];
      for (const registration of allParticipants) {
        if (registration.status === 'paid') {
          await new notificationService().sendNotification({
            userId: registration.playerId.toString(),
            type: 'tournament',
            category: 'info',
            templateType: 'tournament_completed',
            data: {
              tournamentName: tournament.name,
              tournamentLevel: tournament.level,
              completedAt: new Date().toISOString(),
              resultsAvailable: true
            },
            actionUrl: `/tournaments/${tournamentId}/results`,
            relatedEntityType: 'tournament',
            relatedEntityId: tournamentId.toString(),
            channels: { email: true, push: true, inApp: true }
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

    const players = (category as any).registrations?.map((r: any) => ({
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
      totalCategories: (tournament as any).categories?.length || 0,
      totalRegistrations: (tournament as any).registrations?.length || 0,
      totalMatches: (tournament as any).matches?.length || 0,
      completedMatches: (tournament as any).matches?.filter((m: any) => m.status === 'completed').length || 0,
      revenue: (tournament as any).registrations?.reduce((sum: any, r: any) => sum + Number(r.amountPaid), 0) || 0,
      registrationsByCategory: {},
      matchesByStatus: {},
      playersByState: {}
    };

    // Group registrations by category
    for (const registration of (tournament as any).registrations || []) {
      const categoryId = registration.categoryId;
      if (!stats.registrationsByCategory[categoryId]) {
        stats.registrationsByCategory[categoryId] = 0;
      }
      stats.registrationsByCategory[categoryId]++;
    }

    // Group matches by status
    for (const match of (tournament as any).matches || []) {
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

    const prizeDistribution = (tournament as any).prizeDistribution || {
      first: 0.5,
      second: 0.3,
      third: 0.15,
      fourth: 0.05
    };

    for (const bracket of (tournament as any).brackets || []) {
      if (bracket.winnerPlayerId) {
        const firstPrize = Number((tournament as any).prizePool) * prizeDistribution.first;
        // Create payment record for prize
        await Payment.create({
          userId: bracket.winnerPlayerId,
          amount: firstPrize,
          type: 'tournament_entry',
          paymentMethod: { type: 'wallet' },
          status: 'pending',
          relatedEntityType: 'tournament',
          relatedEntityId: tournamentId,
          description: `First place prize - ${tournament.name}`
        }, { transaction });
      }

      if (bracket.runnerUpPlayerId) {
        const secondPrize = Number((tournament as any).prizePool) * prizeDistribution.second;
        await Payment.create({
          userId: bracket.runnerUpPlayerId,
          amount: secondPrize,
          type: 'tournament_entry',
          paymentMethod: { type: 'wallet' },
          status: 'pending',
          relatedEntityType: 'tournament',
          relatedEntityId: tournamentId,
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

    for (const match of (tournament as any).matches || []) {
      if (match.status === 'completed' && match.winnerId) {
        // Update winner's ranking points
        const winner = await User.findByPk(match.winnerId, { transaction });
        if (winner) {
          const currentPoints = (winner as any).rankingPoints || 0;
          await (winner as any).update({ 
            rankingPoints: currentPoints + points.win 
          }, { transaction });
        }

        // Update loser's ranking points
        if (match.loserId) {
          const loser = await User.findByPk(match.loserId, { transaction });
          if (loser) {
            const currentPoints = (loser as any).rankingPoints || 0;
            await (loser as any).update({ 
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
      const playerAge = this.calculateAge((player as any).dateOfBirth);
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
    if (category.genderRequirement !== 'open' && (player as any).gender !== category.genderRequirement) {
      eligible = false;
      reasons.push(`Category is for ${category.genderRequirement} only`);
    }

    // Check ranking requirements
    if (category.minRankingPoints && (player as any).rankingPoints < category.minRankingPoints) {
      eligible = false;
      reasons.push(`Requires at least ${category.minRankingPoints} ranking points`);
    }
    if (category.maxRankingPoints && (player as any).rankingPoints > category.maxRankingPoints) {
      eligible = false;
      reasons.push(`Maximum ${category.maxRankingPoints} ranking points allowed`);
    }

    // Check if already registered
    const existingRegistration = (player as any).tournamentRegistrations?.find((r: any) => 
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

  // Send registration confirmation notification
  async sendRegistrationConfirmation(registrationId: number): Promise<void> {
    const registration = await TournamentRegistration.findByPk(registrationId, {
      include: [
        { model: Tournament, as: 'tournament' },
        { model: TournamentCategory, as: 'category' },
        { model: User, as: 'player' }
      ]
    });

    if (!registration) {
      throw new Error('Registration not found');
    }

    const tournament = (registration as any).tournament;
    const category = (registration as any).category;
    const player = (registration as any).player;

    await new notificationService().sendNotification({
      userId: registration.playerId.toString(),
      type: 'tournament',
      category: 'success',
      templateType: 'tournament_registration_confirmed',
      data: {
        tournamentName: tournament.name,
        categoryName: category.name,
        tournamentLevel: tournament.level,
        startDate: tournament.startDate,
        venue: tournament.venueName,
        registrationFee: (tournament as any).registrationFee || 0,
        playerName: player.username
      },
      actionUrl: `/tournaments/${tournament.id}/registration`,
      relatedEntityType: 'tournament',
      relatedEntityId: tournament.id.toString(),
      channels: { email: true, push: true, inApp: true },
    });
  }

  // Send match schedule notification
  async sendMatchScheduleNotification(matchId: number): Promise<void> {
    const match = await TournamentMatch.findByPk(matchId, {
      include: [
        { model: Tournament, as: 'tournament' },
        { model: User, as: 'player1' },
        { model: User, as: 'player2' }
      ]
    });

    if (!match) {
      throw new Error('Match not found');
    }

    const tournament = (match as any).tournament;
    const player1 = (match as any).player1;
    const player2 = (match as any).player2;

    // Notify both players
    for (const player of [player1, player2]) {
      if (player) {
        await new notificationService().sendNotification({
          userId: player.id.toString(),
          type: 'tournament',
          category: 'info',
          templateType: 'match_scheduled',
          data: {
            tournamentName: tournament.name,
            opponent: player.id === player1.id ? 
              player2.username : 
              player1.username,
            scheduledDate: match.scheduledDate,
            scheduledTime: match.scheduledTime,
            venue: (match as any).tournament?.venueName || tournament.venueName,
            round: match.round,
            courtAssignment: match.courtAssignment
          },
          actionUrl: `/tournaments/${tournament.id}/match/${match.id}`,
          relatedEntityType: 'match',
          relatedEntityId: match.id.toString(),
          channels: { email: true, push: true, sms: true, inApp: true },
          });
      }
    }
  }

  // Send match result notification
  async sendMatchResultNotification(matchId: number): Promise<void> {
    const match = await TournamentMatch.findByPk(matchId, {
      include: [
        { model: Tournament, as: 'tournament' },
        { model: User, as: 'player1' },
        { model: User, as: 'player2' },
        { model: User, as: 'winner' }
      ]
    });

    if (!match) {
      throw new Error('Match not found');
    }

    const tournament = (match as any).tournament;
    const player1 = (match as any).player1;
    const player2 = (match as any).player2;
    const winner = (match as any).winner;

    // Notify both players about the result
    for (const player of [player1, player2]) {
      if (player) {
        const isWinner = winner && player.id === winner.id;
        const opponent = player.id === player1.id ? player2 : player1;

        await new notificationService().sendNotification({
          userId: player.id.toString(),
          type: 'tournament',
          category: isWinner ? 'success' : 'info',
          templateType: isWinner ? 'match_won' : 'match_lost',
          data: {
            tournamentName: tournament.name,
            opponent: opponent.username,
            score: match.score,
            round: match.round,
            venue: (match as any).tournament?.venueName || tournament.venueName,
            nextMatch: isWinner ? 'You advance to the next round!' : undefined
          },
          actionUrl: `/tournaments/${tournament.id}/match/${match.id}`,
          relatedEntityType: 'match',
          relatedEntityId: match.id.toString(),
          channels: { email: true, push: true, inApp: true },
            });
      }
    }
  }

  // Send tournament registration reminder
  async sendRegistrationReminder(tournamentId: number): Promise<void> {
    const tournament = await Tournament.findByPk(tournamentId);
    
    if (!tournament || tournament.status !== 'open') {
      return;
    }

    // Find eligible players who haven't registered yet
    const eligiblePlayers = await User.findAll({
      where: {
        role: 'player',
        isActive: true,
        // subscriptionStatus: 'active' // Property not available in User model
      },
      include: [
        {
          model: TournamentRegistration,
          as: 'tournamentRegistrations',
          where: { tournamentId },
          required: false
        }
      ]
    });

    const unregisteredPlayers = eligiblePlayers.filter(player => 
      !(player as any).tournamentRegistrations || 
      (player as any).tournamentRegistrations.length === 0
    );

    // Send reminder to unregistered players
    for (const player of unregisteredPlayers) {
      await new notificationService().sendNotification({
        userId: player.id.toString(),
        type: 'tournament',
        category: 'info',
        templateType: 'tournament_registration_reminder',
        data: {
          tournamentName: tournament.name,
          tournamentLevel: tournament.level,
          registrationDeadline: tournament.registrationEnd,
          startDate: tournament.startDate,
          venue: tournament.venueName,
          playerName: player.username
        },
        actionUrl: `/tournaments/${tournamentId}/register`,
        relatedEntityType: 'tournament',
        relatedEntityId: tournamentId.toString(),
        channels: { email: true, push: true, inApp: true },
        });
    }
  }

  // Send tournament schedule change notification
  async sendScheduleChangeNotification(tournamentId: number, changeType: 'date' | 'venue' | 'time', changeDetails: any): Promise<void> {
    const tournament = await Tournament.findByPk(tournamentId, {
      include: [
        { model: TournamentRegistration, as: 'registrations', where: { status: 'paid' } }
      ]
    });

    if (!tournament) {
      throw new Error('Tournament not found');
    }

    const registrations = (tournament as any).registrations || [];

    for (const registration of registrations) {
      await new notificationService().sendNotification({
        userId: registration.playerId.toString(),
        type: 'tournament',
        category: 'warning',
        templateType: 'tournament_schedule_changed',
        data: {
          tournamentName: tournament.name,
          changeType,
          oldValue: changeDetails.oldValue,
          newValue: changeDetails.newValue,
          reason: changeDetails.reason,
          effectiveDate: changeDetails.effectiveDate
        },
        actionUrl: `/tournaments/${tournamentId}`,
        relatedEntityType: 'tournament',
        relatedEntityId: tournamentId.toString(),
        channels: { email: true, push: true, sms: true, inApp: true },
      });
    }
  }
}

export default new TournamentService();