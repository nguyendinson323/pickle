import { Router } from 'express';
import authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Public routes
router.post('/login', asyncHandler(authController.login));
router.post('/refresh', asyncHandler(authController.refreshToken));

// Protected routes
router.post('/logout', authenticate, asyncHandler(authController.logout));
router.get('/me', authenticate, asyncHandler(authController.getCurrentUser));
router.get('/verify', authenticate, asyncHandler(authController.verifyToken));

export default router;