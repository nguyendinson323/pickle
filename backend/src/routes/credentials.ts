import express from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth';
import credentialService from '../services/credentialService';
import { CredentialType, CredentialStatus } from '../models/Credential';

const router = express.Router();

// Validation middleware
const validateRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create new credential (admin only)
router.post('/create',
  authenticate,
  [
    body('userId').isInt().withMessage('User ID is required and must be an integer'),
    body('userType').isIn(Object.values(CredentialType)).withMessage('Invalid credential type'),
    body('fullName').isString().isLength({ min: 2, max: 200 }).withMessage('Full name is required (2-200 characters)'),
    body('stateId').isInt().withMessage('State ID is required and must be an integer'),
    body('stateName').isString().isLength({ min: 2, max: 100 }).withMessage('State name is required (2-100 characters)'),
    body('nrtpLevel').optional().isString().isLength({ max: 10 }),
    body('rankingPosition').optional().isInt({ min: 1 }),
    body('clubName').optional().isString().isLength({ max: 200 }),
    body('licenseType').optional().isString().isLength({ max: 100 }),
    body('federationIdNumber').isString().isLength({ min: 5, max: 50 }).withMessage('Federation ID number is required (5-50 characters)'),
    body('nationality').optional().isString().isLength({ max: 50 }),
    body('photo').optional().isURL().withMessage('Photo must be a valid URL'),
    body('expirationDate').optional().isISO8601().withMessage('Expiration date must be a valid date'),
    body('metadata').optional().isObject()
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const user = req.user as any;
      
      // Check if user has admin privileges
      if (user.role !== 'admin' && user.role !== 'state') {
        return res.status(403).json({ 
          success: false, 
          error: 'Insufficient permissions to create credentials' 
        });
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
    } catch (error) {
      console.error('Error creating credential:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to create credential' 
      });
    }
  }
);

// Verify credential by ID
router.get('/verify/:credentialId',
  [
    param('credentialId').isUUID().withMessage('Invalid credential ID format')
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
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
  }
);

// Get user credentials
router.get('/user/:userId',
  authenticate,
  [
    param('userId').isInt().withMessage('User ID must be an integer')
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const user = req.user as any;
      const { userId } = req.params;

      // Check if user can access these credentials
      if (user.id !== parseInt(userId) && user.role !== 'admin' && user.role !== 'state') {
        return res.status(403).json({ 
          success: false, 
          error: 'Insufficient permissions' 
        });
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
  }
);

// Get credentials by state
router.get('/state/:stateId',
  authenticate,
  [
    param('stateId').isInt().withMessage('State ID must be an integer'),
    query('userType').optional().isIn(Object.values(CredentialType)).withMessage('Invalid credential type'),
    query('status').optional().isIn(Object.values(CredentialStatus)).withMessage('Invalid credential status'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer')
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const user = req.user as any;
      const { stateId } = req.params;
      const { userType, status, limit = 50, offset = 0 } = req.query;

      // Check if user can access state credentials
      if (user.role !== 'admin' && (user.role !== 'state' || user.stateId !== parseInt(stateId))) {
        return res.status(403).json({ 
          success: false, 
          error: 'Insufficient permissions' 
        });
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
  }
);

// Update credential status (admin only)
router.put('/:credentialId/status',
  authenticate,
  [
    param('credentialId').isUUID().withMessage('Invalid credential ID format'),
    body('status').isIn(Object.values(CredentialStatus)).withMessage('Invalid credential status'),
    body('reason').optional().isString().isLength({ max: 500 }).withMessage('Reason must be a string (max 500 characters)')
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const user = req.user as any;
      
      // Check if user has admin privileges
      if (user.role !== 'admin' && user.role !== 'state') {
        return res.status(403).json({ 
          success: false, 
          error: 'Insufficient permissions' 
        });
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
    } catch (error) {
      console.error('Error updating credential status:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to update credential status' 
      });
    }
  }
);

// Renew credential (admin only)
router.put('/:credentialId/renew',
  authenticate,
  [
    param('credentialId').isUUID().withMessage('Invalid credential ID format'),
    body('extensionMonths').optional().isInt({ min: 1, max: 60 }).withMessage('Extension months must be between 1 and 60')
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const user = req.user as any;
      
      // Check if user has admin privileges
      if (user.role !== 'admin' && user.role !== 'state') {
        return res.status(403).json({ 
          success: false, 
          error: 'Insufficient permissions' 
        });
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
    } catch (error) {
      console.error('Error renewing credential:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to renew credential' 
      });
    }
  }
);

// Generate PDF credential
router.get('/:credentialId/pdf',
  authenticate,
  [
    param('credentialId').isUUID().withMessage('Invalid credential ID format')
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const user = req.user as any;
      const { credentialId } = req.params;

      // TODO: Add proper authorization check based on credential ownership
      
      const pdfBuffer = await credentialService.generatePDFCredential(credentialId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="credential-${credentialId}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF credential:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to generate PDF credential' 
      });
    }
  }
);

// Generate image credential
router.get('/:credentialId/image',
  authenticate,
  [
    param('credentialId').isUUID().withMessage('Invalid credential ID format')
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const user = req.user as any;
      const { credentialId } = req.params;

      // TODO: Add proper authorization check based on credential ownership
      
      const imageBuffer = await credentialService.generateImageCredential(credentialId);

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="credential-${credentialId}.png"`);
      res.send(imageBuffer);
    } catch (error) {
      console.error('Error generating image credential:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to generate image credential' 
      });
    }
  }
);

// Get expiring credentials (admin only)
router.get('/expiring',
  authenticate,
  [
    query('days').optional().isInt({ min: 1, max: 365 }).withMessage('Days must be between 1 and 365')
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const user = req.user as any;
      
      // Check if user has admin privileges
      if (user.role !== 'admin' && user.role !== 'state') {
        return res.status(403).json({ 
          success: false, 
          error: 'Insufficient permissions' 
        });
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
  }
);

// Get credential statistics
router.get('/stats',
  authenticate,
  [
    query('stateId').optional().isInt().withMessage('State ID must be an integer')
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const user = req.user as any;
      const { stateId } = req.query;

      // Check permissions for state-specific stats
      if (stateId && user.role !== 'admin' && (user.role !== 'state' || user.stateId !== parseInt(stateId as string))) {
        return res.status(403).json({ 
          success: false, 
          error: 'Insufficient permissions' 
        });
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
  }
);

// Bulk verify credentials (for QR scanner app)
router.post('/verify-bulk',
  [
    body('credentialIds').isArray().withMessage('Credential IDs must be an array'),
    body('credentialIds.*').isUUID().withMessage('Each credential ID must be a valid UUID')
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const { credentialIds } = req.body;

      const verificationResults = await Promise.all(
        credentialIds.map(async (id: string) => {
          try {
            const result = await credentialService.verifyCredential(id);
            return { id, ...result };
          } catch (error) {
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
  }
);

export default router;