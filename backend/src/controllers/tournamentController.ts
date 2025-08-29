import { Request, Response } from 'express';
import { 
  Tournament, 
  TournamentCategory, 
  TournamentRegistration, 
  TournamentBracket,
  TournamentMatch,
  User,
  State,
  Court
} from '../models';
import tournamentService from '../services/tournamentService';
import { Op } from 'sequelize';

export class TournamentController {
  // Create tournament
  async createTournament(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;
      const tournamentData = req.body;

      // Validate organizer permissions
      if (!tournamentService.canCreateTournament(userRole, tournamentData.level)) {
        return res.status(403).json({ error: 'Insufficient permissions to create this tournament level' });
      }

      // Set organizer info
      tournamentData.organizerId = userId;
      tournamentData.organizerType = userRole;

      const tournament = await Tournament.create(tournamentData);

      res.status(201).json({ tournament });
    } catch (error) {
      console.error('Error creating tournament:', error);
      res.status(500).json({ error: 'Failed to create tournament' });
    }
  }

  // Update tournament
  async updateTournament(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const updates = req.body;

      const tournament = await Tournament.findByPk(id);
      if (!tournament) {
        return res.status(404).json({ error: 'Tournament not found' });
      }

      // Check ownership
      if (tournament.organizerId !== userId && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to update this tournament' });
      }

      await tournament.update(updates);

      res.json({ tournament });
    } catch (error) {
      console.error('Error updating tournament:', error);
      res.status(500).json({ error: 'Failed to update tournament' });
    }
  }

  // Delete tournament
  async deleteTournament(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const tournament = await Tournament.findByPk(id, {
        include: [{ model: TournamentRegistration, as: 'registrations' }]
      });

      if (!tournament) {
        return res.status(404).json({ error: 'Tournament not found' });
      }

      // Check ownership
      if (tournament.organizerId !== userId && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to delete this tournament' });
      }

      // Check if tournament has registrations
      if (tournament.registrations && tournament.registrations.length > 0) {
        return res.status(400).json({ error: 'Cannot delete tournament with active registrations' });
      }

      await tournament.destroy();

      res.json({ message: 'Tournament deleted successfully' });
    } catch (error) {
      console.error('Error deleting tournament:', error);
      res.status(500).json({ error: 'Failed to delete tournament' });
    }
  }

  // Get tournament details
  async getTournament(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const tournament = await Tournament.findByPk(id, {
        include: [
          { model: TournamentCategory, as: 'categories' },
          { model: State, as: 'state' },
          { model: User, as: 'organizer', attributes: ['id', 'username', 'email'] }
        ]
      });

      if (!tournament) {
        return res.status(404).json({ error: 'Tournament not found' });
      }

      res.json({ tournament });
    } catch (error) {
      console.error('Error fetching tournament:', error);
      res.status(500).json({ error: 'Failed to fetch tournament' });
    }
  }

  // Get tournaments by organizer
  async getTournamentsByOrganizer(req: Request, res: Response) {
    try {
      const { organizerId } = req.params;
      const { status, level } = req.query;

      const where: any = { organizerId };
      if (status) where.status = status;
      if (level) where.level = level;

      const tournaments = await Tournament.findAll({
        where,
        include: [
          { model: TournamentCategory, as: 'categories' },
          { model: State, as: 'state' }
        ],
        order: [['startDate', 'DESC']]
      });

      res.json({ tournaments });
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      res.status(500).json({ error: 'Failed to fetch tournaments' });
    }
  }

  // Search tournaments
  async searchTournaments(req: Request, res: Response) {
    try {
      const { 
        search, 
        level, 
        status, 
        stateId, 
        startDate, 
        endDate,
        tournamentType,
        page = 1,
        limit = 10
      } = req.query;

      const where: any = {};

      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (level) where.level = level;
      if (status) where.status = status;
      if (stateId) where.stateId = stateId;
      if (tournamentType) where.tournamentType = tournamentType;

      if (startDate && endDate) {
        where.startDate = {
          [Op.between]: [startDate, endDate]
        };
      }

      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: tournaments } = await Tournament.findAndCountAll({
        where,
        include: [
          { model: TournamentCategory, as: 'categories' },
          { model: State, as: 'state' },
          { model: User, as: 'organizer', attributes: ['id', 'username'] }
        ],
        limit: Number(limit),
        offset,
        order: [['startDate', 'ASC']]
      });

      res.json({
        tournaments,
        totalCount: count,
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit))
      });
    } catch (error) {
      console.error('Error searching tournaments:', error);
      res.status(500).json({ error: 'Failed to search tournaments' });
    }
  }

  // Get upcoming tournaments
  async getUpcomingTournaments(req: Request, res: Response) {
    try {
      const { limit = 10 } = req.query;

      const tournaments = await Tournament.findAll({
        where: {
          status: ['open', 'registration_closed'],
          startDate: {
            [Op.gte]: new Date()
          }
        },
        include: [
          { model: TournamentCategory, as: 'categories' },
          { model: State, as: 'state' }
        ],
        limit: Number(limit),
        order: [['startDate', 'ASC']]
      });

      res.json({ tournaments });
    } catch (error) {
      console.error('Error fetching upcoming tournaments:', error);
      res.status(500).json({ error: 'Failed to fetch upcoming tournaments' });
    }
  }

  // Get active tournaments
  async getActiveTournaments(req: Request, res: Response) {
    try {
      const tournaments = await Tournament.findAll({
        where: {
          status: 'in_progress'
        },
        include: [
          { model: TournamentCategory, as: 'categories' },
          { model: State, as: 'state' },
          { model: TournamentMatch, as: 'matches', where: { status: 'in_progress' }, required: false }
        ],
        order: [['startDate', 'ASC']]
      });

      res.json({ tournaments });
    } catch (error) {
      console.error('Error fetching active tournaments:', error);
      res.status(500).json({ error: 'Failed to fetch active tournaments' });
    }
  }

  // Update tournament status
  async updateTournamentStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.id;

      const tournament = await Tournament.findByPk(id);
      if (!tournament) {
        return res.status(404).json({ error: 'Tournament not found' });
      }

      // Check ownership
      if (tournament.organizerId !== userId && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to update this tournament' });
      }

      // Validate status transition
      if (!tournamentService.isValidStatusTransition(tournament.status, status)) {
        return res.status(400).json({ error: 'Invalid status transition' });
      }

      await tournament.update({ status });

      // Handle status-specific actions
      if (status === 'in_progress') {
        await tournamentService.startTournament(tournament.id);
      } else if (status === 'completed') {
        await tournamentService.completeTournament(tournament.id);
      }

      res.json({ tournament });
    } catch (error) {
      console.error('Error updating tournament status:', error);
      res.status(500).json({ error: 'Failed to update tournament status' });
    }
  }

  // Get tournament statistics
  async getTournamentStatistics(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const stats = await tournamentService.getTournamentStatistics(Number(id));

      res.json({ statistics: stats });
    } catch (error) {
      console.error('Error fetching tournament statistics:', error);
      res.status(500).json({ error: 'Failed to fetch tournament statistics' });
    }
  }

  // Export tournament data
  async exportTournamentData(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { format = 'json' } = req.query;

      const tournament = await Tournament.findByPk(id, {
        include: [
          { model: TournamentCategory, as: 'categories' },
          { model: TournamentRegistration, as: 'registrations', include: [{ model: User, as: 'player' }] },
          { model: TournamentBracket, as: 'brackets' },
          { model: TournamentMatch, as: 'matches' }
        ]
      });

      if (!tournament) {
        return res.status(404).json({ error: 'Tournament not found' });
      }

      if (format === 'csv') {
        const csv = await tournamentService.exportToCSV(tournament);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="tournament-${id}.csv"`);
        res.send(csv);
      } else {
        res.json({ tournament });
      }
    } catch (error) {
      console.error('Error exporting tournament data:', error);
      res.status(500).json({ error: 'Failed to export tournament data' });
    }
  }
}

export default new TournamentController();