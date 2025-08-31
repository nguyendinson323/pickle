import { Router } from 'express';
import profileController from '../controllers/profileController';
import { authenticate } from '../middleware/auth';
import { uploadProfilePhoto, uploadIdDocument, uploadLogo, handleMulterError } from '../middleware/fileUpload';
import { asyncHandler } from '../middleware/errorHandler';
import { body } from 'express-validator';

const router = Router();

// Profile validation rules
const updateProfileValidation = [
  body('fullName').optional().trim().isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('dateOfBirth').optional().isISO8601()
    .withMessage('Date of birth must be a valid date'),
  body('gender').optional().isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('mobilePhone').optional().isMobilePhone('es-MX')
    .withMessage('Mobile phone must be a valid Mexican phone number'),
  body('email').optional().isEmail().normalizeEmail()
    .withMessage('Email must be valid'),
  body('username').optional().trim().isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty()
    .withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  })
];

// Apply authentication middleware to all routes
router.use(authenticate);

// Profile management routes
router.get('/me', asyncHandler(profileController.getProfile));
router.put('/me', updateProfileValidation, asyncHandler(profileController.updateProfile));

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
  changePasswordValidation,
  asyncHandler(profileController.changePassword)
);

export default router;