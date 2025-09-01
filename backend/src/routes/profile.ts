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

// Privacy settings (for player search visibility)
router.patch('/privacy', async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { canBeFound } = req.body;
    
    // Import models here to avoid circular dependency
    const { Player } = require('../models');
    
    // Find player profile
    const player = await Player.findOne({ where: { userId } });
    
    if (!player) {
      return res.status(404).json({
        success: false,
        error: 'Player profile not found'
      });
    }
    
    // Update canBeFound setting
    await player.update({ canBeFound: !!canBeFound });
    
    res.json({
      success: true,
      message: 'Privacy setting updated successfully',
      data: { canBeFound: !!canBeFound }
    });
  } catch (error) {
    console.error('Privacy update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update privacy setting'
    });
  }
});

export default router;