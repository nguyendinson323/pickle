import { Request, Response } from 'express';
import micrositeService from '../services/micrositeService';
import { UserRole } from '../types/auth';

interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: UserRole;
  };
}

// Microsite CRUD
const createMicrosite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const microsite = await micrositeService.createMicrosite(userId, req.body);
    res.status(201).json({ success: true, data: microsite });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const getMicrosite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const microsite = await micrositeService.getMicrositeById(parseInt(id));

    if (microsite.status !== 'published' && microsite.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json({ success: true, data: microsite });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

const getMicrositeBySubdomain = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subdomain } = req.params;
    const microsite = await micrositeService.getMicrositeWithPages(subdomain);

    if (!microsite) {
      res.status(404).json({ error: 'Microsite not found' });
      return;
    }

    res.json({ success: true, data: microsite });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Page handling functions
const getMicrositePage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subdomain, slug } = req.params;
    
    // First get the microsite
    const microsite = await micrositeService.getMicrositeBySubdomain(subdomain);
    if (!microsite || microsite.status !== 'published') {
      res.status(404).json({ error: 'Microsite not found' });
      return;
    }

    // Then get the specific page
    const page = await micrositeService.getPageBySlug(microsite.id, slug);
    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    res.json({ 
      success: true, 
      data: { 
        microsite: {
          id: microsite.id,
          name: microsite.name,
          subdomain: microsite.subdomain,
          title: microsite.title,
          description: microsite.description,
          logoUrl: microsite.logoUrl,
          faviconUrl: microsite.faviconUrl,
          settings: microsite.settings
        },
        page 
      } 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getUserMicrosites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const microsites = await micrositeService.getUserMicrosites(userId, req.query.ownerType as string);
    res.json({ success: true, data: microsites });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const updateMicrosite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const microsite = await micrositeService.updateMicrosite(parseInt(id), userId, req.body);
    res.json({ success: true, data: microsite });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const publishMicrosite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const microsite = await micrositeService.publishMicrosite(parseInt(id), userId);
    res.json({ success: true, data: microsite });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const unpublishMicrosite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const microsite = await micrositeService.unpublishMicrosite(parseInt(id), userId);
    res.json({ success: true, data: microsite });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMicrosite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = await micrositeService.deleteMicrosite(parseInt(id), userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const duplicateMicrosite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { subdomain } = req.body;
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const microsite = await micrositeService.duplicateMicrosite(parseInt(id), userId, subdomain);
    res.json({ success: true, data: microsite });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Export all
export default {
  createMicrosite,
  getMicrosite,
  getMicrositeBySubdomain,
  getMicrositePage,
  getUserMicrosites,
  updateMicrosite,
  publishMicrosite,
  unpublishMicrosite,
  deleteMicrosite,
  duplicateMicrosite
};