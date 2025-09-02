import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateToken } from '../middleware/auth';
import * as micrositeBuilderController from '../controllers/micrositeBuilderController';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/microsites/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|pdf|doc|docx|mp4|mp3|wav/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Public routes (no authentication required)
router.get('/templates', micrositeBuilderController.getTemplates);
router.get('/public/:subdomain', micrositeBuilderController.getPublicMicrosite);
router.get('/public/:subdomain/sitemap.xml', micrositeBuilderController.generateSitemap);

// Protected routes (authentication required)
router.use(authenticateToken);

// Microsite CRUD
router.get('/', micrositeBuilderController.getMicrosites);
router.get('/:id', micrositeBuilderController.getMicrositeById);
router.post('/', micrositeBuilderController.createMicrosite);
router.put('/:id', micrositeBuilderController.updateMicrosite);
router.delete('/:id', micrositeBuilderController.deleteMicrosite);

// Publishing
router.post('/:id/publish', micrositeBuilderController.publishMicrosite);
router.post('/:id/unpublish', micrositeBuilderController.unpublishMicrosite);
router.post('/:id/duplicate', micrositeBuilderController.duplicateMicrosite);

// Page management
router.post('/:id/pages', micrositeBuilderController.addPage);
router.put('/:id/pages/:pageId', micrositeBuilderController.updatePage);
router.delete('/:id/pages/:pageId', micrositeBuilderController.deletePage);

// Media library
router.get('/:id/media', micrositeBuilderController.getMedia);
router.post('/:id/media', upload.single('file'), micrositeBuilderController.uploadMedia);
router.delete('/:id/media/:mediaId', micrositeBuilderController.deleteMedia);

// Analytics
router.get('/:id/analytics', micrositeBuilderController.getAnalytics);

export default router;