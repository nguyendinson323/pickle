import { Router } from 'express';
import registrationController from '../controllers/registrationController';
import { uploadRegistrationFiles, uploadLogo, handleMulterError } from '../middleware/fileUpload';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Player registration
router.post('/player', 
  uploadRegistrationFiles,
  handleMulterError,
  asyncHandler(registrationController.registerPlayer)
);

// Coach registration
router.post('/coach',
  uploadRegistrationFiles,
  handleMulterError,
  asyncHandler(registrationController.registerCoach)
);

// Club registration
router.post('/club',
  uploadLogo,
  handleMulterError,
  asyncHandler(registrationController.registerClub)
);

// Partner registration
router.post('/partner',
  uploadLogo,
  handleMulterError,
  asyncHandler(registrationController.registerPartner)
);

// State committee registration
router.post('/state-committee',
  uploadLogo,
  handleMulterError,
  asyncHandler(registrationController.registerStateCommittee)
);

// Availability check endpoints
router.get('/check-username/:username', asyncHandler(registrationController.checkUsername));
router.get('/check-email/:email', asyncHandler(registrationController.checkEmail));
router.get('/check-curp/:curp', asyncHandler(registrationController.checkCurp));

export default router;