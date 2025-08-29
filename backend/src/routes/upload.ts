import { Router } from 'express';
import uploadController from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';
import { 
  uploadGenericFile, 
  uploadProfilePhoto, 
  uploadIdDocument, 
  uploadLogo, 
  handleMulterError 
} from '../middleware/fileUpload';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// All upload routes require authentication
router.use(authenticate);

// Generic file upload
router.post('/file',
  uploadGenericFile,
  handleMulterError,
  asyncHandler(uploadController.uploadImage)
);

// Profile photo upload
router.post('/profile-photo',
  uploadProfilePhoto,
  handleMulterError,
  asyncHandler(uploadController.uploadProfilePhoto)
);

// Document upload
router.post('/document',
  uploadIdDocument,
  handleMulterError,
  asyncHandler(uploadController.uploadDocument)
);

// Logo upload
router.post('/logo',
  uploadLogo,
  handleMulterError,
  asyncHandler(uploadController.uploadLogo)
);

// File management
router.delete('/:publicId', asyncHandler(uploadController.deleteFile));
router.get('/:publicId/info', asyncHandler(uploadController.getFileInfo));

export default router;