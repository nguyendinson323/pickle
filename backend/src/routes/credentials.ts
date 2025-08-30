import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import credentialController from '../controllers/credentialController';

const router = Router();

// Create new credential (admin only)
router.post('/create', authenticate, credentialController.createCredential);

// Verify credential by ID
router.get('/verify/:credentialId', credentialController.verifyCredential);

// Get user credentials
router.get('/user/:userId', authenticate, credentialController.getUserCredentials);

// Get credentials by state
router.get('/state/:stateId', authenticate, credentialController.getCredentialsByState);

// Update credential status (admin only)
router.put('/:credentialId/status', authenticate, credentialController.updateCredentialStatus);

// Renew credential (admin only)
router.put('/:credentialId/renew', authenticate, credentialController.renewCredential);

// Generate PDF credential
router.get('/:credentialId/pdf', authenticate, credentialController.generatePDFCredential);

// Generate image credential
router.get('/:credentialId/image', authenticate, credentialController.generateImageCredential);

// Get expiring credentials (admin only)
router.get('/expiring', authenticate, credentialController.getExpiringCredentials);

// Get credential statistics
router.get('/stats', authenticate, credentialController.getCredentialStatistics);

// Bulk verify credentials (for QR scanner app)
router.post('/verify-bulk', credentialController.bulkVerifyCredentials);

export default router;