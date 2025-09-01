import { Request, Response } from 'express';
import cloudinaryService from '../services/cloudinaryService';

interface AuthenticatedRequest extends Request {
  userId?: number;
  userRole?: string;
}

class UploadController {
  async uploadImage(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      const { folder = 'general' } = req.body;
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const result = await cloudinaryService.uploadToCloudinary(
        req.file.buffer,
        folder,
        req.file.originalname
      );

      res.json({
        success: true,
        data: {
          publicId: result.publicId,
          url: result.secureUrl,
          originalFilename: result.originalFilename,
          bytes: result.bytes,
          format: result.format
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'File upload failed'
      });
    }
  }

  async uploadProfilePhoto(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No photo uploaded'
        });
      }

      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const result = await cloudinaryService.uploadProfilePhoto(
        req.file.buffer,
        req.file.originalname,
        userId
      );

      res.json({
        success: true,
        url: result.secureUrl,
        publicId: result.publicId,
        data: {
          publicId: result.publicId,
          url: result.secureUrl,
          originalFilename: result.originalFilename
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Profile photo upload failed'
      });
    }
  }

  async uploadDocument(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No document uploaded'
        });
      }

      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const result = await cloudinaryService.uploadIdDocument(
        req.file.buffer,
        req.file.originalname,
        userId
      );

      res.json({
        success: true,
        url: result.secureUrl,
        publicId: result.publicId,
        data: {
          publicId: result.publicId,
          url: result.secureUrl,
          originalFilename: result.originalFilename
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Document upload failed'
      });
    }
  }

  async uploadLogo(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No logo uploaded'
        });
      }

      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const result = await cloudinaryService.uploadOrganizationLogo(
        req.file.buffer,
        req.file.originalname,
        userId
      );

      res.json({
        success: true,
        data: {
          publicId: result.publicId,
          url: result.secureUrl,
          originalFilename: result.originalFilename
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Logo upload failed'
      });
    }
  }

  async deleteFile(req: AuthenticatedRequest, res: Response) {
    try {
      const { publicId } = req.params;

      if (!publicId) {
        return res.status(400).json({
          success: false,
          error: 'Public ID is required'
        });
      }

      await cloudinaryService.deleteFromCloudinary(publicId);

      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'File deletion failed'
      });
    }
  }

  async getFileInfo(req: AuthenticatedRequest, res: Response) {
    try {
      const { publicId } = req.params;

      if (!publicId) {
        return res.status(400).json({
          success: false,
          error: 'Public ID is required'
        });
      }

      const info = await cloudinaryService.getFileInfo(publicId);

      res.json({
        success: true,
        data: info
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get file info'
      });
    }
  }
}

export default new UploadController();