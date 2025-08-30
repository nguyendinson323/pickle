import { Op } from 'sequelize';
import MediaFile from '../models/MediaFile';
import Microsite from '../models/Microsite';
import User from '../models/User';
import { cloudinaryService } from './cloudinaryService';

export class MediaService {
  async uploadFile(micrositeId: number, userId: number, file: any, metadata: any = {}) {
    try {
      // Verify user owns the microsite
      const microsite = await Microsite.findOne({
        where: { id: micrositeId, userId }
      });

      if (!microsite) {
        throw new Error('Microsite not found or unauthorized');
      }

      // Upload to Cloudinary
      const cloudinaryResult = await cloudinaryService.uploadToCloudinary(
        file.buffer,
        `microsites/${micrositeId}`,
        file.originalname || file.name,
        {
          public_id: metadata.customName || undefined,
          transformation: metadata.transformation || undefined
        }
      );

      // Save file record to database
      const mediaFile = await MediaFile.create({
        micrositeId,
        userId,
        originalName: file.originalname || file.name,
        fileName: cloudinaryResult.publicId,
        filePath: cloudinaryResult.secureUrl,
        fileUrl: cloudinaryResult.secureUrl,
        mimeType: file.mimetype || 'image/jpeg',
        fileSize: file.size || cloudinaryResult.bytes,
        alt: metadata.alt || '',
        title: metadata.title || '',
        description: metadata.description || '',
        tags: metadata.tags || [],
        isPublic: metadata.isPublic !== false
      });

      return mediaFile;
    } catch (error) {
      throw error;
    }
  }

  async getMediaFile(id: number, userId?: number) {
    try {
      const includeOptions: any = [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'username']
        }
      ];

      if (userId) {
        includeOptions.push({
          model: Microsite,
          as: 'microsite',
          where: { userId },
          attributes: ['id', 'name', 'userId']
        });
      }

      const mediaFile = await MediaFile.findByPk(id, {
        include: includeOptions
      });

      if (!mediaFile) {
        throw new Error('Media file not found');
      }

      return mediaFile;
    } catch (error) {
      throw error;
    }
  }

  async getMicrositeMedia(micrositeId: number, userId?: number, options: any = {}) {
    try {
      // If userId is provided, verify ownership
      if (userId) {
        const microsite = await Microsite.findOne({
          where: { id: micrositeId, userId }
        });

        if (!microsite) {
          throw new Error('Microsite not found or unauthorized');
        }
      }

      const whereClause: any = { micrositeId };

      // Filter by MIME type
      if (options.type) {
        switch (options.type) {
          case 'images':
            whereClause.mimeType = { [Op.like]: 'image/%' };
            break;
          case 'videos':
            whereClause.mimeType = { [Op.like]: 'video/%' };
            break;
          case 'documents':
            whereClause.mimeType = { [Op.notLike]: 'image/%' };
            whereClause.mimeType = { [Op.notLike]: 'video/%' };
            break;
        }
      }

      // Filter by tags
      if (options.tags && options.tags.length > 0) {
        whereClause.tags = { [Op.overlap]: options.tags };
      }

      // Search in title, alt, or description
      if (options.search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${options.search}%` } },
          { alt: { [Op.iLike]: `%${options.search}%` } },
          { description: { [Op.iLike]: `%${options.search}%` } }
        ];
      }

      // Only public files for non-owners
      if (!userId) {
        whereClause.isPublic = true;
      }

      const { count, rows } = await MediaFile.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'uploader',
            attributes: ['id', 'username']
          }
        ],
        order: [['created_at', 'DESC']],
        limit: options.limit || 50,
        offset: options.offset || 0
      });

      return {
        files: rows,
        total: count,
        limit: options.limit || 50,
        offset: options.offset || 0
      };
    } catch (error) {
      throw error;
    }
  }

  async updateMediaFile(id: number, userId: number, data: any) {
    try {
      const mediaFile = await MediaFile.findOne({
        where: { id },
        include: [
          {
            model: Microsite,
            as: 'microsite',
            where: { userId }
          }
        ]
      });

      if (!mediaFile) {
        throw new Error('Media file not found or unauthorized');
      }

      await mediaFile.update({
        alt: data.alt,
        title: data.title,
        description: data.description,
        tags: data.tags,
        isPublic: data.isPublic
      });

      return mediaFile;
    } catch (error) {
      throw error;
    }
  }

  async deleteMediaFile(id: number, userId: number) {
    try {
      const mediaFile = await MediaFile.findOne({
        where: { id },
        include: [
          {
            model: Microsite,
            as: 'microsite',
            where: { userId }
          }
        ]
      });

      if (!mediaFile) {
        throw new Error('Media file not found or unauthorized');
      }

      // Delete from Cloudinary
      try {
        await cloudinaryService.deleteFromCloudinary(mediaFile.fileName);
      } catch (cloudinaryError) {
        console.warn('Failed to delete file from Cloudinary:', cloudinaryError);
      }

      // Delete from database
      await mediaFile.destroy();

      return { success: true, message: 'Media file deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getMediaUsage(id: number, userId: number) {
    try {
      const mediaFile = await this.getMediaFile(id, userId);

      // This would need to search through content blocks and other places where media is used
      // For now, returning basic info
      return {
        mediaFile,
        usage: {
          contentBlocks: 0,
          pages: 0,
          microsites: 0
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async bulkUpload(micrositeId: number, userId: number, files: any[], metadata: any = {}) {
    try {
      // Verify user owns the microsite
      const microsite = await Microsite.findOne({
        where: { id: micrositeId, userId }
      });

      if (!microsite) {
        throw new Error('Microsite not found or unauthorized');
      }

      const results = [];
      const errors = [];

      for (const file of files) {
        try {
          const result = await this.uploadFile(micrositeId, userId, file, metadata);
          results.push(result);
        } catch (error) {
          errors.push({
            file: file.originalname || file.name,
            error: error.message
          });
        }
      }

      return {
        success: results.length,
        errorCount: errors.length,
        results,
        errors
      };
    } catch (error) {
      throw error;
    }
  }

  async bulkDelete(ids: number[], userId: number) {
    try {
      const results = [];
      const errors = [];

      for (const id of ids) {
        try {
          await this.deleteMediaFile(id, userId);
          results.push({ id, success: true });
        } catch (error) {
          errors.push({ id, error: error.message });
        }
      }

      return {
        success: results.length,
        errorCount: errors.length,
        results,
        errors
      };
    } catch (error) {
      throw error;
    }
  }

  async getStorageStats(micrositeId: number, userId: number) {
    try {
      // Verify user owns the microsite
      const microsite = await Microsite.findOne({
        where: { id: micrositeId, userId }
      });

      if (!microsite) {
        throw new Error('Microsite not found or unauthorized');
      }

      const stats = await MediaFile.findAll({
        where: { micrositeId },
        attributes: [
          [MediaFile.sequelize!.fn('COUNT', MediaFile.sequelize!.col('id')), 'totalFiles'],
          [MediaFile.sequelize!.fn('SUM', MediaFile.sequelize!.col('file_size')), 'totalSize'],
          [MediaFile.sequelize!.fn('COUNT', MediaFile.sequelize!.literal("CASE WHEN mime_type LIKE 'image/%' THEN 1 END")), 'images'],
          [MediaFile.sequelize!.fn('COUNT', MediaFile.sequelize!.literal("CASE WHEN mime_type LIKE 'video/%' THEN 1 END")), 'videos'],
          [MediaFile.sequelize!.fn('COUNT', MediaFile.sequelize!.literal("CASE WHEN mime_type NOT LIKE 'image/%' AND mime_type NOT LIKE 'video/%' THEN 1 END")), 'documents']
        ],
        raw: true
      });

      return stats[0];
    } catch (error) {
      throw error;
    }
  }

  async createFolder(micrositeId: number, userId: number, name: string, parentPath?: string) {
    try {
      // Verify user owns the microsite
      const microsite = await Microsite.findOne({
        where: { id: micrositeId, userId }
      });

      if (!microsite) {
        throw new Error('Microsite not found or unauthorized');
      }

      // Create folder in Cloudinary
      const folderPath = parentPath ? `${parentPath}/${name}` : name;
      const fullPath = `microsites/${micrositeId}/${folderPath}`;

      // Note: createFolder method not available in CloudinaryService
      // Cloudinary folders are created automatically when files are uploaded to them
      console.log(`Folder would be created at: ${fullPath}`);

      return {
        name,
        path: folderPath,
        fullPath
      };
    } catch (error) {
      throw error;
    }
  }

  async getFolders(micrositeId: number, userId: number, path?: string) {
    try {
      // Verify user owns the microsite
      const microsite = await Microsite.findOne({
        where: { id: micrositeId, userId }
      });

      if (!microsite) {
        throw new Error('Microsite not found or unauthorized');
      }

      const basePath = `microsites/${micrositeId}`;
      const fullPath = path ? `${basePath}/${path}` : basePath;

      // Note: getFolders method not available in CloudinaryService
      // Returning empty array as placeholder
      console.log(`Would get folders for: ${fullPath}`);
      return [];
    } catch (error) {
      throw error;
    }
  }

  async optimizeImage(id: number, userId: number, options: any) {
    try {
      const mediaFile = await MediaFile.findOne({
        where: { id },
        include: [
          {
            model: Microsite,
            as: 'microsite',
            where: { userId }
          }
        ]
      });

      if (!mediaFile) {
        throw new Error('Media file not found or unauthorized');
      }

      if (!mediaFile.mimeType.startsWith('image/')) {
        throw new Error('File is not an image');
      }

      // Note: getOptimizedUrl method not available in CloudinaryService
      // Using original URL as fallback
      const optimizedUrl = mediaFile.fileUrl;
      console.log(`Would optimize image ${mediaFile.fileName} with options:`, options);

      return {
        original: mediaFile.fileUrl,
        optimized: optimizedUrl,
        options
      };
    } catch (error) {
      throw error;
    }
  }

  async generateThumbnail(id: number, userId: number, size: string = '150x150') {
    try {
      const mediaFile = await this.getMediaFile(id, userId);

      if (!mediaFile.mimeType.startsWith('image/')) {
        throw new Error('File is not an image');
      }

      // Note: getThumbnailUrl method not available in CloudinaryService
      // Using original URL as fallback
      const thumbnailUrl = mediaFile.fileUrl;
      console.log(`Would generate thumbnail for ${mediaFile.fileName} with size: ${size}`);

      return {
        original: mediaFile.fileUrl,
        thumbnail: thumbnailUrl
      };
    } catch (error) {
      throw error;
    }
  }
}