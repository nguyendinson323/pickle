import { Request, Response } from 'express';
import { MicrositeService } from '../services/micrositeService';
import { PageService } from '../services/pageService';
import { ContentBlockService } from '../services/contentBlockService';
import { ThemeService } from '../services/themeService';
import { MediaService } from '../services/mediaService';
import { AuthRequest } from '../middleware/auth';

const micrositeService = new MicrositeService();
const pageService = new PageService();
const contentBlockService = new ContentBlockService();
const themeService = new ThemeService();
const mediaService = new MediaService();

export const micrositeController = {
  // Microsite CRUD operations
  async createMicrosite(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const microsite = await micrositeService.createMicrosite(userId, req.body);
      res.status(201).json({ success: true, data: microsite });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getMicrosite(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const microsite = await micrositeService.getMicrositeById(parseInt(id));
      
      // Check if user has permission to view this microsite
      if (microsite.status !== 'published' && microsite.userId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json({ success: true, data: microsite });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },

  async getMicrositeBySubdomain(req: Request, res: Response) {
    try {
      const { subdomain } = req.params;
      const microsite = await micrositeService.getMicrositeBySubdomain(subdomain);

      if (!microsite) {
        return res.status(404).json({ error: 'Microsite not found' });
      }

      res.json({ success: true, data: microsite });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getUserMicrosites(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { ownerType } = req.query;
      const microsites = await micrositeService.getUserMicrosites(userId, ownerType as string);

      res.json({ success: true, data: microsites });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateMicrosite(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const microsite = await micrositeService.updateMicrosite(parseInt(id), userId, req.body);
      res.json({ success: true, data: microsite });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async publishMicrosite(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const microsite = await micrositeService.publishMicrosite(parseInt(id), userId);
      res.json({ success: true, data: microsite });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async unpublishMicrosite(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const microsite = await micrositeService.unpublishMicrosite(parseInt(id), userId);
      res.json({ success: true, data: microsite });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteMicrosite(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await micrositeService.deleteMicrosite(parseInt(id), userId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async duplicateMicrosite(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { subdomain } = req.body;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const microsite = await micrositeService.duplicateMicrosite(parseInt(id), userId, subdomain);
      res.json({ success: true, data: microsite });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  // Page operations
  async createPage(req: AuthRequest, res: Response) {
    try {
      const { micrositeId } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const page = await pageService.createPage(parseInt(micrositeId), userId, req.body);
      res.status(201).json({ success: true, data: page });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getPage(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const page = await pageService.getPageById(parseInt(id), userId);
      res.json({ success: true, data: page });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },

  async getPageBySlug(req: Request, res: Response) {
    try {
      const { subdomain, slug } = req.params;
      
      // First get microsite by subdomain
      const microsite = await micrositeService.getMicrositeBySubdomain(subdomain);
      if (!microsite) {
        return res.status(404).json({ error: 'Microsite not found' });
      }

      const page = await pageService.getPageBySlug(microsite.id, slug || '', true);
      if (!page) {
        return res.status(404).json({ error: 'Page not found' });
      }

      res.json({ success: true, data: page });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getMicrositePages(req: AuthRequest, res: Response) {
    try {
      const { micrositeId } = req.params;
      const userId = req.user?.userId;
      const publishedOnly = req.query.published === 'true';

      const pages = await pageService.getMicrositePages(
        parseInt(micrositeId), 
        userId, 
        publishedOnly
      );

      res.json({ success: true, data: pages });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updatePage(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const page = await pageService.updatePage(parseInt(id), userId, req.body);
      res.json({ success: true, data: page });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async publishPage(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const page = await pageService.publishPage(parseInt(id), userId);
      res.json({ success: true, data: page });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async unpublishPage(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const page = await pageService.unpublishPage(parseInt(id), userId);
      res.json({ success: true, data: page });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async deletePage(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await pageService.deletePage(parseInt(id), userId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async duplicatePage(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const page = await pageService.duplicatePage(parseInt(id), userId);
      res.json({ success: true, data: page });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async reorderPages(req: AuthRequest, res: Response) {
    try {
      const { micrositeId } = req.params;
      const { pageOrders } = req.body;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const pages = await pageService.reorderPages(parseInt(micrositeId), userId, pageOrders);
      res.json({ success: true, data: pages });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  // Content Block operations
  async createContentBlock(req: AuthRequest, res: Response) {
    try {
      const { pageId } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const block = await contentBlockService.createBlock(parseInt(pageId), userId, req.body);
      res.status(201).json({ success: true, data: block });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getContentBlock(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const block = await contentBlockService.getBlockById(parseInt(id), userId);
      res.json({ success: true, data: block });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },

  async getPageBlocks(req: AuthRequest, res: Response) {
    try {
      const { pageId } = req.params;
      const userId = req.user?.userId;
      const visibleOnly = req.query.visible === 'true';

      const blocks = await contentBlockService.getPageBlocks(
        parseInt(pageId), 
        userId, 
        visibleOnly
      );

      res.json({ success: true, data: blocks });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateContentBlock(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const block = await contentBlockService.updateBlock(parseInt(id), userId, req.body);
      res.json({ success: true, data: block });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteContentBlock(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await contentBlockService.deleteBlock(parseInt(id), userId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async duplicateContentBlock(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const block = await contentBlockService.duplicateBlock(parseInt(id), userId);
      res.json({ success: true, data: block });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async reorderContentBlocks(req: AuthRequest, res: Response) {
    try {
      const { pageId } = req.params;
      const { blockOrders } = req.body;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const blocks = await contentBlockService.reorderBlocks(parseInt(pageId), userId, blockOrders);
      res.json({ success: true, data: blocks });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async toggleBlockVisibility(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const block = await contentBlockService.toggleBlockVisibility(parseInt(id), userId);
      res.json({ success: true, data: block });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  // Theme operations
  async getThemes(req: Request, res: Response) {
    try {
      const activeOnly = req.query.active !== 'false';
      const themes = await themeService.getAllThemes(activeOnly);
      res.json({ success: true, data: themes });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getTheme(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const theme = await themeService.getThemeById(parseInt(id));
      res.json({ success: true, data: theme });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },

  async generateThemeCSS(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const customizations = req.body;

      const css = await themeService.generateCss(parseInt(id), customizations);
      
      res.setHeader('Content-Type', 'text/css');
      res.send(css);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  // Media operations
  async uploadMedia(req: AuthRequest, res: Response) {
    try {
      const { micrositeId } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const mediaFile = await mediaService.uploadFile(
        parseInt(micrositeId), 
        userId, 
        req.file, 
        req.body
      );

      res.status(201).json({ success: true, data: mediaFile });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getMicrositeMedia(req: AuthRequest, res: Response) {
    try {
      const { micrositeId } = req.params;
      const userId = req.user?.userId;

      const options = {
        type: req.query.type as string,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        search: req.query.search as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
      };

      const result = await mediaService.getMicrositeMedia(
        parseInt(micrositeId), 
        userId, 
        options
      );

      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateMediaFile(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const mediaFile = await mediaService.updateMediaFile(parseInt(id), userId, req.body);
      res.json({ success: true, data: mediaFile });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteMediaFile(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await mediaService.deleteMediaFile(parseInt(id), userId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  // Public endpoints
  async getPublicMicrosites(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

      const result = await micrositeService.getPublicMicrosites(limit, offset);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async searchMicrosites(req: Request, res: Response) {
    try {
      const { q: query } = req.query;
      const filters = {
        ownerType: req.query.ownerType as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
      };

      const microsites = await micrositeService.searchMicrosites(query as string, filters);
      res.json({ success: true, data: microsites });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};