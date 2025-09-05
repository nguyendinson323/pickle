import { Op } from 'sequelize';
import { 
  Credential,
  User,
  Player,
  State
} from '../models';
import { 
  CredentialStatus, 
  CredentialType,
  AffiliationStatus 
} from '../models/Credential';
import QRCode from 'qrcode';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';
import sequelize from '../config/database';

interface CredentialData {
  userId: number;
  userType: CredentialType;
  fullName: string;
  stateId: number;
  stateName: string;
  nrtpLevel?: string;
  rankingPosition?: number;
  clubName?: string;
  licenseType?: string;
  federationIdNumber: string;
  nationality?: string;
  photo?: string;
  expirationDate: Date;
  metadata?: Record<string, any>;
}

class CredentialService {
  private readonly FEDERATION_NAME = 'FEDERACIÓN MEXICANA DE PICKLEBALL';
  private readonly BASE_VERIFICATION_URL = process.env.CREDENTIAL_VERIFICATION_URL || 'https://fmp.mx/verify';
  private readonly CREDENTIAL_VALID_MONTHS = 12; // Credentials valid for 12 months

  // Generate unique admin ID number
  private generateFederationId(userType: CredentialType, stateId: number): string {
    const typePrefix = {
      [CredentialType.PLAYER]: 'JUG',
      [CredentialType.COACH]: 'ENT',
      [CredentialType.REFEREE]: 'ARB',
      [CredentialType.CLUB_ADMIN]: 'ADM'
    };

    const year = new Date().getFullYear().toString().slice(-2);
    const stateCode = stateId.toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    
    return `${typePrefix[userType]}-${year}${stateCode}-${random}`;
  }

  // Generate verification checksum
  private generateChecksum(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Generate QR code data
  private async generateQRCode(credentialId: string, verificationUrl: string): Promise<string> {
    const qrData = {
      id: credentialId,
      url: verificationUrl,
      timestamp: Date.now()
    };
    
    return await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'M',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  }

  // Create new credential
  async createCredential(credentialData: CredentialData): Promise<Credential> {
    try {
      // Generate unique credential ID
      const credentialId = crypto.randomUUID();

      // Get state information
      const state = await State.findByPk(credentialData.stateId);
      if (!state) {
        throw new Error('State not found');
      }

      // Generate admin ID number
      const federationIdNumber = this.generateFederationId(credentialData.userType, credentialData.stateId);

      // Set expiration date
      const expirationDate = credentialData.expirationDate || new Date();
      if (!credentialData.expirationDate) {
        expirationDate.setMonth(expirationDate.getMonth() + this.CREDENTIAL_VALID_MONTHS);
      }

      // Generate verification URL
      const verificationUrl = `${this.BASE_VERIFICATION_URL}/${credentialId}`;

      // Generate QR code
      const qrCode = await this.generateQRCode(credentialId, verificationUrl);

      // Create checksum data
      const checksumData = `${credentialId}${credentialData.userId}${federationIdNumber}${credentialData.fullName}${expirationDate.toISOString()}`;
      const checksum = this.generateChecksum(checksumData);

      // Create credential
      const credential = await Credential.create({
        id: credentialId,
        userId: credentialData.userId,
        userType: credentialData.userType,
        federationName: this.FEDERATION_NAME,
        stateName: state.name,
        stateId: credentialData.stateId,
        fullName: credentialData.fullName,
        nrtpLevel: credentialData.nrtpLevel,
        affiliationStatus: AffiliationStatus.ACTIVE,
        rankingPosition: credentialData.rankingPosition,
        clubName: credentialData.clubName,
        licenseType: credentialData.licenseType,
        qrCode,
        federationIdNumber,
        nationality: credentialData.nationality || '🇲🇽 México',
        photo: credentialData.photo,
        issuedDate: new Date(),
        expirationDate,
        status: CredentialStatus.ACTIVE,
        verificationUrl,
        checksum,
        verificationCount: 0,
        metadata: credentialData.metadata || {}
      });

      return credential;

    } catch (error) {
      throw new Error(`Failed to create credential: ${error.message}`);
    }
  }

  // Verify credential by ID
  async verifyCredential(credentialId: string): Promise<{ valid: boolean; credential?: Credential; reason?: string }> {
    try {
      const credential = await Credential.findByPk(credentialId, {
        include: [
          { model: User },
          { model: State }
        ]
      });

      if (!credential) {
        return { valid: false, reason: 'Credential not found' };
      }

      // Check if credential is active
      if (credential.status !== CredentialStatus.ACTIVE) {
        return { valid: false, reason: `Credential status: ${credential.status}`, credential };
      }

      // Check expiration
      if (new Date() > credential.expirationDate) {
        // Update status to expired
        await credential.update({ status: CredentialStatus.EXPIRED });
        return { valid: false, reason: 'Credential expired', credential };
      }

      // Verify checksum
      const checksumData = `${credential.id}${credential.userId}${credential.federationIdNumber}${credential.fullName}${credential.expirationDate.toISOString()}`;
      const expectedChecksum = this.generateChecksum(checksumData);
      
      if (credential.checksum !== expectedChecksum) {
        return { valid: false, reason: 'Credential integrity check failed', credential };
      }

      // Update verification count and last verified
      await credential.update({
        verificationCount: credential.verificationCount + 1,
        lastVerified: new Date()
      });

      return { valid: true, credential };

    } catch (error) {
      return { valid: false, reason: `Verification error: ${error.message}` };
    }
  }

  // Update credential status
  async updateCredentialStatus(credentialId: string, status: CredentialStatus, reason?: string): Promise<Credential> {
    const credential = await Credential.findByPk(credentialId);
    
    if (!credential) {
      throw new Error('Credential not found');
    }

    await credential.update({
      status,
      metadata: {
        ...credential.metadata,
        statusHistory: [
          ...(credential.metadata.statusHistory || []),
          {
            oldStatus: credential.status,
            newStatus: status,
            changedAt: new Date(),
            reason: reason || 'Status updated'
          }
        ]
      }
    });

    return credential;
  }

  // Renew credential
  async renewCredential(credentialId: string, extensionMonths: number = 12): Promise<Credential> {
    const credential = await Credential.findByPk(credentialId);
    
    if (!credential) {
      throw new Error('Credential not found');
    }

    const newExpirationDate = new Date(credential.expirationDate);
    newExpirationDate.setMonth(newExpirationDate.getMonth() + extensionMonths);

    // Update checksum with new expiration date
    const checksumData = `${credential.id}${credential.userId}${credential.federationIdNumber}${credential.fullName}${newExpirationDate.toISOString()}`;
    const newChecksum = this.generateChecksum(checksumData);

    await credential.update({
      expirationDate: newExpirationDate,
      checksum: newChecksum,
      status: CredentialStatus.ACTIVE,
      metadata: {
        ...credential.metadata,
        renewalHistory: [
          ...(credential.metadata.renewalHistory || []),
          {
            renewedAt: new Date(),
            previousExpiration: credential.expirationDate,
            newExpiration: newExpirationDate,
            extensionMonths
          }
        ]
      }
    });

    return credential;
  }

  // Generate PDF credential
  async generatePDFCredential(credentialId: string): Promise<Buffer> {
    const credential = await Credential.findByPk(credentialId, {
      include: [{ model: User }, { model: State }]
    });

    if (!credential) {
      throw new Error('Credential not found');
    }

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: [400, 600], margin: 20 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        // Header
        doc.fontSize(14).font('Helvetica-Bold')
           .text(credential.federationName, { align: 'center' });
        
        doc.fontSize(10).font('Helvetica')
           .text(`Estado: ${credential.stateName}`, { align: 'center' });

        doc.moveDown(1);

        // Credential type
        doc.fontSize(12).font('Helvetica-Bold')
           .text(`CREDENCIAL DE ${credential.userType.toUpperCase()}`, { align: 'center' });

        doc.moveDown(1);

        // Photo placeholder (if photo exists, you would need to load and insert it here)
        const photoY = doc.y;
        doc.rect(20, photoY, 80, 100).stroke();
        doc.fontSize(8).text('FOTO', 30, photoY + 45, { width: 60, align: 'center' });

        // Personal information
        doc.fontSize(10).font('Helvetica-Bold')
           .text('NOMBRE COMPLETO:', 120, photoY)
           .font('Helvetica')
           .text(credential.fullName, 120, photoY + 15);

        doc.font('Helvetica-Bold')
           .text('ID FEDERACIÓN:', 120, photoY + 35)
           .font('Helvetica')
           .text(credential.federationIdNumber, 120, photoY + 50);

        if (credential.nrtpLevel) {
          doc.font('Helvetica-Bold')
             .text('NIVEL NRTP:', 120, photoY + 70)
             .font('Helvetica')
             .text(credential.nrtpLevel, 120, photoY + 85);
        }

        if (credential.clubName) {
          doc.font('Helvetica-Bold')
             .text('CLUB:', 120, photoY + 105)
             .font('Helvetica')
             .text(credential.clubName, 120, photoY + 120);
        }

        doc.moveDown(8);

        // Dates
        doc.fontSize(9).font('Helvetica-Bold')
           .text('FECHA DE EMISIÓN:', 20, doc.y)
           .font('Helvetica')
           .text(credential.issuedDate.toLocaleDateString('es-MX'), 120, doc.y);

        doc.moveUp().font('Helvetica-Bold')
           .text('VÁLIDA HASTA:', 200, doc.y)
           .font('Helvetica')
           .text(credential.expirationDate.toLocaleDateString('es-MX'), 280, doc.y);

        doc.moveDown(1);

        // Status
        doc.fontSize(9).font('Helvetica-Bold')
           .text('ESTATUS:', 20, doc.y)
           .font('Helvetica')
           .text(credential.affiliationStatus, 80, doc.y);

        doc.moveDown(2);

        // QR Code placeholder (you would need to decode the base64 QR and insert it)
        const qrY = doc.y;
        doc.rect(150, qrY, 100, 100).stroke();
        doc.fontSize(8).text('CÓDIGO QR', 170, qrY + 45, { width: 60, align: 'center' });

        // Footer
        doc.fontSize(7).font('Helvetica')
           .text(`Verificar en: ${credential.verificationUrl}`, 20, qrY + 120, { align: 'center' })
           .text(`ID: ${credential.id}`, 20, qrY + 135, { align: 'center' });

        doc.end();

      } catch (error) {
        reject(error);
      }
    });
  }

  // Generate image credential (PNG format)
  async generateImageCredential(credentialId: string): Promise<Buffer> {
    const credential = await Credential.findByPk(credentialId, {
      include: [{ model: User }, { model: State }]
    });

    if (!credential) {
      throw new Error('Credential not found');
    }

    const canvas = createCanvas(400, 600);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 400, 600);

    // Border
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 380, 580);

    // Header
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(15, 15, 370, 60);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(credential.federationName, 200, 35);
    
    ctx.font = '10px Arial';
    ctx.fillText(`Estado: ${credential.stateName}`, 200, 55);

    // Credential type
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(`CREDENCIAL DE ${credential.userType.toUpperCase()}`, 200, 105);

    // Photo placeholder
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 130, 80, 100);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = '8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('FOTO', 70, 185);

    // Personal information
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('NOMBRE COMPLETO:', 130, 145);
    
    ctx.font = '10px Arial';
    ctx.fillText(credential.fullName, 130, 160);

    ctx.font = 'bold 10px Arial';
    ctx.fillText('ID FEDERACIÓN:', 130, 180);
    
    ctx.font = '10px Arial';
    ctx.fillText(credential.federationIdNumber, 130, 195);

    if (credential.nrtpLevel) {
      ctx.font = 'bold 10px Arial';
      ctx.fillText('NIVEL NRTP:', 130, 215);
      
      ctx.font = '10px Arial';
      ctx.fillText(credential.nrtpLevel, 130, 230);
    }

    if (credential.clubName) {
      ctx.font = 'bold 10px Arial';
      ctx.fillText('CLUB:', 130, 250);
      
      ctx.font = '10px Arial';
      ctx.fillText(credential.clubName, 130, 265);
    }

    // Dates
    ctx.font = 'bold 9px Arial';
    ctx.fillText('FECHA DE EMISIÓN:', 30, 320);
    
    ctx.font = '9px Arial';
    ctx.fillText(credential.issuedDate.toLocaleDateString('es-MX'), 150, 320);

    ctx.font = 'bold 9px Arial';
    ctx.fillText('VÁLIDA HASTA:', 250, 320);
    
    ctx.font = '9px Arial';
    ctx.fillText(credential.expirationDate.toLocaleDateString('es-MX'), 330, 320);

    // Status
    ctx.font = 'bold 9px Arial';
    ctx.fillText('ESTATUS:', 30, 350);
    
    ctx.font = '9px Arial';
    ctx.fillText(credential.affiliationStatus, 90, 350);

    // QR Code placeholder
    ctx.strokeStyle = '#6b7280';
    ctx.strokeRect(150, 380, 100, 100);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = '8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CÓDIGO QR', 200, 435);

    // Footer
    ctx.fillStyle = '#4b5563';
    ctx.font = '7px Arial';
    ctx.fillText(`Verificar en: ${credential.verificationUrl}`, 200, 520);
    ctx.fillText(`ID: ${credential.id}`, 200, 535);

    return canvas.toBuffer('image/png');
  }

  // Get user credentials
  async getUserCredentials(userId: number): Promise<Credential[]> {
    return await Credential.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: [{ model: State }]
    });
  }

  // Get credentials by state
  async getCredentialsByState(
    stateId: number, 
    userType?: CredentialType, 
    status?: CredentialStatus,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ credentials: Credential[], total: number }> {
    const where: any = { stateId };
    
    if (userType) where.userType = userType;
    if (status) where.status = status;

    const { count, rows } = await Credential.findAndCountAll({
      where,
      include: [{ model: User }, { model: State }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return { credentials: rows, total: count };
  }

  // Get expiring credentials
  async getExpiringCredentials(daysFromNow: number = 30): Promise<Credential[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysFromNow);

    return await Credential.findAll({
      where: {
        expirationDate: {
          [Op.lte]: futureDate
        },
        status: CredentialStatus.ACTIVE
      },
      include: [{ model: User }, { model: State }],
      order: [['expirationDate', 'ASC']]
    });
  }

  // Get credential statistics
  async getCredentialStatistics(stateId?: number): Promise<any> {
    const where: any = {};
    if (stateId) where.stateId = stateId;

    const totalCredentials = await Credential.count({ where });
    
    const credentialsByStatus = await Credential.findAll({
      where,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const credentialsByType = await Credential.findAll({
      where,
      attributes: [
        'userType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['userType'],
      raw: true
    });

    const expiringCount = await this.getExpiringCredentials().then(creds => creds.length);

    return {
      total: totalCredentials,
      byStatus: credentialsByStatus,
      byType: credentialsByType,
      expiringSoon: expiringCount
    };
  }
}

export default new CredentialService();