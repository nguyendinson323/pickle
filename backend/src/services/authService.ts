import bcrypt from 'bcryptjs';
import User from '../models/User';
import Player from '../models/Player';
import Coach from '../models/Coach';
import Club from '../models/Club';
import Partner from '../models/Partner';
import StateCommittee from '../models/StateCommittee';
import State from '../models/State';
import jwtService from './jwtService';
import { LoginRequest, LoginResponse, UserProfile, UserRole } from '../types/auth';

class AuthService {
  async login(loginData: LoginRequest): Promise<LoginResponse | null> {
    try {
      const { email, password } = loginData;

      // Find user by email
      const user = await User.findOne({
        where: { email, isActive: true },
        include: [
          { model: Player, as: 'playerProfile', include: [{ model: State, as: 'state' }] },
          { model: Coach, as: 'coachProfile', include: [{ model: State, as: 'state' }] },
          { model: Club, as: 'clubProfile', include: [{ model: State, as: 'state' }] },
          { model: Partner, as: 'partnerProfile' },
          { model: StateCommittee, as: 'stateCommitteeProfile', include: [{ model: State, as: 'state' }] }
        ]
      });

      if (!user) {
        return null;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return null;
      }

      // Update last login
      await user.update({ lastLogin: new Date() });

      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role as UserRole
      };

      const refreshTokenPayload = {
        userId: user.id,
        tokenVersion: 1 // This can be incremented to invalidate tokens
      };

      const accessToken = jwtService.generateAccessToken(tokenPayload);
      const refreshToken = jwtService.generateRefreshToken(refreshTokenPayload);

      // Create user profile
      const userProfile = await this.createUserProfile(user);

      return {
        success: true,
        user: userProfile,
        token: accessToken,
        refreshToken: refreshToken
      };
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  async getCurrentUser(userId: number): Promise<UserProfile | null> {
    try {
      const user = await User.findByPk(userId, {
        include: [
          { model: Player, as: 'playerProfile', include: [{ model: State, as: 'state' }] },
          { model: Coach, as: 'coachProfile', include: [{ model: State, as: 'state' }] },
          { model: Club, as: 'clubProfile', include: [{ model: State, as: 'state' }] },
          { model: Partner, as: 'partnerProfile' },
          { model: StateCommittee, as: 'stateCommitteeProfile', include: [{ model: State, as: 'state' }] }
        ]
      });

      if (!user || !user.isActive) {
        return null;
      }

      return await this.createUserProfile(user);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<{ token: string; refreshToken: string } | null> {
    try {
      const payload = jwtService.verifyRefreshToken(refreshToken);
      if (!payload) {
        return null;
      }

      const user = await User.findByPk(payload.userId);
      if (!user || !user.isActive) {
        return null;
      }

      // Generate new tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role as UserRole
      };

      const newRefreshTokenPayload = {
        userId: user.id,
        tokenVersion: payload.tokenVersion
      };

      const newAccessToken = jwtService.generateAccessToken(tokenPayload);
      const newRefreshToken = jwtService.generateRefreshToken(newRefreshTokenPayload);

      return {
        token: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return null;
    }
  }

  private async createUserProfile(user: any): Promise<UserProfile> {
    let profile = null;

    switch (user.role) {
      case 'player':
        if (user.playerProfile) {
          profile = {
            id: user.playerProfile.id,
            userId: user.id,
            fullName: user.playerProfile.fullName,
            dateOfBirth: user.playerProfile.dateOfBirth,
            gender: user.playerProfile.gender,
            stateId: user.playerProfile.stateId,
            curp: user.playerProfile.curp,
            nrtpLevel: user.playerProfile.nrtpLevel,
            mobilePhone: user.playerProfile.mobilePhone,
            profilePhotoUrl: user.playerProfile.profilePhotoUrl,
            idDocumentUrl: user.playerProfile.idDocumentUrl,
            nationality: user.playerProfile.nationality,
            canBeFound: user.playerProfile.canBeFound,
            isPremium: user.playerProfile.isPremium,
            rankingPosition: user.playerProfile.rankingPosition,
            federationIdNumber: user.playerProfile.federationIdNumber
          };
        }
        break;

      case 'coach':
        if (user.coachProfile) {
          profile = {
            id: user.coachProfile.id,
            userId: user.id,
            fullName: user.coachProfile.fullName,
            dateOfBirth: user.coachProfile.dateOfBirth,
            gender: user.coachProfile.gender,
            stateId: user.coachProfile.stateId,
            curp: user.coachProfile.curp,
            nrtpLevel: user.coachProfile.nrtpLevel,
            mobilePhone: user.coachProfile.mobilePhone,
            profilePhotoUrl: user.coachProfile.profilePhotoUrl,
            idDocumentUrl: user.coachProfile.idDocumentUrl,
            nationality: user.coachProfile.nationality,
            licenseType: user.coachProfile.licenseType,
            rankingPosition: user.coachProfile.rankingPosition,
            federationIdNumber: user.coachProfile.federationIdNumber
          };
        }
        break;

      case 'club':
        if (user.clubProfile) {
          profile = {
            id: user.clubProfile.id,
            userId: user.id,
            name: user.clubProfile.name,
            rfc: user.clubProfile.rfc,
            managerName: user.clubProfile.managerName,
            managerRole: user.clubProfile.managerRole,
            contactEmail: user.clubProfile.contactEmail,
            phone: user.clubProfile.phone,
            stateId: user.clubProfile.stateId,
            clubType: user.clubProfile.clubType,
            website: user.clubProfile.website,
            socialMedia: user.clubProfile.socialMedia,
            logoUrl: user.clubProfile.logoUrl,
            hasCourts: user.clubProfile.hasCourts,
            planType: user.clubProfile.planType
          };
        }
        break;

      case 'partner':
        if (user.partnerProfile) {
          profile = {
            id: user.partnerProfile.id,
            userId: user.id,
            businessName: user.partnerProfile.businessName,
            rfc: user.partnerProfile.rfc,
            contactPersonName: user.partnerProfile.contactPersonName,
            contactPersonTitle: user.partnerProfile.contactPersonTitle,
            email: user.partnerProfile.email,
            phone: user.partnerProfile.phone,
            partnerType: user.partnerProfile.partnerType,
            website: user.partnerProfile.website,
            socialMedia: user.partnerProfile.socialMedia,
            logoUrl: user.partnerProfile.logoUrl,
            planType: user.partnerProfile.planType
          };
        }
        break;

      case 'state':
        if (user.stateCommitteeProfile) {
          profile = {
            id: user.stateCommitteeProfile.id,
            userId: user.id,
            name: user.stateCommitteeProfile.name,
            rfc: user.stateCommitteeProfile.rfc,
            presidentName: user.stateCommitteeProfile.presidentName,
            presidentTitle: user.stateCommitteeProfile.presidentTitle,
            institutionalEmail: user.stateCommitteeProfile.institutionalEmail,
            phone: user.stateCommitteeProfile.phone,
            stateId: user.stateCommitteeProfile.stateId,
            affiliateType: user.stateCommitteeProfile.affiliateType,
            website: user.stateCommitteeProfile.website,
            socialMedia: user.stateCommitteeProfile.socialMedia,
            logoUrl: user.stateCommitteeProfile.logoUrl
          };
        }
        break;
    }

    return {
      id: user.id,
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role as UserRole,
      isActive: user.isActive,
      profile: profile
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }
}

export default new AuthService();