import { 
  TournamentMatch,
  TournamentBracket,
  User,
  Court,
  TournamentCategory
} from '../models';
import NotificationService from './notificationService';
import { Op } from 'sequelize';

class MatchService {
  // Schedule match
  async scheduleMatch(matchId: number, courtId: number, scheduledDate: string, scheduledTime: string) {
    const match = await TournamentMatch.findByPk(matchId, {
      include: [
        { model: User, as: 'player1' },
        { model: User, as: 'player2' },
        { model: Court, as: 'court' }
      ]
    });

    if (!match) {
      throw new Error('Match not found');
    }

    // Check if court is available
    const isAvailable = await this.checkCourtAvailability(courtId, scheduledDate, scheduledTime);
    if (!isAvailable) {
      throw new Error('Court is not available at the scheduled time');
    }

    await match.update({
      courtId,
      scheduledDate,
      scheduledTime,
      status: 'scheduled'
    });

    // Notify players
    if (match.player1Id) {
      await new NotificationService().sendNotification({
        userId: match.player1Id.toString(),
        type: 'tournament',
        category: 'info',
        title: 'Match Scheduled',
        message: `Your match has been scheduled for ${scheduledDate} at ${scheduledTime}`
      });
    }

    if (match.player2Id) {
      await new NotificationService().sendNotification({
        userId: match.player2Id.toString(),
        type: 'tournament',
        category: 'info',
        title: 'Match Scheduled',
        message: `Your match has been scheduled for ${scheduledDate} at ${scheduledTime}`
      });
    }

    return match;
  }

  // Check court availability
  async checkCourtAvailability(courtId: number, date: string, time: string): Promise<boolean> {
    const existingMatch = await TournamentMatch.findOne({
      where: {
        courtId,
        scheduledDate: date,
        scheduledTime: time,
        status: {
          [Op.notIn]: ['completed', 'cancelled']
        }
      }
    });

    return !existingMatch;
  }

  // Start match
  async startMatch(matchId: number) {
    const match = await TournamentMatch.findByPk(matchId);

    if (!match) {
      throw new Error('Match not found');
    }

    if (match.status !== 'scheduled') {
      throw new Error('Match is not in scheduled status');
    }

    await match.update({
      status: 'in_progress',
      actualStartTime: new Date()
    });

    // Notify players
    if (match.player1Id) {
      const notificationServiceInstance = new NotificationService();
      await notificationServiceInstance.sendNotification({
        userId: match.player1Id.toString(),
        type: 'tournament',
        category: 'info',
        title: 'Match Started',
        message: 'Your match has started!'
    });
    }

    if (match.player2Id) {
      const notificationServiceInstance2 = new NotificationService();
      await notificationServiceInstance2.sendNotification({
        userId: match.player2Id.toString(),
        type: 'tournament',
        category: 'info',
        title: 'Match Started',
        message: 'Your match has started!'
    });
    }

    return match;
  }

  // Update match score
  async updateScore(matchId: number, score: any, isPartial: boolean = true) {
    const match = await TournamentMatch.findByPk(matchId);

    if (!match) {
      throw new Error('Match not found');
    }

    if (match.status !== 'in_progress' && !isPartial) {
      throw new Error('Match is not in progress');
    }

    // Validate score format
    if (!this.isValidScore(score)) {
      throw new Error('Invalid score format');
    }

    await match.update({ score });

    // Check if match is complete
    const winner = this.determineWinner(score);
    if (winner && !isPartial) {
      await this.completeMatch(matchId, winner);
    }

    return match;
  }

  // Complete match
  async completeMatch(matchId: number, winner: 1 | 2) {
    const match = await TournamentMatch.findByPk(matchId, {
      include: [
        { model: TournamentBracket, as: 'bracket' },
        { model: User, as: 'player1' },
        { model: User, as: 'player2' }
      ]
    });

    if (!match) {
      throw new Error('Match not found');
    }

    const winnerId = winner === 1 ? match.player1Id : match.player2Id;
    const loserId = winner === 1 ? match.player2Id : match.player1Id;

    await match.update({
      winnerId,
      loserId,
      status: 'completed',
      actualEndTime: new Date()
    });

    // Update bracket if exists
    if ((match as any).bracket) {
      await this.advanceInBracket(match, winnerId!);
    }

    // Update player statistics
    await this.updatePlayerStats(winnerId!, loserId!, match);

    // Notify players
    if (winnerId) {
      await new NotificationService().sendNotification({
        userId: winnerId.toString(),
        type: 'tournament',
        category: 'success',
        title: 'Match Won!',
        message: 'Congratulations on winning your match!'
      });
    }

    if (loserId) {
      await new NotificationService().sendNotification({
        userId: loserId.toString(),
        type: 'tournament',
        category: 'info',
        title: 'Match Completed',
        message: 'Your match has been completed. Better luck next time!'
      });
    }

    return match;
  }

  // Advance winner in bracket
  private async advanceInBracket(match: TournamentMatch, winnerId: number) {
    // Find next match in bracket
    const bracketData = (match as any).bracket!.bracketData;
    const currentNode = this.findNodeInBracket(bracketData, match);

    if (currentNode && currentNode.nextMatch) {
      const nextNode = bracketData.brackets.find((n: any) => n.id === currentNode.nextMatch);
      
      if (nextNode) {
        // Find or create next match
        let nextMatch = await TournamentMatch.findOne({
          where: {
            bracketId: match.bracketId,
            round: this.getNextRound(match.round),
            matchNumber: nextNode.position + 1
          }
        });

        if (!nextMatch) {
          nextMatch = await TournamentMatch.create({
            tournamentId: match.tournamentId,
            categoryId: match.categoryId,
            bracketId: match.bracketId,
            round: this.getNextRound(match.round),
            matchNumber: nextNode.position + 1,
            status: 'scheduled'
          });
        }

        // Update next match with winner
        const isFirstPlayer = currentNode.id === nextNode.prevMatch1;
        if (isFirstPlayer) {
          await nextMatch.update({ player1Id: winnerId });
        } else {
          await nextMatch.update({ player2Id: winnerId });
        }
      }
    }

    // Check if this was the final match
    if (match.round === 'final') {
      await (match as any).bracket!.update({
        winnerPlayerId: winnerId,
        runnerUpPlayerId: match.loserId,
        isComplete: true,
        finalizedDate: new Date()
      });
    }
  }

  // Find node in bracket structure
  private findNodeInBracket(bracketData: any, match: TournamentMatch): any {
    return bracketData.brackets.find((node: any) => 
      node.round === this.getRoundNumber(match.round) && 
      node.position === match.matchNumber - 1
    );
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

  // Get next round enum
  private getNextRound(currentRound: string): any {
    const progression: any = {
      'qualification': 'round_32',
      'round_32': 'round_16',
      'round_16': 'quarterfinal',
      'quarterfinal': 'semifinal',
      'semifinal': 'final',
      'final': null
    };
    return progression[currentRound];
  }

  // Update player statistics
  private async updatePlayerStats(winnerId: number, loserId: number, match: TournamentMatch) {
    // This would update player statistics like wins, losses, etc.
    // Implementation depends on your player stats tracking system
  }

  // Cancel match
  async cancelMatch(matchId: number, reason: string) {
    const match = await TournamentMatch.findByPk(matchId);

    if (!match) {
      throw new Error('Match not found');
    }

    if (match.status === 'completed') {
      throw new Error('Cannot cancel completed match');
    }

    await match.update({
      status: 'cancelled',
      notes: reason
    });

    // Notify players
    if (match.player1Id) {
      await new NotificationService().sendNotification({
        userId: match.player1Id.toString(),
        type: 'tournament',
        category: 'warning',
        title: 'Match Cancelled',
        message: `Your match has been cancelled. Reason: ${reason}`
      });
    }

    if (match.player2Id) {
      await new NotificationService().sendNotification({
        userId: match.player2Id.toString(),
        type: 'tournament',
        category: 'warning',
        title: 'Match Cancelled',
        message: `Your match has been cancelled. Reason: ${reason}`
      });
    }

    return match;
  }

  // Postpone match
  async postponeMatch(matchId: number, newDate: string, newTime: string, reason: string) {
    const match = await TournamentMatch.findByPk(matchId);

    if (!match) {
      throw new Error('Match not found');
    }

    if (match.status === 'completed') {
      throw new Error('Cannot postpone completed match');
    }

    await match.update({
      status: 'postponed',
      scheduledDate: newDate,
      scheduledTime: newTime,
      notes: reason
    });

    // Notify players
    if (match.player1Id) {
      await new NotificationService().sendNotification({
        userId: match.player1Id.toString(),
        type: 'tournament',
        category: 'info',
        title: 'Match Postponed',
        message: `Your match has been postponed to ${newDate} at ${newTime}. Reason: ${reason}`
      });
    }

    if (match.player2Id) {
      await new NotificationService().sendNotification({
        userId: match.player2Id.toString(),
        type: 'tournament',
        category: 'info',
        title: 'Match Postponed',
        message: `Your match has been postponed to ${newDate} at ${newTime}. Reason: ${reason}`
      });
    }

    return match;
  }

  // Record walkover
  async recordWalkover(matchId: number, winnerId: number, reason: string) {
    const match = await TournamentMatch.findByPk(matchId);

    if (!match) {
      throw new Error('Match not found');
    }

    const loserId = match.player1Id === winnerId ? match.player2Id : match.player1Id;

    await match.update({
      winnerId,
      loserId,
      status: 'walkover',
      score: {
        sets: [],
        walkover: true,
        retired: false,
        winner: match.player1Id === winnerId ? 1 : 2
      },
      notes: reason,
      actualEndTime: new Date()
    });

    // Advance winner in bracket
    if (match.bracketId) {
      await this.advanceInBracket(match, winnerId);
    }

    return match;
  }

  // Record retirement
  async recordRetirement(matchId: number, retiringPlayerId: number, score: any, reason: string) {
    const match = await TournamentMatch.findByPk(matchId);

    if (!match) {
      throw new Error('Match not found');
    }

    const winnerId = match.player1Id === retiringPlayerId ? match.player2Id : match.player1Id;
    const loserId = retiringPlayerId;

    await match.update({
      winnerId,
      loserId,
      status: 'retired',
      score: {
        ...score,
        retired: true,
        winner: match.player1Id === winnerId ? 1 : 2
      },
      notes: `Retired: ${reason}`,
      actualEndTime: new Date()
    });

    // Advance winner in bracket
    if (match.bracketId) {
      await this.advanceInBracket(match, winnerId!);
    }

    return match;
  }

  // Assign referee to match
  async assignReferee(matchId: number, refereeId: number) {
    const match = await TournamentMatch.findByPk(matchId);
    const referee = await User.findByPk(refereeId);

    if (!match) {
      throw new Error('Match not found');
    }

    if (!referee || referee.role !== 'coach') {
      throw new Error('Invalid referee');
    }

    await match.update({ refereeId });

    // Notify referee
    await new NotificationService().sendNotification({
      userId: refereeId.toString(),
      type: 'tournament',
      category: 'info',
      title: 'Referee Assignment',
      message: `You have been assigned as referee for a match on ${match.scheduledDate} at ${match.scheduledTime}`
    });

    return match;
  }

  // Get match schedule
  async getMatchSchedule(tournamentId: number, date?: string) {
    const where: any = { tournamentId };
    
    if (date) {
      where.scheduledDate = date;
    }

    const matches = await TournamentMatch.findAll({
      where,
      include: [
        { model: User, as: 'player1', attributes: ['id', 'username'] },
        { model: User, as: 'player2', attributes: ['id', 'username'] },
        { model: Court, as: 'court' },
        { model: TournamentCategory, as: 'category' },
        { model: User, as: 'referee', attributes: ['id', 'username'] }
      ],
      order: [['scheduledDate', 'ASC'], ['scheduledTime', 'ASC']]
    });

    return matches;
  }

  // Get player matches
  async getPlayerMatches(playerId: number, tournamentId?: number) {
    const where: any = {
      [Op.or]: [
        { player1Id: playerId },
        { player2Id: playerId },
        { player1PartnerId: playerId },
        { player2PartnerId: playerId }
      ]
    };

    if (tournamentId) {
      where.tournamentId = tournamentId;
    }

    const matches = await TournamentMatch.findAll({
      where,
      include: [
        { model: User, as: 'player1', attributes: ['id', 'username'] },
        { model: User, as: 'player2', attributes: ['id', 'username'] },
        { model: User, as: 'player1Partner', attributes: ['id', 'username'] },
        { model: User, as: 'player2Partner', attributes: ['id', 'username'] },
        { model: TournamentCategory, as: 'category' },
        { model: Court, as: 'court' }
      ],
      order: [['scheduledDate', 'DESC'], ['scheduledTime', 'DESC']]
    });

    return matches;
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
  private determineWinner(score: any): 1 | 2 | null {
    if (score.walkover || score.retired) {
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
}

export default new MatchService();