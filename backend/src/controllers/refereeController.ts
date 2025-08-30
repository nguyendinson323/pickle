import { Request, Response } from 'express';
import refereeService from '../services/refereeService';
import { TournamentMatch, Tournament, Coach } from '../models';
import notificationService from '../services/notificationService';
import { UserRole } from '../types/auth';

interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: UserRole;
  };
}

const getAvailableReferees = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { date, stateId, tournamentId } = req.query;

    if (!date) {
      res.status(400).json({ error: 'Date is required' });
      return;
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
};

const assignReferee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { matchId } = req.params;
    const { refereeId } = req.body;
    const userId = req.user?.userId;

    const match = await TournamentMatch.findByPk(matchId, {
      include: [Tournament]
    });

    if (!match) {
      res.status(404).json({ error: 'Match not found' });
      return;
    }

    const tournament = (match as any).Tournament;
    if (tournament?.organizerId !== userId && req.user?.role !== 'federation') {
      res.status(403).json({ error: 'Not authorized to assign referee' });
      return;
    }

    const assignment = await refereeService.assignReferee(Number(matchId), Number(refereeId));

    // Notify referee
    const referee = await Coach.findByPk(refereeId);
    if (referee) {
      await notificationService.createNotification(
        referee.userId,
        'referee_assignment',
        `You have been assigned as referee for a match`
      );
    }

    res.json({ message: 'Referee assigned successfully', assignment });
  } catch (error: any) {
    console.error('Error assigning referee:', error);
    res.status(400).json({ error: error.message || 'Failed to assign referee' });
  }
};

const removeReferee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { matchId } = req.params;
    const userId = req.user?.userId;

    const match = await TournamentMatch.findByPk(matchId, {
      include: [Tournament]
    });

    if (!match) {
      res.status(404).json({ error: 'Match not found' });
      return;
    }

    const tournament = (match as any).Tournament;
    if (tournament?.organizerId !== userId && req.user?.role !== 'federation') {
      res.status(403).json({ error: 'Not authorized to remove referee' });
      return;
    }

    await refereeService.removeReferee(Number(matchId));
    res.json({ message: 'Referee removed successfully' });
  } catch (error: any) {
    console.error('Error removing referee:', error);
    res.status(400).json({ error: error.message || 'Failed to remove referee' });
  }
};

const updateRefereeStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { matchId } = req.params;
    const { status, notes } = req.body;
    const userId = req.user?.userId;

    const match = await TournamentMatch.findByPk(matchId, {
      include: [Tournament]
    });

    if (!match) {
      res.status(404).json({ error: 'Match not found' });
      return;
    }

    const tournament = (match as any).Tournament;
    if (tournament?.organizerId !== userId && req.user?.role !== 'federation') {
      res.status(403).json({ error: 'Not authorized to update referee status' });
      return;
    }

    // Update match with referee feedback
    const matchToUpdate = await TournamentMatch.findByPk(matchId);
    if (matchToUpdate) {
      await matchToUpdate.update({ status, notes } as any);
    }
    const updated = matchToUpdate;

    res.json({ message: 'Referee status updated', data: updated });
  } catch (error: any) {
    console.error('Error updating referee status:', error);
    res.status(400).json({ error: error.message || 'Failed to update referee status' });
  }
};

const getRefereeSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
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
};

const getRefereeStatistics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refereeId } = req.params;

    const stats = await refereeService.getRefereeStats(Number(refereeId));
    res.json({ statistics: stats });
  } catch (error) {
    console.error('Error fetching referee statistics:', error);
    res.status(500).json({ error: 'Failed to fetch referee statistics' });
  }
};

export default {
  getAvailableReferees,
  assignReferee,
  removeReferee,
  updateRefereeStatus,
  getRefereeSchedule,
  getRefereeStatistics
};