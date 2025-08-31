import { Request, Response } from 'express';
import profileService from '../services/profileService';
import { AuthenticatedRequest } from '../types/auth';

export class ProfileController {
  // Get user profile based on role
  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Authentication required',
            code: 'UNAUTHORIZED'
          }
        });
      }

      const profile = await profileService.getProfileByUserId(req.user.userId);

      if (!profile) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Profile not found',
            code: 'PROFILE_NOT_FOUND'
          }
        });
      }

      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to get profile',
          code: 'GET_PROFILE_FAILED'
        }
      });
    }
  }

  // Update user profile
  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Authentication required',
            code: 'UNAUTHORIZED'
          }
        });
      }

      const updatedProfile = await profileService.updateProfile(
        req.user.userId,
        req.user.role,
        req.body
      );

      res.json({
        success: true,
        data: updatedProfile,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to update profile',
          code: 'UPDATE_PROFILE_FAILED'
        }
      });
    }
  }

  // Upload profile photo
  async uploadProfilePhoto(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'No photo file provided',
            code: 'NO_FILE'
          }
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Authentication required',
            code: 'UNAUTHORIZED'
          }
        });
      }

      const result = await profileService.updateProfilePhoto(
        req.user.userId,
        req.user.role,
        req.file
      );

      res.json({
        success: true,
        data: {
          photoUrl: result.photoUrl,
          publicId: result.publicId
        },
        message: 'Profile photo updated successfully'
      });
    } catch (error) {
      console.error('Upload profile photo error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to upload profile photo',
          code: 'UPLOAD_PHOTO_FAILED'
        }
      });
    }
  }

  // Upload ID document
  async uploadIdDocument(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'No document file provided',
            code: 'NO_FILE'
          }
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Authentication required',
            code: 'UNAUTHORIZED'
          }
        });
      }

      // Only players and coaches can upload ID documents
      if (!['player', 'coach'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: {
            message: 'Only players and coaches can upload ID documents',
            code: 'FORBIDDEN'
          }
        });
      }

      const result = await profileService.updateIdDocument(
        req.user.userId,
        req.user.role,
        req.file
      );

      res.json({
        success: true,
        data: {
          documentUrl: result.documentUrl,
          publicId: result.publicId
        },
        message: 'ID document uploaded successfully'
      });
    } catch (error) {
      console.error('Upload ID document error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to upload ID document',
          code: 'UPLOAD_DOCUMENT_FAILED'
        }
      });
    }
  }

  // Upload organization logo (for clubs, partners, state committees)
  async uploadLogo(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'No logo file provided',
            code: 'NO_FILE'
          }
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Authentication required',
            code: 'UNAUTHORIZED'
          }
        });
      }

      // Only organizations can upload logos
      if (!['club', 'partner', 'state'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: {
            message: 'Only organizations can upload logos',
            code: 'FORBIDDEN'
          }
        });
      }

      const result = await profileService.updateLogo(
        req.user.userId,
        req.user.role,
        req.file
      );

      res.json({
        success: true,
        data: {
          logoUrl: result.logoUrl,
          publicId: result.publicId
        },
        message: 'Logo uploaded successfully'
      });
    } catch (error) {
      console.error('Upload logo error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to upload logo',
          code: 'UPLOAD_LOGO_FAILED'
        }
      });
    }
  }

  // Get profile completion status
  async getProfileCompletion(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Authentication required',
            code: 'UNAUTHORIZED'
          }
        });
      }

      const completion = await profileService.getProfileCompletion(
        req.user.userId,
        req.user.role
      );

      res.json({
        success: true,
        data: completion
      });
    } catch (error) {
      console.error('Get profile completion error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to get profile completion',
          code: 'GET_COMPLETION_FAILED'
        }
      });
    }
  }

  // Delete profile photo
  async deleteProfilePhoto(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Authentication required',
            code: 'UNAUTHORIZED'
          }
        });
      }

      await profileService.deleteProfilePhoto(req.user.userId, req.user.role);

      res.json({
        success: true,
        message: 'Profile photo deleted successfully'
      });
    } catch (error) {
      console.error('Delete profile photo error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to delete profile photo',
          code: 'DELETE_PHOTO_FAILED'
        }
      });
    }
  }

  // Change password
  async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Authentication required',
            code: 'UNAUTHORIZED'
          }
        });
      }

      const { currentPassword, newPassword } = req.body;

      await profileService.changePassword(
        req.user.userId,
        currentPassword,
        newPassword
      );

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to change password',
          code: 'CHANGE_PASSWORD_FAILED'
        }
      });
    }
  }
}

export default new ProfileController();