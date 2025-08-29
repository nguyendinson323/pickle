import { Router } from 'express';
import registrationController from '../controllers/registrationController';
import { uploadRegistrationFiles, uploadLogo, handleMulterError } from '../middleware/fileUpload';
import { asyncHandler } from '../middleware/errorHandler';
import {
  playerRegistrationValidators,
  coachRegistrationValidators,
  clubRegistrationValidators,
  partnerRegistrationValidators,
  stateCommitteeRegistrationValidators
} from '../validators/registrationValidators';

const router = Router();

// Player registration
router.post('/player', 
  uploadRegistrationFiles,
  handleMulterError,
  playerRegistrationValidators,
  asyncHandler(registrationController.registerPlayer)
);

// Coach registration
router.post('/coach',
  uploadRegistrationFiles,
  handleMulterError,
  coachRegistrationValidators,
  asyncHandler(registrationController.registerCoach)
);

// Club registration
router.post('/club',
  uploadLogo,
  handleMulterError,
  clubRegistrationValidators,
  asyncHandler(registrationController.registerClub)
);

// Partner registration
router.post('/partner',
  uploadLogo,
  handleMulterError,
  partnerRegistrationValidators,
  asyncHandler(registrationController.registerPartner)
);

// State committee registration
router.post('/state-committee',
  uploadLogo,
  handleMulterError,
  stateCommitteeRegistrationValidators,
  asyncHandler(registrationController.registerStateCommittee)
);

// Availability check endpoints
router.get('/check-username/:username', asyncHandler(registrationController.checkUsername));
router.get('/check-email/:email', asyncHandler(registrationController.checkEmail));
router.get('/check-curp/:curp', asyncHandler(registrationController.checkCurp));

export default router;