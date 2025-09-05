import { Request, Response } from 'express';
import { Tournament, TournamentCategory, TournamentRegistration, User } from '../models';

// Create category for tournament
const createCategory = async (req: Request, res: Response) => {
  try {
    const { tournamentId } = req.params;
    const categoryData = req.body;
    const userId = req.user?.userId;

    const tournament = await Tournament.findByPk(tournamentId);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    if (tournament.organizerId !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to add categories to this tournament' });
    }

    if (!['draft', 'open'].includes(tournament.status)) {
      return res.status(400).json({ error: 'Cannot add categories to tournament in current status' });
    }

    const category = await TournamentCategory.create({
      ...categoryData,
      tournamentId: Number(tournamentId)
    });

    res.status(201).json({ category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Update category
const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user?.userId;

    const category = await TournamentCategory.findByPk(id, {
      include: [Tournament]
    });
    if (!category) return res.status(404).json({ error: 'Category not found' });

    const tournament = category.get('Tournament') as any;
    if (tournament?.organizerId !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this category' });
    }

    if (!['draft', 'open'].includes(tournament?.status)) {
      return res.status(400).json({ error: 'Cannot update category for tournament in current status' });
    }

    await category.update(updates);
    res.json({ category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Delete category
const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const category = await TournamentCategory.findByPk(id, {
      include: [
        Tournament,
        { model: TournamentRegistration, as: 'registrations' }
      ]
    });

    if (!category) return res.status(404).json({ error: 'Category not found' });
    
    const tournament = category.get('Tournament') as any;
    const registrations = category.get('registrations') as any[];
    
    if (tournament?.organizerId !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this category' });
    }

    if (registrations && registrations.length > 0) {
      return res.status(400).json({ error: 'Cannot delete category with active registrations' });
    }

    if (tournament?.status !== 'draft') {
      return res.status(400).json({ error: 'Can only delete categories from draft tournaments' });
    }

    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

// Get categories by tournament
const getCategoriesByTournament = async (req: Request, res: Response) => {
  try {
    const { tournamentId } = req.params;

    const categories = await TournamentCategory.findAll({
      where: { tournamentId: Number(tournamentId) },
      include: [
        {
          model: TournamentRegistration,
          as: 'registrations',
          attributes: ['id', 'status']
        }
      ],
      order: [['name', 'ASC']]
    });

    const categoriesWithStats = categories.map(category => {
      const categoryData = category.toJSON() as any;
      return {
        ...categoryData,
        registrationCount: categoryData.registrations?.length || 0,
        availableSpots: categoryData.maxParticipants - (categoryData.registrations?.length || 0)
      };
    });

    res.json({ categories: categoriesWithStats });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get category details
const getCategoryDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await TournamentCategory.findByPk(id, {
      include: [
        Tournament,
        {
          model: TournamentRegistration,
          as: 'registrations',
          include: [{ model: User, as: 'player', attributes: ['id', 'username', 'email'] }]
        }
      ]
    });

    if (!category) return res.status(404).json({ error: 'Category not found' });

    res.json({ category });
  } catch (error) {
    console.error('Error fetching category details:', error);
    res.status(500).json({ error: 'Failed to fetch category details' });
  }
};

// Toggle category active status
const toggleCategoryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const category = await TournamentCategory.findByPk(id, {
      include: [Tournament]
    });

    if (!category) return res.status(404).json({ error: 'Category not found' });
    
    const tournament = category.get('Tournament') as any;
    if (tournament?.organizerId !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to modify this category' });
    }

    const currentStatus = category.isActive;
    await category.update({ isActive: !currentStatus });

    res.json({ 
      message: `Category ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      category 
    });
  } catch (error) {
    console.error('Error toggling category status:', error);
    res.status(500).json({ error: 'Failed to toggle category status' });
  }
};

export default {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesByTournament,
  getCategoryDetails,
  toggleCategoryStatus
};