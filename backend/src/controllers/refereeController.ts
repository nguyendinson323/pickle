import { Request, Response } from 'express';
import refereeService from '../services/refereeService';
import { TournamentMatch, Tournament, Coach } from '../models';
import notificationService from '../services/notificationService';

export class RefereeController {
  // Get available referees
  async getAvailableReferees(req: Request, res: Response) {
    try {
      const { date, stateId, tournamentId } = req.query;

      if (!date) {
        return res.status(400).json({ error: 'Date is required' });
      }

      const referees = await refereeService.getAvailableReferees(
        date as string,
        stateId ? Number(stateId) : undefined,
        tournamentId ? Number(tournamentId) : undefined
      );

      res.json({ referees });
    } catch (error) {
      console.error('Error fetching available referees:', error);
      res.status(500).json({ error: 'Failed to fetch available referees' });
    }
  }

  // Assign referee to match
  async assignReferee(req: Request, res: Response) {
    try {
      const { matchId } = req.params;
      const { refereeId } = req.body;
      const userId = req.user?.id;

      // Check if user is authorized (tournament organizer or admin)
      const match = await TournamentMatch.findByPk(matchId, {
        include: [{ model: Tournament, as: 'tournament' }]
      });

      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }

      if (match.tournament.organizerId !== userId && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to assign referee' });
      }

      const updatedMatch = await refereeService.assignReferee(
        Number(matchId),
        refereeId
      );

      res.json({ match: updatedMatch });
    } catch (error: any) {
      console.error('Error assigning referee:', error);
      res.status(400).json({ error: error.message || 'Failed to assign referee' });
    }
  }

  // Remove referee from match
  async removeReferee(req: Request, res: Response) {
    try {
      const { matchId } = req.params;
      const userId = req.user?.id;

      // Check authorization
      const match = await TournamentMatch.findByPk(matchId, {
        include: [{ model: Tournament, as: 'tournament' }]
      });

      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }

      if (match.tournament.organizerId !== userId && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to remove referee' });
      }

      const updatedMatch = await refereeService.removeReferee(Number(matchId));

      res.json({ match: updatedMatch });
    } catch (error: any) {
      console.error('Error removing referee:', error);
      res.status(400).json({ error: error.message || 'Failed to remove referee' });
    }
  }

  // Get referee schedule
  async getRefereeSchedule(req: Request, res: Response) {
    try {
      const { refereeId } = req.params;
      const { startDate, endDate } = req.query;

      const schedule = await refereeService.getRefereeSchedule(
        Number(refereeId),
        startDate as string,
        endDate as string
      );

      res.json({ schedule });
    } catch (error) {
      console.error('Error fetching referee schedule:', error);
      res.status(500).json({ error: 'Failed to fetch referee schedule' });
    }
  }

  // Get my referee schedule (for coaches)
  async getMyRefereeSchedule(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { startDate, endDate } = req.query;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const schedule = await refereeService.getRefereeSchedule(
        userId,
        startDate as string,
        endDate as string
      );

      res.json({ schedule });
    } catch (error) {
      console.error('Error fetching referee schedule:', error);
      res.status(500).json({ error: 'Failed to fetch referee schedule' });
    }
  }

  // Get referee statistics
  async getRefereeStats(req: Request, res: Response) {
    try {
      const { refereeId } = req.params;

      const stats = await refereeService.getRefereeStats(Number(refereeId));

      res.json({ statistics: stats });
    } catch (error) {
      console.error('Error fetching referee statistics:', error);
      res.status(500).json({ error: 'Failed to fetch referee statistics' });
    }
  }

  // Get my referee statistics (for coaches)
  async getMyRefereeStats(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const stats = await refereeService.getRefereeStats(userId);

      res.json({ statistics: stats });
    } catch (error) {
      console.error('Error fetching referee statistics:', error);
      res.status(500).json({ error: 'Failed to fetch referee statistics' });
    }
  }

  // Request referee for match
  async requestReferee(req: Request, res: Response) {
    try {
      const { matchId } = req.params;
      const { preferredRefereeIds } = req.body;
      const userId = req.user?.id;

      // Check authorization
      const match = await TournamentMatch.findByPk(matchId, {
        include: [{ model: Tournament, as: 'tournament' }]
      });

      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }

      if (match.tournament.organizerId !== userId && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to request referee' });
      }

      const result = await refereeService.requestReferee(
        Number(matchId),
        preferredRefereeIds
      );

      res.json(result);
    } catch (error: any) {
      console.error('Error requesting referee:', error);
      res.status(400).json({ error: error.message || 'Failed to request referee' });
    }
  }

  // Accept referee assignment
  async acceptRefereeAssignment(req: Request, res: Response) {
    try {
      const { matchId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Verify user is a coach
      const coach = await Coach.findOne({ where: { userId } });
      if (!coach) {
        return res.status(403).json({ error: 'Only coaches can accept referee assignments' });
      }

      const match = await refereeService.acceptRefereeAssignment(
        Number(matchId),
        userId
      );

      res.json({ match });
    } catch (error: any) {
      console.error('Error accepting referee assignment:', error);
      res.status(400).json({ error: error.message || 'Failed to accept referee assignment' });
    }
  }

  // Decline referee assignment
  async declineRefereeAssignment(req: Request, res: Response) {
    try {
      const { matchId } = req.params;
      const { reason } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Clear the notification for this referee
      await notificationService.clearNotifications({
        userId,
        metadata: { matchId: Number(matchId) }
      });

      res.json({ message: 'Referee assignment declined' });
    } catch (error) {
      console.error('Error declining referee assignment:', error);
      res.status(500).json({ error: 'Failed to decline referee assignment' });
    }
  }

  // Get referee performance
  async getRefereePerformance(req: Request, res: Response) {
    try {
      const { refereeId } = req.params;
      const { tournamentId } = req.query;

      const performance = await refereeService.getRefereePerformance(
        Number(refereeId),
        tournamentId ? Number(tournamentId) : undefined
      );

      res.json({ performance });
    } catch (error) {
      console.error('Error fetching referee performance:', error);
      res.status(500).json({ error: 'Failed to fetch referee performance' });
    }
  }

  // Get top referees
  async getTopReferees(req: Request, res: Response) {
    try {
      const { limit = 10, stateId } = req.query;

      const topReferees = await refereeService.getTopReferees(
        Number(limit),
        stateId ? Number(stateId) : undefined
      );

      res.json({ referees: topReferees });
    } catch (error) {
      console.error('Error fetching top referees:', error);
      res.status(500).json({ error: 'Failed to fetch top referees' });
    }
  }

  // Check referee availability
  async checkAvailability(req: Request, res: Response) {
    try {
      const { refereeId, date, time } = req.query;

      if (!refereeId || !date || !time) {
        return res.status(400).json({ error: 'Referee ID, date, and time are required' });
      }

      const isAvailable = await refereeService.checkRefereeAvailability(
        Number(refereeId),
        date as string,
        time as string
      );

      res.json({ available: isAvailable });
    } catch (error) {
      console.error('Error checking referee availability:', error);
      res.status(500).json({ error: 'Failed to check referee availability' });
    }
  }
}

export default new RefereeController();