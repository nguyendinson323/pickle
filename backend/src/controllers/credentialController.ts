import { Response } from 'express';
import { AuthRequest } from '../types/auth';
import credentialService from '../services/credentialService';
import { CredentialType, CredentialStatus } from '../models/Credential';

// Create new credential (admin only)
const createCredential = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    
    // Check if user has admin privileges
    if (user.role !== 'admin' && user.role !== 'state') {
      res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions to create credentials' 
      });
      return;
    }

    const credentialData = {
      ...req.body,
      expirationDate: req.body.expirationDate ? new Date(req.body.expirationDate) : undefined
    };

    const credential = await credentialService.createCredential(credentialData);

    res.status(201).json({
      success: true,
      data: credential,
      message: 'Credential created successfully'
    });
  } catch (error: any) {
    console.error('Error creating credential:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to create credential' 
    });
  }
};

// Verify credential by ID
const verifyCredential = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { credentialId } = req.params;
    const verificationResult = await credentialService.verifyCredential(credentialId);

    res.json({
      success: true,
      data: verificationResult
    });
  } catch (error) {
    console.error('Error verifying credential:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to verify credential' 
    });
  }
};

// Get user credentials
const getUserCredentials = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { userId } = req.params;

    // Check if user can access these credentials
    if (user.userId !== parseInt(userId) && user.role !== 'admin' && user.role !== 'state') {
      res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
      return;
    }

    const credentials = await credentialService.getUserCredentials(parseInt(userId));

    res.json({
      success: true,
      data: credentials
    });
  } catch (error) {
    console.error('Error fetching user credentials:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch credentials' 
    });
  }
};

// Get credentials by state
const getCredentialsByState = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { stateId } = req.params;
    const { userType, status, limit = 50, offset = 0 } = req.query;

    // Check if user can access state credentials
    if (user.role !== 'admin' && (user.role !== 'state' || (user as any).stateId !== parseInt(stateId))) {
      res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
      return;
    }

    const result = await credentialService.getCredentialsByState(
      parseInt(stateId),
      userType as CredentialType,
      status as CredentialStatus,
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.json({
      success: true,
      data: result.credentials,
      pagination: {
        total: result.total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        totalPages: Math.ceil(result.total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Error fetching state credentials:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch credentials' 
    });
  }
};

// Update credential status (admin only)
const updateCredentialStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    
    // Check if user has admin privileges
    if (user.role !== 'admin' && user.role !== 'state') {
      res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
      return;
    }

    const { credentialId } = req.params;
    const { status, reason } = req.body;

    const credential = await credentialService.updateCredentialStatus(
      credentialId,
      status,
      reason
    );

    res.json({
      success: true,
      data: credential,
      message: 'Credential status updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating credential status:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to update credential status' 
    });
  }
};

// Renew credential (admin only)
const renewCredential = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    
    // Check if user has admin privileges
    if (user.role !== 'admin' && user.role !== 'state') {
      res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
      return;
    }

    const { credentialId } = req.params;
    const { extensionMonths = 12 } = req.body;

    const credential = await credentialService.renewCredential(
      credentialId,
      extensionMonths
    );

    res.json({
      success: true,
      data: credential,
      message: 'Credential renewed successfully'
    });
  } catch (error: any) {
    console.error('Error renewing credential:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to renew credential' 
    });
  }
};

// Generate PDF credential
const generatePDFCredential = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { credentialId } = req.params;

    // TODO: Add proper authorization check based on credential ownership
    
    const pdfBuffer = await credentialService.generatePDFCredential(credentialId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="credential-${credentialId}.pdf"`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Error generating PDF credential:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to generate PDF credential' 
    });
  }
};

// Generate image credential
const generateImageCredential = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { credentialId } = req.params;

    // TODO: Add proper authorization check based on credential ownership
    
    const imageBuffer = await credentialService.generateImageCredential(credentialId);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="credential-${credentialId}.png"`);
    res.send(imageBuffer);
  } catch (error: any) {
    console.error('Error generating image credential:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to generate image credential' 
    });
  }
};

// Get expiring credentials (admin only)
const getExpiringCredentials = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    
    // Check if user has admin privileges
    if (user.role !== 'admin' && user.role !== 'state') {
      res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
      return;
    }

    const { days = 30 } = req.query;
    const expiringCredentials = await credentialService.getExpiringCredentials(parseInt(days as string));

    res.json({
      success: true,
      data: expiringCredentials
    });
  } catch (error) {
    console.error('Error fetching expiring credentials:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch expiring credentials' 
    });
  }
};

// Get credential statistics
const getCredentialStatistics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { stateId } = req.query;

    // Check permissions for state-specific stats
    if (stateId && user.role !== 'admin' && (user.role !== 'state' || (user as any).stateId !== parseInt(stateId as string))) {
      res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
      return;
    }

    const stats = await credentialService.getCredentialStatistics(stateId ? parseInt(stateId as string) : undefined);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching credential statistics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch credential statistics' 
    });
  }
};

// Bulk verify credentials (for QR scanner app)
const bulkVerifyCredentials = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { credentialIds } = req.body;

    const verificationResults = await Promise.all(
      credentialIds.map(async (id: string) => {
        try {
          const result = await credentialService.verifyCredential(id);
          return { id, ...result };
        } catch (error: any) {
          return { id, valid: false, reason: error.message };
        }
      })
    );

    res.json({
      success: true,
      data: verificationResults
    });
  } catch (error) {
    console.error('Error bulk verifying credentials:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to verify credentials' 
    });
  }
};

export default {
  createCredential,
  verifyCredential,
  getUserCredentials,
  getCredentialsByState,
  updateCredentialStatus,
  renewCredential,
  generatePDFCredential,
  generateImageCredential,
  getExpiringCredentials,
  getCredentialStatistics,
  bulkVerifyCredentials
};