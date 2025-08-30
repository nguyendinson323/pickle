import { 
  User,
  Coach,
  TournamentMatch,
  Tournament,
  State,
  Court
} from '../models';
import { Op } from 'sequelize';
import notificationService from './notificationService';

interface RefereeStats {
  totalMatches: number;
  completedMatches: number;
  upcomingMatches: number;
  tournamentsRefereed: number;
  nationalTournaments: number;
  stateTournaments: number;
  localTournaments: number;
  averageRating?: number;
}

class RefereeService {
  // Get available referees for a date
  async getAvailableReferees(date: string, stateId?: number) {
    // Get all coaches (who can be referees)
    const whereClause: any = {};
    if (stateId) {
      whereClause.stateId = stateId;
    }

    const coaches = await Coach.findAll({
      where: whereClause,
      include: [
        { 
          model: User, 
          as: 'user',
          attributes: ['id', 'username', 'email', 'phone']
        },
        {
          model: State,
          as: 'state'
        }
      ]
    });

    // Check which coaches are already assigned on this date
    const assignedRefereeIds = await TournamentMatch.findAll({
      where: {
        scheduledDate: date,
        refereeId: {
          [Op.not]: null
        },
        status: {
          [Op.notIn]: ['cancelled', 'completed']
        }
      },
      attributes: ['refereeId']
    });

    const busyRefereeIds = assignedRefereeIds.map(m => m.refereeId);

    // Filter out busy referees
    const availableReferees = coaches.filter(coach => 
      !busyRefereeIds.includes(coach.userId)
    );

    // Add referee stats to each available referee
    const refereesWithStats = await Promise.all(
      availableReferees.map(async (coach) => {
        const stats = await this.getRefereeStats(coach.userId);
        return {
          ...coach.toJSON(),
          refereeStats: stats
        };
      })
    );

    return refereesWithStats;
  }

  // Assign referee to match
  async assignReferee(matchId: number, refereeId: number) {
    const match = await TournamentMatch.findByPk(matchId, {
      include: [
        { model: Tournament, as: 'tournament' }
      ]
    });

    if (!match) {
      throw new Error('Match not found');
    }

    // Verify referee is a coach
    const coach = await Coach.findOne({
      where: { userId: refereeId }
    });

    if (!coach) {
      throw new Error('Referee must be a registered coach');
    }

    // Check if referee is available
    const isAvailable = await this.checkRefereeAvailability(
      refereeId,
      match.scheduledDate!,
      match.scheduledTime!
    );

    if (!isAvailable) {
      throw new Error('Referee is not available at this time');
    }

    // Assign referee
    await match.update({ refereeId });

    // Update referee history
    await this.updateRefereeHistory(refereeId, matchId);

    // Notify referee
    await notificationService.createNotification(
      refereeId,
      'Referee Assignment',
      `You have been assigned as referee for ${(match as any).tournament.name} on ${match.scheduledDate} at ${match.scheduledTime}`,
      { type: 'info', actionUrl: `/tournaments/matches/${matchId}` }
    );

    // Notify players
    if (match.player1Id) {
      const referee = await User.findByPk(refereeId);
      await notificationService.createNotification(
        match.player1Id,
        'Referee Assigned',
        `${referee?.username} has been assigned as referee for your match`,
        { type: 'info', actionUrl: `/tournaments/matches/${matchId}` }
      );
    }

    if (match.player2Id) {
      const referee = await User.findByPk(refereeId);
      await notificationService.createNotification(
        match.player2Id,
        'Referee Assigned',
        `${referee?.username} has been assigned as referee for your match`,
        { type: 'info', actionUrl: `/tournaments/matches/${matchId}` }
      );
    }

    return match;
  }

  // Check referee availability
  async checkRefereeAvailability(refereeId: number, date: string, time: string): Promise<boolean> {
    const existingAssignment = await TournamentMatch.findOne({
      where: {
        refereeId,
        scheduledDate: date,
        scheduledTime: time,
        status: {
          [Op.notIn]: ['cancelled', 'completed']
        }
      }
    });

    return !existingAssignment;
  }

  // Update referee history
  async updateRefereeHistory(refereeId: number, _matchId: number) {
    const coach = await Coach.findOne({
      where: { userId: refereeId }
    });

    if (!coach) {
      return;
    }

    // Track match history in coach's additional data if available
    // Note: matchHistory and totalMatchesRefereed fields may need to be added to Coach model
    // For now, we'll just track the assignment without updating the coach record
    // matchId: _matchId can be used when matchHistory tracking is implemented
  }

  // Get referee statistics
  async getRefereeStats(refereeId: number): Promise<RefereeStats> {
    const matches = await TournamentMatch.findAll({
      where: { refereeId },
      include: [
        { 
          model: Tournament, 
          as: 'tournament',
          attributes: ['id', 'name', 'level']
        }
      ]
    });

    const completedMatches = matches.filter(m => m.status === 'completed');
    const upcomingMatches = matches.filter(m => 
      ['scheduled', 'in_progress'].includes(m.status)
    );

    // Count unique tournaments
    const tournaments = new Set(matches.map(m => m.tournamentId));
    
    // Count by tournament level
    const nationalTournaments = matches.filter(m => 
      (m as any).tournament?.level === 'National'
    ).length;
    
    const stateTournaments = matches.filter(m => 
      (m as any).tournament?.level === 'State'
    ).length;
    
    const localTournaments = matches.filter(m => 
      ['Municipal', 'Local'].includes((m as any).tournament?.level || '')
    ).length;

    return {
      totalMatches: matches.length,
      completedMatches: completedMatches.length,
      upcomingMatches: upcomingMatches.length,
      tournamentsRefereed: tournaments.size,
      nationalTournaments,
      stateTournaments,
      localTournaments
    };
  }

  // Remove referee from match
  async removeReferee(matchId: number) {
    const match = await TournamentMatch.findByPk(matchId);

    if (!match) {
      throw new Error('Match not found');
    }

    const refereeId = match.refereeId;
    
    if (!refereeId) {
      throw new Error('No referee assigned to this match');
    }

    // Remove referee
    await match.update({ refereeId: null });

    // Notify referee
    await notificationService.createNotification(
      refereeId,
      'Referee Assignment Removed',
      `You have been removed as referee from a match`,
      { type: 'info', actionUrl: `/tournaments/matches/${matchId}` }
    );

    return match;
  }

  // Get referee schedule
  async getRefereeSchedule(refereeId: number, startDate?: string, endDate?: string) {
    const whereClause: any = { refereeId };

    if (startDate && endDate) {
      whereClause.scheduledDate = {
        [Op.between]: [startDate, endDate]
      };
    }

    const matches = await TournamentMatch.findAll({
      where: whereClause,
      include: [
        { 
          model: Tournament, 
          as: 'tournament',
          attributes: ['id', 'name', 'venueName', 'venueAddress']
        },
        { 
          model: User, 
          as: 'player1',
          attributes: ['id', 'username']
        },
        { 
          model: User, 
          as: 'player2',
          attributes: ['id', 'username']
        },
        {
          model: Court,
          as: 'court'
        }
      ],
      order: [['scheduledDate', 'ASC'], ['scheduledTime', 'ASC']]
    });

    // Group by date
    const schedule: any = {};
    
    for (const match of matches) {
      const date = match.scheduledDate;
      if (!date) continue;
      
      if (!schedule[date]) {
        schedule[date] = [];
      }
      
      schedule[date].push({
        id: match.id,
        time: match.scheduledTime,
        tournament: (match as any).tournament?.name,
        venue: (match as any).tournament?.venueName,
        court: (match as any).court?.name,
        players: `${(match as any).player1?.username} vs ${(match as any).player2?.username}`,
        status: match.status,
        round: match.round
      });
    }

    return schedule;
  }

  // Request referee for match
  async requestReferee(matchId: number, preferredRefereeIds?: number[]) {
    const match = await TournamentMatch.findByPk(matchId, {
      include: [
        { model: Tournament, as: 'tournament' }
      ]
    });

    if (!match) {
      throw new Error('Match not found');
    }

    // Get available referees
    const availableReferees = await this.getAvailableReferees(
      match.scheduledDate!,
      (match as any).tournament?.stateId
    );

    // Filter by preferred if provided
    let targetReferees = availableReferees;
    if (preferredRefereeIds && preferredRefereeIds.length > 0) {
      targetReferees = availableReferees.filter(r => 
        preferredRefereeIds.includes(r.userId)
      );
    }

    // Send notifications to available referees
    for (const referee of targetReferees) {
      await notificationService.createNotification(
        referee.userId,
        'Referee Request',
        `You are requested to referee a match in ${(match as any).tournament.name} on ${match.scheduledDate}`,
        { 
          type: 'info', 
          actionUrl: `/referee/requests/${matchId}`
        }
      );
    }

    return {
      matchId,
      requestSentTo: targetReferees.length,
      referees: targetReferees.map(r => ({
        id: r.userId,
        name: (r as any).user?.username || 'Unknown'
      }))
    };
  }

  // Accept referee assignment
  async acceptRefereeAssignment(matchId: number, refereeId: number) {
    const match = await TournamentMatch.findByPk(matchId);

    if (!match) {
      throw new Error('Match not found');
    }

    if (match.refereeId) {
      throw new Error('Match already has a referee assigned');
    }

    // Assign referee
    await this.assignReferee(matchId, refereeId);

    // Clear other referee requests for this match
    // Note: clearNotifications method not available in current notification service

    return match;
  }

  // Get referee performance
  async getRefereePerformance(refereeId: number, tournamentId?: number) {
    const whereClause: any = { 
      refereeId,
      status: 'completed'
    };

    if (tournamentId) {
      whereClause.tournamentId = tournamentId;
    }

    const matches = await TournamentMatch.findAll({
      where: whereClause,
      include: [
        { model: Tournament, as: 'tournament' }
      ]
    });

    // Calculate performance metrics
    const totalMatches = matches.length;
    const onTimeStarts = matches.filter(m => {
      if (!m.scheduledTime || !m.actualStartTime) return false;
      const scheduled = new Date(`2024-01-01 ${m.scheduledTime}`);
      const actual = new Date(m.actualStartTime);
      const diffMinutes = Math.abs(actual.getTime() - scheduled.getTime()) / 60000;
      return diffMinutes <= 15; // Within 15 minutes
    }).length;

    const averageMatchDuration = matches.reduce((sum, m) => {
      if (!m.actualStartTime || !m.actualEndTime) return sum;
      const duration = new Date(m.actualEndTime).getTime() - new Date(m.actualStartTime).getTime();
      return sum + duration;
    }, 0) / (matches.filter(m => m.actualStartTime && m.actualEndTime).length || 1);

    return {
      totalMatches,
      onTimeStarts,
      onTimePercentage: (onTimeStarts / totalMatches) * 100,
      averageMatchDuration: Math.round(averageMatchDuration / 60000), // in minutes
      tournamentsRefereed: new Set(matches.map(m => m.tournamentId)).size
    };
  }

  // Get top referees
  async getTopReferees(limit: number = 10, stateId?: number) {
    const whereClause: any = {};
    if (stateId) {
      whereClause.stateId = stateId;
    }

    const coaches = await Coach.findAll({
      where: whereClause,
      include: [
        { 
          model: User, 
          as: 'user',
          attributes: ['id', 'username']
        }
      ],
      order: [['totalMatchesRefereed', 'DESC']],
      limit
    });

    const topReferees = await Promise.all(
      coaches.map(async (coach) => {
        const stats = await this.getRefereeStats(coach.userId);
        return {
          id: coach.userId,
          name: (coach as any).user?.username || 'Unknown',
          totalMatches: stats.totalMatches,
          nationalTournaments: stats.nationalTournaments,
          stateTournaments: stats.stateTournaments
        };
      })
    );

    return topReferees;
  }
}

export default new RefereeService();