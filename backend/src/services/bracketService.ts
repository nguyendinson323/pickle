import { 
  TournamentBracket,
  TournamentCategory,
  TournamentRegistration,
  TournamentMatch,
  User
} from '../models';
import sequelize from '../config/database';

export type BracketNode = {
  id: string;
  round: number;
  position: number;
  matchId?: number;
  player1: any;
  player2: any;
  winner: any;
  nextMatch?: string;
  prevMatch1?: string;
  prevMatch2?: string;
  status: 'pending' | 'in_progress' | 'completed';
};

class BracketService {
  // Generate bracket for a category
  async generateBracket(categoryId: number, bracketType: string = 'single_elimination', seedingMethod: string = 'ranking') {
    const transaction = await sequelize.transaction();

    try {
      // Get category with registrations
      const category = await TournamentCategory.findByPk(categoryId, {
        include: [{
          model: TournamentRegistration,
          as: 'registrations',
          where: { status: 'paid' },
          include: [
            { model: User, as: 'player', attributes: ['id', 'username', 'rankingPoints'] },
            { model: User, as: 'partner', attributes: ['id', 'username', 'rankingPoints'] }
          ]
        }],
        transaction
      });

      if (!category) {
        throw new Error('Category not found');
      }

      const registrations = (category as any).registrations || [];
      
      if (registrations.length < 2) {
        throw new Error('Not enough players to generate bracket');
      }

      // Prepare players list
      const players = this.preparePlayersList(registrations, category.playFormat);

      // Seed players
      const seededPlayers = this.seedPlayers(players, seedingMethod);

      // Generate bracket structure based on type
      let bracketData: any;
      switch (bracketType) {
        case 'single_elimination':
          bracketData = this.generateSingleElimination(seededPlayers);
          break;
        case 'double_elimination':
          bracketData = this.generateDoubleElimination(seededPlayers);
          break;
        case 'round_robin':
          bracketData = this.generateRoundRobin(seededPlayers);
          break;
        default:
          bracketData = this.generateSingleElimination(seededPlayers);
      }

      // Create bracket record
      const bracket = await TournamentBracket.create({
        tournamentId: category.tournamentId,
        categoryId,
        name: `${category.name} Bracket`,
        bracketType: bracketType as any,
        seedingMethod: seedingMethod as any,
        totalRounds: bracketData.totalRounds,
        currentRound: 1,
        isComplete: false,
        bracketData,
        seedingData: seededPlayers,
        settings: {
          bestOf: 3,
          consolationMatch: true,
          scoringSystem: 'standard'
        },
        generatedDate: new Date()
      }, { transaction });

      // Create initial matches
      await this.createInitialMatches(bracket, bracketData, transaction);

      await transaction.commit();

      return bracket;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Prepare players list from registrations
  private preparePlayersList(registrations: any[], playFormat: string) {
    const players = [];

    for (const reg of registrations) {
      if (playFormat === 'singles') {
        players.push({
          id: reg.playerId,
          registrationId: reg.id,
          name: reg.player?.username,
          rankingPoints: reg.player?.rankingPoints || 0,
          seed: reg.seedNumber
        });
      } else {
        // Doubles or mixed doubles
        players.push({
          id: `${reg.playerId}-${reg.partnerId}`,
          registrationId: reg.id,
          player1Id: reg.playerId,
          player2Id: reg.partnerId,
          name: `${reg.player?.username} / ${reg.partner?.username}`,
          rankingPoints: ((reg.player?.rankingPoints || 0) + (reg.partner?.rankingPoints || 0)) / 2,
          seed: reg.seedNumber
        });
      }
    }

    return players;
  }

  // Seed players based on method
  private seedPlayers(players: any[], method: string) {
    switch (method) {
      case 'ranking':
        return [...players].sort((a, b) => b.rankingPoints - a.rankingPoints);
      case 'manual':
        return [...players].sort((a, b) => (a.seed || 999) - (b.seed || 999));
      case 'random':
        return this.shuffleArray([...players]);
      case 'regional':
        // Group by region then seed
        return this.regionalSeeding(players);
      default:
        return players;
    }
  }

  // Generate single elimination bracket
  private generateSingleElimination(players: any[]) {
    const totalPlayers = players.length;
    const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(totalPlayers)));
    const byesNeeded = nextPowerOf2 - totalPlayers;
    const totalRounds = Math.ceil(Math.log2(totalPlayers));

    // Add byes
    const playersWithByes = [...players];
    for (let i = 0; i < byesNeeded; i++) {
      playersWithByes.push({ id: null, name: 'BYE', isBye: true });
    }

    // Create bracket structure
    const brackets: BracketNode[] = [];
    let matchId = 1;

    // Generate all rounds
    for (let round = 1; round <= totalRounds; round++) {
      const matchesInRound = nextPowerOf2 / Math.pow(2, round);
      
      for (let position = 0; position < matchesInRound; position++) {
        const node: BracketNode = {
          id: `R${round}M${position + 1}`,
          round,
          position,
          player1: null,
          player2: null,
          winner: null,
          status: 'pending'
        };

        // Set first round players
        if (round === 1) {
          node.player1 = playersWithByes[position * 2];
          node.player2 = playersWithByes[position * 2 + 1];
          
          // Handle byes
          if (node.player1?.isBye) {
            node.winner = node.player2;
            node.status = 'completed';
          } else if (node.player2?.isBye) {
            node.winner = node.player1;
            node.status = 'completed';
          }
        }

        // Set next match connections
        if (round < totalRounds) {
          node.nextMatch = `R${round + 1}M${Math.floor(position / 2) + 1}`;
        }

        // Set previous match connections
        if (round > 1) {
          node.prevMatch1 = `R${round - 1}M${position * 2 + 1}`;
          node.prevMatch2 = `R${round - 1}M${position * 2 + 2}`;
        }

        brackets.push(node);
        matchId++;
      }
    }

    return {
      type: 'single_elimination',
      totalRounds,
      brackets,
      players: playersWithByes
    };
  }

  // Generate double elimination bracket
  private generateDoubleElimination(players: any[]) {
    // Implementation for double elimination
    // This is more complex with winner and loser brackets
    const winnerBracket = this.generateSingleElimination(players);
    const loserBracket = this.generateLoserBracket(players.length);

    return {
      type: 'double_elimination',
      totalRounds: winnerBracket.totalRounds + loserBracket.totalRounds,
      winnerBracket: winnerBracket.brackets,
      loserBracket: loserBracket.brackets,
      players
    };
  }

  // Generate loser bracket for double elimination
  private generateLoserBracket(playerCount: number) {
    // Simplified loser bracket generation
    const rounds = Math.ceil(Math.log2(playerCount)) * 2 - 1;
    const brackets: BracketNode[] = [];

    // Generate loser bracket structure
    // This would be more complex in a full implementation

    return {
      totalRounds: rounds,
      brackets
    };
  }

  // Generate round robin bracket
  private generateRoundRobin(players: any[]) {
    const matches = [];
    const rounds = players.length - 1;
    
    // Generate all possible matches
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        matches.push({
          player1: players[i],
          player2: players[j],
          round: this.getRoundRobinRound(i, j, players.length),
          status: 'pending'
        });
      }
    }

    return {
      type: 'round_robin',
      totalRounds: rounds,
      matches,
      players,
      standings: players.map(p => ({
        player: p,
        played: 0,
        won: 0,
        lost: 0,
        points: 0
      }))
    };
  }

  // Get round for round robin match
  private getRoundRobinRound(i: number, j: number, totalPlayers: number): number {
    // Algorithm to distribute matches across rounds
    return ((i + j) % (totalPlayers - 1)) + 1;
  }

  // Create initial matches in database
  private async createInitialMatches(bracket: TournamentBracket, bracketData: any, transaction: any) {
    if (bracketData.type === 'single_elimination' || bracketData.type === 'double_elimination') {
      // Create first round matches
      const firstRoundMatches = bracketData.brackets.filter((b: BracketNode) => b.round === 1);
      
      for (const node of firstRoundMatches) {
        if (!node.player1?.isBye && !node.player2?.isBye) {
          await TournamentMatch.create({
            tournamentId: bracket.tournamentId,
            categoryId: bracket.categoryId,
            bracketId: bracket.id,
            round: this.mapRoundToEnum(node.round, bracketData.totalRounds),
            matchNumber: node.position + 1,
            player1Id: node.player1?.player1Id || node.player1?.id,
            player2Id: node.player2?.player1Id || node.player2?.id,
            player1PartnerId: node.player1?.player2Id,
            player2PartnerId: node.player2?.player2Id,
            status: 'scheduled'
          }, { transaction });
        }
      }
    } else if (bracketData.type === 'round_robin') {
      // Create all round robin matches
      for (const match of bracketData.matches) {
        await TournamentMatch.create({
          tournamentId: bracket.tournamentId,
          categoryId: bracket.categoryId,
          bracketId: bracket.id,
          round: 'round_16', // Adjust as needed
          matchNumber: match.round,
          player1Id: match.player1?.player1Id || match.player1?.id,
          player2Id: match.player2?.player1Id || match.player2?.id,
          player1PartnerId: match.player1?.player2Id,
          player2PartnerId: match.player2?.player2Id,
          status: 'scheduled'
        }, { transaction });
      }
    }
  }

  // Map round number to enum
  private mapRoundToEnum(round: number, totalRounds: number): any {
    const roundsFromFinal = totalRounds - round;
    
    switch (roundsFromFinal) {
      case 0: return 'final';
      case 1: return 'semifinal';
      case 2: return 'quarterfinal';
      case 3: return 'round_16';
      case 4: return 'round_32';
      default: return 'qualification';
    }
  }

  // Advance winner to next match
  async advanceWinner(matchId: number, winnerId: number) {
    const transaction = await sequelize.transaction();

    try {
      const match = await TournamentMatch.findByPk(matchId, {
        include: [{ model: TournamentBracket, as: 'bracket' }],
        transaction
      });

      if (!match) {
        throw new Error('Match not found');
      }

      // Update match with winner
      await match.update({
        winnerId,
        loserId: match.player1Id === winnerId ? match.player2Id : match.player1Id,
        status: 'completed',
        actualEndTime: new Date()
      }, { transaction });

      // Get the bracket
      const bracket = await TournamentBracket.findByPk(match.bracketId, { transaction });
      if (!bracket) {
        throw new Error('Bracket not found');
      }

      // Find the corresponding bracket node
      const bracketData = bracket.bracketData;
      const node = bracketData.brackets.find((b: BracketNode) => 
        b.round === this.getRoundNumber(match.round) && 
        b.position === match.matchNumber - 1
      );

      if (node && node.nextMatch) {
        // Find or create next match
        const nextNode = bracketData.brackets.find((b: BracketNode) => b.id === node.nextMatch);
        
        if (nextNode) {
          // Check if next match exists
          let nextMatch = await TournamentMatch.findOne({
            where: {
              bracketId: match.bracketId,
              round: this.mapRoundToEnum(nextNode.round, bracketData.totalRounds),
              matchNumber: nextNode.position + 1
            },
            transaction
          });

          if (!nextMatch) {
            // Create next match
            nextMatch = await TournamentMatch.create({
              tournamentId: match.tournamentId,
              categoryId: match.categoryId,
              bracketId: match.bracketId,
              round: this.mapRoundToEnum(nextNode.round, bracketData.totalRounds),
              matchNumber: nextNode.position + 1,
              status: 'scheduled'
            }, { transaction });
          }

          // Update next match with winner
          const isFirstPlayer = node.id === nextNode.prevMatch1;
          if (isFirstPlayer) {
            await nextMatch.update({ player1Id: winnerId }, { transaction });
          } else {
            await nextMatch.update({ player2Id: winnerId }, { transaction });
          }

          // Check if next match is ready to start
          if (nextMatch.player1Id && nextMatch.player2Id) {
            await nextMatch.update({ status: 'scheduled' }, { transaction });
          }
        }
      }

      // Check if tournament is complete
      if (match.round === 'final') {
        await bracket.update({
          winnerPlayerId: winnerId,
          runnerUpPlayerId: match.loserId,
          isComplete: true,
          finalizedDate: new Date()
        }, { transaction });
      }

      await transaction.commit();

      return match;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Get round number from enum
  private getRoundNumber(round: string): number {
    const roundMap: any = {
      'qualification': 0,
      'round_32': 1,
      'round_16': 2,
      'quarterfinal': 3,
      'semifinal': 4,
      'final': 5
    };
    return roundMap[round] || 0;
  }

  // Update match score
  async updateMatchScore(matchId: number, score: any) {
    const match = await TournamentMatch.findByPk(matchId);
    
    if (!match) {
      throw new Error('Match not found');
    }

    // Validate score format
    if (!this.isValidScore(score)) {
      throw new Error('Invalid score format');
    }

    // Determine winner based on score
    const winner = this.determineWinner(score);

    await match.update({
      score,
      status: 'in_progress'
    });

    // If match is complete, advance winner
    if (winner) {
      const winnerId = winner === 1 ? match.player1Id : match.player2Id;
      if (winnerId) {
        await this.advanceWinner(matchId, winnerId);
      }
    }

    return match;
  }

  // Validate score format
  private isValidScore(score: any): boolean {
    if (!score || !score.sets || !Array.isArray(score.sets)) {
      return false;
    }

    for (const set of score.sets) {
      if (typeof set.player1Score !== 'number' || typeof set.player2Score !== 'number') {
        return false;
      }
    }

    return true;
  }

  // Determine winner from score
  private determineWinner(score: any): number | null {
    if (score.walkover) {
      return score.winner;
    }

    if (score.retired) {
      return score.winner;
    }

    let player1Sets = 0;
    let player2Sets = 0;

    for (const set of score.sets) {
      if (set.player1Score > set.player2Score) {
        player1Sets++;
      } else if (set.player2Score > set.player1Score) {
        player2Sets++;
      }
    }

    // Best of 3 sets
    if (player1Sets >= 2) return 1;
    if (player2Sets >= 2) return 2;

    return null; // Match not complete
  }

  // Shuffle array for random seeding
  private shuffleArray(array: any[]): any[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Regional seeding
  private regionalSeeding(players: any[]): any[] {
    // Group players by region/state
    const grouped: any = {};
    
    for (const player of players) {
      const region = player.stateId || 'unknown';
      if (!grouped[region]) {
        grouped[region] = [];
      }
      grouped[region].push(player);
    }

    // Interleave players from different regions
    const seeded = [];
    const regions = Object.keys(grouped);
    let maxLength = 0;

    for (const region of regions) {
      if (grouped[region].length > maxLength) {
        maxLength = grouped[region].length;
      }
    }

    for (let i = 0; i < maxLength; i++) {
      for (const region of regions) {
        if (grouped[region][i]) {
          seeded.push(grouped[region][i]);
        }
      }
    }

    return seeded;
  }

  // Get bracket status
  async getBracketStatus(bracketId: number) {
    const bracket = await TournamentBracket.findByPk(bracketId, {
      include: [{
        model: TournamentMatch,
        as: 'matches'
      }]
    });

    if (!bracket) {
      throw new Error('Bracket not found');
    }

    // Get matches for this bracket
    const matches = await TournamentMatch.findAll({
      where: { bracketId }
    });

    const totalMatches = matches.length;
    const completedMatches = matches.filter((m: any) => m.status === 'completed').length;
    const inProgressMatches = matches.filter((m: any) => m.status === 'in_progress').length;
    const upcomingMatches = matches.filter((m: any) => m.status === 'scheduled').length;

    return {
      bracketId,
      totalMatches,
      completedMatches,
      inProgressMatches,
      upcomingMatches,
      progress: totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0,
      currentRound: bracket.currentRound,
      totalRounds: bracket.totalRounds,
      isComplete: bracket.isComplete
    };
  }
}

export default new BracketService();