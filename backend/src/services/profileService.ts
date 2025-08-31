import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import models from '../models';
import { UserRole } from '../types/auth';
import cloudinaryService from './cloudinaryService';

const { User, Player, Coach, Club, Partner, StateCommittee, State } = models;

interface ProfileUpdateData {
  [key: string]: any;
}

interface ProfileCompletion {
  percentage: number;
  completedFields: string[];
  missingFields: string[];
  requiredFields: string[];
}

class ProfileService {
  // Get profile by user ID based on role
  async getProfileByUserId(userId: number) {
    try {
      const user = await User.findByPk(userId, {
        attributes: ['id', 'username', 'email', 'role', 'isActive', 'emailVerified', 'createdAt']
      });

      if (!user) {
        throw new Error('User not found');
      }

      let profile = null;
      const includeState = { 
        model: State, 
        as: 'State', 
        attributes: ['id', 'name', 'code'] 
      };

      switch (user.role) {
        case 'player':
          profile = await Player.findOne({
            where: { userId },
            include: [includeState]
          });
          break;
        case 'coach':
          profile = await Coach.findOne({
            where: { userId },
            include: [includeState]
          });
          break;
        case 'club':
          profile = await Club.findOne({
            where: { userId },
            include: [includeState]
          });
          break;
        case 'partner':
          profile = await Partner.findOne({
            where: { userId }
          });
          break;
        case 'state':
          profile = await StateCommittee.findOne({
            where: { userId },
            include: [includeState]
          });
          break;
      }

      return {
        user,
        profile,
        role: user.role
      };
    } catch (error) {
      throw new Error(`Failed to get profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Update profile information
  async updateProfile(userId: number, role: UserRole, updateData: ProfileUpdateData) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      let updatedProfile = null;

      // Extract user table fields
      const userFields = ['email', 'username'];
      const userUpdateData: any = {};
      const profileUpdateData: any = {};

      // Separate user fields from profile fields
      Object.keys(updateData).forEach(key => {
        if (userFields.includes(key)) {
          userUpdateData[key] = updateData[key];
        } else {
          profileUpdateData[key] = updateData[key];
        }
      });

      // Update user table if needed
      if (Object.keys(userUpdateData).length > 0) {
        // Check for email/username uniqueness
        if (userUpdateData.email || userUpdateData.username) {
          const whereClause: any = {
            id: { [Op.ne]: userId }
          };
          
          if (userUpdateData.email && userUpdateData.username) {
            whereClause[Op.or] = [
              { email: userUpdateData.email },
              { username: userUpdateData.username }
            ];
          } else if (userUpdateData.email) {
            whereClause.email = userUpdateData.email;
          } else if (userUpdateData.username) {
            whereClause.username = userUpdateData.username;
          }

          const existingUser = await User.findOne({ where: whereClause });
          if (existingUser) {
            throw new Error(
              existingUser.email === userUpdateData.email 
                ? 'Email already exists'
                : 'Username already exists'
            );
          }
        }

        await user.update(userUpdateData);
      }

      // Update profile table based on role
      switch (role) {
        case 'player':
          const player = await Player.findOne({ where: { userId } });
          if (player && Object.keys(profileUpdateData).length > 0) {
            updatedProfile = await player.update(profileUpdateData);
          }
          break;
        case 'coach':
          const coach = await Coach.findOne({ where: { userId } });
          if (coach && Object.keys(profileUpdateData).length > 0) {
            updatedProfile = await coach.update(profileUpdateData);
          }
          break;
        case 'club':
          const club = await Club.findOne({ where: { userId } });
          if (club && Object.keys(profileUpdateData).length > 0) {
            updatedProfile = await club.update(profileUpdateData);
          }
          break;
        case 'partner':
          const partner = await Partner.findOne({ where: { userId } });
          if (partner && Object.keys(profileUpdateData).length > 0) {
            updatedProfile = await partner.update(profileUpdateData);
          }
          break;
        case 'state':
          const stateCommittee = await StateCommittee.findOne({ where: { userId } });
          if (stateCommittee && Object.keys(profileUpdateData).length > 0) {
            updatedProfile = await stateCommittee.update(profileUpdateData);
          }
          break;
      }

      return await this.getProfileByUserId(userId);
    } catch (error) {
      throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Update profile photo
  async updateProfilePhoto(userId: number, role: UserRole, file: Express.Multer.File) {
    try {
      // Upload new photo to Cloudinary
      const uploadResult = await cloudinaryService.uploadProfilePhoto(
        file.buffer,
        file.originalname,
        userId
      );

      // Get current profile to delete old photo if exists
      const currentProfile = await this.getProfileByUserId(userId);
      let oldPhotoUrl = null;

      // Update profile with new photo URL
      switch (role) {
        case 'player':
          const player = await Player.findOne({ where: { userId } });
          if (player) {
            oldPhotoUrl = player.profilePhotoUrl;
            await player.update({ profilePhotoUrl: uploadResult.secureUrl });
          }
          break;
        case 'coach':
          const coach = await Coach.findOne({ where: { userId } });
          if (coach) {
            oldPhotoUrl = coach.profilePhotoUrl;
            await coach.update({ profilePhotoUrl: uploadResult.secureUrl });
          }
          break;
      }

      // Delete old photo from Cloudinary if it exists
      if (oldPhotoUrl) {
        try {
          // Extract public ID from URL
          const publicId = this.extractPublicIdFromUrl(oldPhotoUrl);
          if (publicId) {
            await cloudinaryService.deleteFromCloudinary(publicId);
          }
        } catch (deleteError) {
          console.warn('Failed to delete old photo:', deleteError);
        }
      }

      return {
        photoUrl: uploadResult.secureUrl,
        publicId: uploadResult.publicId
      };
    } catch (error) {
      throw new Error(`Failed to update profile photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Update ID document
  async updateIdDocument(userId: number, role: UserRole, file: Express.Multer.File) {
    try {
      // Upload document to Cloudinary
      const uploadResult = await cloudinaryService.uploadIdDocument(
        file.buffer,
        file.originalname,
        userId
      );

      // Get current profile to delete old document if exists
      let oldDocumentUrl = null;

      // Update profile with new document URL
      switch (role) {
        case 'player':
          const player = await Player.findOne({ where: { userId } });
          if (player) {
            oldDocumentUrl = player.idDocumentUrl;
            await player.update({ idDocumentUrl: uploadResult.secureUrl });
          }
          break;
        case 'coach':
          const coach = await Coach.findOne({ where: { userId } });
          if (coach) {
            oldDocumentUrl = coach.idDocumentUrl;
            await coach.update({ idDocumentUrl: uploadResult.secureUrl });
          }
          break;
      }

      // Delete old document from Cloudinary if it exists
      if (oldDocumentUrl) {
        try {
          const publicId = this.extractPublicIdFromUrl(oldDocumentUrl);
          if (publicId) {
            await cloudinaryService.deleteFromCloudinary(publicId);
          }
        } catch (deleteError) {
          console.warn('Failed to delete old document:', deleteError);
        }
      }

      return {
        documentUrl: uploadResult.secureUrl,
        publicId: uploadResult.publicId
      };
    } catch (error) {
      throw new Error(`Failed to update ID document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Update organization logo
  async updateLogo(userId: number, role: UserRole, file: Express.Multer.File) {
    try {
      // Upload logo to Cloudinary
      const uploadResult = await cloudinaryService.uploadOrganizationLogo(
        file.buffer,
        file.originalname,
        userId
      );

      // Get current profile to delete old logo if exists
      let oldLogoUrl = null;

      // Update profile with new logo URL
      switch (role) {
        case 'club':
          const club = await Club.findOne({ where: { userId } });
          if (club) {
            oldLogoUrl = club.logoUrl;
            await club.update({ logoUrl: uploadResult.secureUrl });
          }
          break;
        case 'partner':
          const partner = await Partner.findOne({ where: { userId } });
          if (partner) {
            oldLogoUrl = partner.logoUrl;
            await partner.update({ logoUrl: uploadResult.secureUrl });
          }
          break;
        case 'state':
          const stateCommittee = await StateCommittee.findOne({ where: { userId } });
          if (stateCommittee) {
            oldLogoUrl = stateCommittee.logoUrl;
            await stateCommittee.update({ logoUrl: uploadResult.secureUrl });
          }
          break;
      }

      // Delete old logo from Cloudinary if it exists
      if (oldLogoUrl) {
        try {
          const publicId = this.extractPublicIdFromUrl(oldLogoUrl);
          if (publicId) {
            await cloudinaryService.deleteFromCloudinary(publicId);
          }
        } catch (deleteError) {
          console.warn('Failed to delete old logo:', deleteError);
        }
      }

      return {
        logoUrl: uploadResult.secureUrl,
        publicId: uploadResult.publicId
      };
    } catch (error) {
      throw new Error(`Failed to update logo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get profile completion status
  async getProfileCompletion(userId: number, role: UserRole): Promise<ProfileCompletion> {
    try {
      const profile = await this.getProfileByUserId(userId);
      
      if (!profile.profile) {
        return {
          percentage: 0,
          completedFields: [],
          missingFields: [],
          requiredFields: []
        };
      }

      let requiredFields: string[] = [];
      let completedFields: string[] = [];

      // Define required fields based on role
      switch (role) {
        case 'player':
        case 'coach':
          requiredFields = [
            'fullName', 'dateOfBirth', 'gender', 'stateId', 
            'curp', 'mobilePhone', 'profilePhotoUrl', 'idDocumentUrl'
          ];
          break;
        case 'club':
          requiredFields = [
            'name', 'managerName', 'managerRole', 'contactEmail', 
            'phone', 'stateId', 'clubType'
          ];
          break;
        case 'partner':
          requiredFields = [
            'businessName', 'contactPersonName', 'contactPersonTitle', 
            'email', 'phone', 'partnerType'
          ];
          break;
        case 'state':
          requiredFields = [
            'name', 'presidentName', 'presidentTitle', 
            'institutionalEmail', 'phone', 'stateId', 'affiliateType'
          ];
          break;
      }

      // Check which fields are completed
      const profileData = profile.profile.toJSON();
      requiredFields.forEach(field => {
        if (profileData[field] && profileData[field] !== null && profileData[field] !== '') {
          completedFields.push(field);
        }
      });

      const missingFields = requiredFields.filter(field => !completedFields.includes(field));
      const percentage = Math.round((completedFields.length / requiredFields.length) * 100);

      return {
        percentage,
        completedFields,
        missingFields,
        requiredFields
      };
    } catch (error) {
      throw new Error(`Failed to get profile completion: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Delete profile photo
  async deleteProfilePhoto(userId: number, role: UserRole) {
    try {
      let photoUrl = null;

      // Get current photo URL and remove it
      switch (role) {
        case 'player':
          const player = await Player.findOne({ where: { userId } });
          if (player && player.profilePhotoUrl) {
            photoUrl = player.profilePhotoUrl;
            await player.update({ profilePhotoUrl: null });
          }
          break;
        case 'coach':
          const coach = await Coach.findOne({ where: { userId } });
          if (coach && coach.profilePhotoUrl) {
            photoUrl = coach.profilePhotoUrl;
            await coach.update({ profilePhotoUrl: null });
          }
          break;
      }

      // Delete from Cloudinary
      if (photoUrl) {
        const publicId = this.extractPublicIdFromUrl(photoUrl);
        if (publicId) {
          await cloudinaryService.deleteFromCloudinary(publicId);
        }
      }
    } catch (error) {
      throw new Error(`Failed to delete profile photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Change password
  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      // Update password
      await user.update({ passwordHash: newPasswordHash });
    } catch (error) {
      throw new Error(`Failed to change password: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper method to extract public ID from Cloudinary URL
  private extractPublicIdFromUrl(url: string): string | null {
    try {
      const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|pdf)$/);
      return matches ? matches[1] : null;
    } catch (error) {
      return null;
    }
  }
}

export default new ProfileService();