import { Router } from 'express';
import profileController from '../controllers/profileController';
import { authenticate } from '../middleware/auth';
import { uploadProfilePhoto, uploadIdDocument, uploadLogo, handleMulterError } from '../middleware/fileUpload';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();


// Apply authentication middleware to all routes
router.use(authenticate);

// Profile management routes
router.get('/me', asyncHandler(profileController.getProfile));
router.put('/me', asyncHandler(profileController.updateProfile));

// File upload routes
router.post('/upload-photo', 
  uploadProfilePhoto,
  handleMulterError,
  asyncHandler(profileController.uploadProfilePhoto)
);

router.post('/upload-document',
  uploadIdDocument,
  handleMulterError,
  asyncHandler(profileController.uploadIdDocument)
);

router.post('/upload-logo',
  uploadLogo,
  handleMulterError,
  asyncHandler(profileController.uploadLogo)
);

// Profile completion status
router.get('/completion', asyncHandler(profileController.getProfileCompletion));

// Delete profile photo
router.delete('/photo', asyncHandler(profileController.deleteProfilePhoto));

// Change password
router.post('/change-password', 
  asyncHandler(profileController.changePassword)
);

export default router;