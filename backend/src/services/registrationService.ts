import bcrypt from 'bcryptjs';
import { Transaction, Op } from 'sequelize';
import { sequelize } from '../models';
import models from '../models';
import { UserRole } from '../types/auth';
import cloudinaryService from './cloudinaryService';
import jwtService from './jwtService';

const { User, Player, Coach, Club, Partner, StateCommittee } = models;

interface BaseRegistrationData {
  username: string;
  email: string;
  password: string;
  privacyPolicyAccepted: boolean;
}

interface PlayerRegistrationData extends BaseRegistrationData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  stateId: number;
  curp: string;
  nrtpLevel?: string;
  mobilePhone: string;
  profilePhoto?: Express.Multer.File;
  idDocument?: Express.Multer.File;
}

interface ClubRegistrationData extends BaseRegistrationData {
  name: string;
  rfc?: string;
  managerName: string;
  managerRole: string;
  contactEmail: string;
  phone: string;
  stateId: number;
  clubType: string;
  website?: string;
  socialMedia?: Record<string, string>;
  logo?: Express.Multer.File;
}

interface PartnerRegistrationData extends BaseRegistrationData {
  businessName: string;
  rfc?: string;
  contactPersonName: string;
  contactPersonTitle: string;
  email: string;
  phone: string;
  partnerType: string;
  website?: string;
  socialMedia?: Record<string, string>;
  logo?: Express.Multer.File;
}

interface StateCommitteeRegistrationData extends BaseRegistrationData {
  name: string;
  rfc?: string;
  presidentName: string;
  presidentTitle: string;
  institutionalEmail: string;
  phone: string;
  stateId: number;
  affiliateType: string;
  website?: string;
  socialMedia?: Record<string, string>;
  logo?: Express.Multer.File;
}

class RegistrationService {
  async registerPlayer(data: PlayerRegistrationData) {
    const transaction: Transaction = await sequelize.transaction();

    try {
      // Check if username or email already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { username: data.username },
            { email: data.email }
          ]
        }
      });

      if (existingUser) {
        throw new Error(existingUser.username === data.username 
          ? 'Username already exists' 
          : 'Email already registered');
      }

      // Check if CURP already exists
      const existingPlayer = await Player.findOne({
        where: { curp: data.curp }
      });

      if (existingPlayer) {
        throw new Error('CURP already registered');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 10);

      // Create user account
      const user = await User.create({
        username: data.username,
        email: data.email,
        passwordHash,
        role: 'player' as UserRole,
        isActive: true,
        emailVerified: false
      }, { transaction });

      // Upload files if provided
      let profilePhotoUrl = null;
      let idDocumentUrl = null;

      if (data.profilePhoto) {
        const photoResult = await cloudinaryService.uploadProfilePhoto(
          data.profilePhoto.buffer,
          data.profilePhoto.originalname,
          user.id
        );
        profilePhotoUrl = photoResult.secureUrl;
      }

      if (data.idDocument) {
        const docResult = await cloudinaryService.uploadIdDocument(
          data.idDocument.buffer,
          data.idDocument.originalname,
          user.id
        );
        idDocumentUrl = docResult.secureUrl;
      }

      // Generate federation ID
      const federationIdNumber = await this.generateFederationId('PLY');

      // Create player profile
      const player = await Player.create({
        userId: user.id,
        fullName: data.fullName,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        stateId: data.stateId,
        curp: data.curp,
        nrtpLevel: data.nrtpLevel,
        mobilePhone: data.mobilePhone,
        profilePhotoUrl: profilePhotoUrl || undefined,
        idDocumentUrl: idDocumentUrl || undefined,
        federationIdNumber,
        nationality: 'Mexican',
        canBeFound: true,
        isPremium: false
      }, { transaction });

      await transaction.commit();

      // Generate JWT token
      const token = jwtService.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile: player
        },
        token
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async registerCoach(data: PlayerRegistrationData) {
    const transaction: Transaction = await sequelize.transaction();

    try {
      // Check if username or email already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { username: data.username },
            { email: data.email }
          ]
        }
      });

      if (existingUser) {
        throw new Error(existingUser.username === data.username 
          ? 'Username already exists' 
          : 'Email already registered');
      }

      // Check if CURP already exists
      const existingCoach = await Coach.findOne({
        where: { curp: data.curp }
      });

      if (existingCoach) {
        throw new Error('CURP already registered');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 10);

      // Create user account
      const user = await User.create({
        username: data.username,
        email: data.email,
        passwordHash,
        role: 'coach' as UserRole,
        isActive: true,
        emailVerified: false
      }, { transaction });

      // Upload files if provided
      let profilePhotoUrl = null;
      let idDocumentUrl = null;

      if (data.profilePhoto) {
        const photoResult = await cloudinaryService.uploadProfilePhoto(
          data.profilePhoto.buffer,
          data.profilePhoto.originalname,
          user.id
        );
        profilePhotoUrl = photoResult.secureUrl;
      }

      if (data.idDocument) {
        const docResult = await cloudinaryService.uploadIdDocument(
          data.idDocument.buffer,
          data.idDocument.originalname,
          user.id
        );
        idDocumentUrl = docResult.secureUrl;
      }

      // Generate federation ID
      const federationIdNumber = await this.generateFederationId('COA');

      // Create coach profile
      const coach = await Coach.create({
        userId: user.id,
        fullName: data.fullName,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        stateId: data.stateId,
        curp: data.curp,
        nrtpLevel: data.nrtpLevel,
        mobilePhone: data.mobilePhone,
        profilePhotoUrl: profilePhotoUrl || undefined,
        idDocumentUrl: idDocumentUrl || undefined,
        federationIdNumber,
        nationality: 'Mexican'
      }, { transaction });

      await transaction.commit();

      // Generate JWT token
      const token = jwtService.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile: coach
        },
        token
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async registerClub(data: ClubRegistrationData) {
    const transaction: Transaction = await sequelize.transaction();

    try {
      // Check if username or email already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { username: data.username },
            { email: data.email }
          ]
        }
      });

      if (existingUser) {
        throw new Error(existingUser.username === data.username 
          ? 'Username already exists' 
          : 'Email already registered');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 10);

      // Create user account
      const user = await User.create({
        username: data.username,
        email: data.email,
        passwordHash,
        role: 'club' as UserRole,
        isActive: true,
        emailVerified: false
      }, { transaction });

      // Upload logo if provided
      let logoUrl = null;
      if (data.logo) {
        const logoResult = await cloudinaryService.uploadOrganizationLogo(
          data.logo.buffer,
          data.logo.originalname,
          user.id
        );
        logoUrl = logoResult.secureUrl;
      }

      // Create club profile
      const club = await Club.create({
        userId: user.id,
        name: data.name,
        rfc: data.rfc || undefined,
        managerName: data.managerName,
        managerRole: data.managerRole,
        contactEmail: data.contactEmail,
        phone: data.phone,
        stateId: data.stateId,
        clubType: data.clubType,
        website: data.website || undefined,
        socialMedia: data.socialMedia || undefined,
        logoUrl: logoUrl || undefined,
        hasCourts: false,
        planType: 'basic'
      }, { transaction });

      await transaction.commit();

      // Generate JWT token
      const token = jwtService.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile: club
        },
        token
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async registerPartner(data: PartnerRegistrationData) {
    const transaction: Transaction = await sequelize.transaction();

    try {
      // Check if username or email already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { username: data.username },
            { email: data.email }
          ]
        }
      });

      if (existingUser) {
        throw new Error(existingUser.username === data.username 
          ? 'Username already exists' 
          : 'Email already registered');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 10);

      // Create user account
      const user = await User.create({
        username: data.username,
        email: data.email,
        passwordHash,
        role: 'partner' as UserRole,
        isActive: true,
        emailVerified: false
      }, { transaction });

      // Upload logo if provided
      let logoUrl = null;
      if (data.logo) {
        const logoResult = await cloudinaryService.uploadOrganizationLogo(
          data.logo.buffer,
          data.logo.originalname,
          user.id
        );
        logoUrl = logoResult.secureUrl;
      }

      // Create partner profile
      const partner = await Partner.create({
        userId: user.id,
        businessName: data.businessName,
        rfc: data.rfc || undefined,
        contactPersonName: data.contactPersonName,
        contactPersonTitle: data.contactPersonTitle,
        email: data.email,
        phone: data.phone,
        partnerType: data.partnerType,
        website: data.website || undefined,
        socialMedia: data.socialMedia || undefined,
        logoUrl: logoUrl || undefined,
        planType: 'premium'
      }, { transaction });

      await transaction.commit();

      // Generate JWT token
      const token = jwtService.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile: partner
        },
        token
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async registerStateCommittee(data: StateCommitteeRegistrationData) {
    const transaction: Transaction = await sequelize.transaction();

    try {
      // Check if username or email already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { username: data.username },
            { email: data.email }
          ]
        }
      });

      if (existingUser) {
        throw new Error(existingUser.username === data.username 
          ? 'Username already exists' 
          : 'Email already registered');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 10);

      // Create user account
      const user = await User.create({
        username: data.username,
        email: data.email,
        passwordHash,
        role: 'state' as UserRole,
        isActive: true,
        emailVerified: false
      }, { transaction });

      // Upload logo if provided
      let logoUrl = null;
      if (data.logo) {
        const logoResult = await cloudinaryService.uploadOrganizationLogo(
          data.logo.buffer,
          data.logo.originalname,
          user.id
        );
        logoUrl = logoResult.secureUrl;
      }

      // Create state committee profile
      const stateCommittee = await StateCommittee.create({
        userId: user.id,
        name: data.name,
        rfc: data.rfc || undefined,
        presidentName: data.presidentName,
        presidentTitle: data.presidentTitle,
        institutionalEmail: data.institutionalEmail,
        phone: data.phone,
        stateId: data.stateId,
        affiliateType: data.affiliateType,
        website: data.website || undefined,
        socialMedia: data.socialMedia || undefined,
        logoUrl: logoUrl || undefined
      }, { transaction });

      await transaction.commit();

      // Generate JWT token
      const token = jwtService.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile: stateCommittee
        },
        token
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private async generateFederationId(prefix: string): Promise<string> {
    const count = await Player.count() + await Coach.count() + 1;
    return `${prefix}-${String(count).padStart(6, '0')}`;
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const user = await User.findOne({
      where: { username }
    });
    return !user;
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    const user = await User.findOne({
      where: { email }
    });
    return !user;
  }

  async checkCurpAvailability(curp: string): Promise<boolean> {
    const player = await Player.findOne({
      where: { curp }
    });
    const coach = await Coach.findOne({
      where: { curp }
    });
    return !player && !coach;
  }
}

export default new RegistrationService();