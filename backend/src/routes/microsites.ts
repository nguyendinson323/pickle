import express from 'express';
import micrositeController from '../controllers/micrositeController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes (no authentication required)
router.get('/subdomain/:subdomain', micrositeController.getMicrositeBySubdomain);
router.get('/subdomain/:subdomain/page/:slug', micrositeController.getMicrositePage);

// Protected routes (authentication required)
router.use(authenticate);

// Microsite CRUD
router.post('/', micrositeController.createMicrosite);
router.get('/my', micrositeController.getUserMicrosites);
router.get('/:id', micrositeController.getMicrosite);
router.put('/:id', micrositeController.updateMicrosite);
router.delete('/:id', micrositeController.deleteMicrosite);

// Microsite actions
router.post('/:id/publish', micrositeController.publishMicrosite);
router.post('/:id/unpublish', micrositeController.unpublishMicrosite);
router.post('/:id/duplicate', micrositeController.duplicateMicrosite);

export default router;