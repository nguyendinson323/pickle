import { Request, Response } from 'express';
import { Op } from 'sequelize';
import MicrositeBuilderService from '../services/micrositeBuilderService';
import Microsite from '../models/Microsite';
import MicrositeTemplate from '../models/MicrositeTemplate';
import MicrositeAnalytics from '../models/MicrositeAnalytics';
import MediaLibrary from '../models/MediaLibrary';

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
    email: string;
  };
}

const micrositeBuilderService = new MicrositeBuilderService();

export const getMicrosites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { ownerType, status, page = 1, limit = 10 } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const whereClause: any = { ownerId: userId };

    if (ownerType && typeof ownerType === 'string') {
      whereClause.ownerType = ownerType;
    }

    if (status && typeof status === 'string') {
      whereClause.status = status;
    }

    const { count, rows: microsites } = await Microsite.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / Number(limit));

    res.json({
      success: true,
      data: {
        microsites,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalItems: count,
          itemsPerPage: Number(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching microsites:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los micrositios',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getMicrositeById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const microsite = await Microsite.findOne({
      where: {
        id: Number(id),
        ownerId: userId
      }
    });

    if (!microsite) {
      return res.status(404).json({
        success: false,
        message: 'Micrositio no encontrado'
      });
    }

    res.json({
      success: true,
      data: microsite
    });
  } catch (error) {
    console.error('Error fetching microsite:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el micrositio',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const createMicrosite = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const micrositeData = req.body;

    const microsite = await micrositeBuilderService.createMicrosite(userId, micrositeData);

    res.status(201).json({
      success: true,
      message: 'Micrositio creado exitosamente',
      data: microsite
    });
  } catch (error) {
    console.error('Error creating microsite:', error);
    const statusCode = error instanceof Error && error.message.includes('already exists') ? 409 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al crear el micrositio',
    });
  }
};

export const updateMicrosite = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const updates = req.body;

    const microsite = await Microsite.findOne({
      where: {
        id: Number(id),
        ownerId: userId
      }
    });

    if (!microsite) {
      return res.status(404).json({
        success: false,
        message: 'Micrositio no encontrado'
      });
    }

    if (updates.subdomain && updates.subdomain !== microsite.subdomain) {
      const existingSubdomain = await Microsite.findOne({
        where: {
          subdomain: updates.subdomain,
          id: { [Op.ne]: Number(id) }
        }
      });

      if (existingSubdomain) {
        return res.status(409).json({
          success: false,
          message: 'El subdominio ya está en uso'
        });
      }
    }

    await microsite.update(updates);

    res.json({
      success: true,
      message: 'Micrositio actualizado exitosamente',
      data: microsite
    });
  } catch (error) {
    console.error('Error updating microsite:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el micrositio',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const deleteMicrosite = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const result = await micrositeBuilderService.deleteMicrosite(Number(id), userId);

    res.json({
      success: true,
      message: 'Micrositio eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting microsite:', error);
    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al eliminar el micrositio',
    });
  }
};

export const publishMicrosite = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const microsite = await micrositeBuilderService.publishMicrosite(Number(id), userId);

    res.json({
      success: true,
      message: 'Micrositio publicado exitosamente',
      data: microsite
    });
  } catch (error) {
    console.error('Error publishing microsite:', error);
    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al publicar el micrositio',
    });
  }
};

export const unpublishMicrosite = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const microsite = await micrositeBuilderService.unpublishMicrosite(Number(id), userId);

    res.json({
      success: true,
      message: 'Micrositio despublicado exitosamente',
      data: microsite
    });
  } catch (error) {
    console.error('Error unpublishing microsite:', error);
    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al despublicar el micrositio',
    });
  }
};

export const duplicateMicrosite = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { subdomain, name } = req.body;
    const userId = req.user!.id;

    if (!subdomain) {
      return res.status(400).json({
        success: false,
        message: 'Subdominio requerido'
      });
    }

    const newMicrosite = await micrositeBuilderService.duplicateMicrosite(
      Number(id), 
      userId, 
      subdomain
    );

    res.status(201).json({
      success: true,
      message: 'Micrositio duplicado exitosamente',
      data: newMicrosite
    });
  } catch (error) {
    console.error('Error duplicating microsite:', error);
    const statusCode = error instanceof Error && error.message.includes('already exists') ? 409 : 
                      error instanceof Error && error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al duplicar el micrositio',
    });
  }
};

export const addPage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const pageData = req.body;

    const page = await micrositeBuilderService.addPage(Number(id), userId, pageData);

    res.status(201).json({
      success: true,
      message: 'Página agregada exitosamente',
      data: page
    });
  } catch (error) {
    console.error('Error adding page:', error);
    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al agregar la página',
    });
  }
};

export const updatePage = async (req: AuthRequest, res: Response) => {
  try {
    const { id, pageId } = req.params;
    const userId = req.user!.id;
    const pageUpdates = req.body;

    const page = await micrositeBuilderService.updatePage(Number(id), pageId, userId, pageUpdates);

    res.json({
      success: true,
      message: 'Página actualizada exitosamente',
      data: page
    });
  } catch (error) {
    console.error('Error updating page:', error);
    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al actualizar la página',
    });
  }
};

export const deletePage = async (req: AuthRequest, res: Response) => {
  try {
    const { id, pageId } = req.params;
    const userId = req.user!.id;

    await micrositeBuilderService.deletePage(Number(id), pageId, userId);

    res.json({
      success: true,
      message: 'Página eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error deleting page:', error);
    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al eliminar la página',
    });
  }
};

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { startDate, endDate, period = 'daily' } = req.query;

    const microsite = await Microsite.findOne({
      where: {
        id: Number(id),
        ownerId: userId
      }
    });

    if (!microsite) {
      return res.status(404).json({
        success: false,
        message: 'Micrositio no encontrado'
      });
    }

    const analytics = await micrositeBuilderService.getAnalytics(
      Number(id),
      startDate as string,
      endDate as string
    );

    res.json({
      success: true,
      data: {
        ...analytics,
        micrositeName: microsite.name,
        period
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las analíticas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const uploadMedia = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó archivo'
      });
    }

    const mediaData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      storageKey: req.file.path,
      url: `/uploads/${req.file.filename}`,
      alt: req.body.alt || '',
      caption: req.body.caption,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      folder: req.body.folder,
      category: req.file.mimetype.startsWith('image/') ? 'image' : 
               req.file.mimetype.startsWith('video/') ? 'video' :
               req.file.mimetype.startsWith('audio/') ? 'audio' : 'document'
    };

    const media = await micrositeBuilderService.uploadMedia(Number(id), userId, mediaData);

    res.status(201).json({
      success: true,
      message: 'Archivo subido exitosamente',
      data: media
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al subir el archivo',
    });
  }
};

export const getMedia = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { category, folder, page = 1, limit = 20 } = req.query;

    const media = await micrositeBuilderService.getMedia(
      Number(id),
      userId,
      category as string,
      folder as string,
      Number(page),
      Number(limit)
    );

    res.json({
      success: true,
      data: media
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al obtener los archivos',
    });
  }
};

export const deleteMedia = async (req: AuthRequest, res: Response) => {
  try {
    const { id, mediaId } = req.params;
    const userId = req.user!.id;

    await micrositeBuilderService.deleteMedia(Number(id), Number(mediaId), userId);

    res.json({
      success: true,
      message: 'Archivo eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al eliminar el archivo',
    });
  }
};

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const { category, isPremium } = req.query;

    const whereClause: any = {};

    if (category && typeof category === 'string') {
      whereClause.category = category;
    }

    if (isPremium !== undefined) {
      whereClause.isPremium = isPremium === 'true';
    }

    const templates = await MicrositeTemplate.findAll({
      where: whereClause,
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los templates',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getPublicMicrosite = async (req: Request, res: Response) => {
  try {
    const { subdomain } = req.params;

    const microsite = await Microsite.findOne({
      where: {
        subdomain,
        status: 'published'
      }
    });

    if (!microsite) {
      return res.status(404).json({
        success: false,
        message: 'Micrositio no encontrado'
      });
    }

    const publishedPages = microsite.pages.filter(page => page.isPublished);

    const publicMicrosite = {
      ...microsite.toJSON(),
      pages: publishedPages
    };

    // Track page view
    await micrositeBuilderService.trackAnalytics(microsite.id, {
      pageViews: 1,
      uniqueVisitors: 1,
      sessions: 1
    });

    res.json({
      success: true,
      data: publicMicrosite
    });
  } catch (error) {
    console.error('Error fetching public microsite:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el micrositio',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const generateSitemap = async (req: Request, res: Response) => {
  try {
    const { subdomain } = req.params;

    const sitemap = await micrositeBuilderService.generateSitemap(subdomain);

    res.setHeader('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar el sitemap',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};