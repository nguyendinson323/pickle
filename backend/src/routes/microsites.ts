import express from 'express';
import { micrositeController } from '../controllers/micrositeController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/fileUpload';

const router = express.Router();

// Public routes (no authentication required)
router.get('/public', micrositeController.getPublicMicrosites);
router.get('/search', micrositeController.searchMicrosites);
router.get('/subdomain/:subdomain', micrositeController.getMicrositeBySubdomain);
router.get('/subdomain/:subdomain/page/:slug?', micrositeController.getPageBySlug);

// Theme routes (public)
router.get('/themes', micrositeController.getThemes);
router.get('/themes/:id', micrositeController.getTheme);
router.post('/themes/:id/css', micrositeController.generateThemeCSS);

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

// Page management
router.post('/:micrositeId/pages', micrositeController.createPage);
router.get('/:micrositeId/pages', micrositeController.getMicrositePages);
router.put('/:micrositeId/pages/reorder', micrositeController.reorderPages);

// Individual page operations
router.get('/pages/:id', micrositeController.getPage);
router.put('/pages/:id', micrositeController.updatePage);
router.delete('/pages/:id', micrositeController.deletePage);
router.post('/pages/:id/publish', micrositeController.publishPage);
router.post('/pages/:id/unpublish', micrositeController.unpublishPage);
router.post('/pages/:id/duplicate', micrositeController.duplicatePage);

// Content block management
router.post('/pages/:pageId/blocks', micrositeController.createContentBlock);
router.get('/pages/:pageId/blocks', micrositeController.getPageBlocks);
router.put('/pages/:pageId/blocks/reorder', micrositeController.reorderContentBlocks);

// Individual block operations
router.get('/blocks/:id', micrositeController.getContentBlock);
router.put('/blocks/:id', micrositeController.updateContentBlock);
router.delete('/blocks/:id', micrositeController.deleteContentBlock);
router.post('/blocks/:id/duplicate', micrositeController.duplicateContentBlock);
router.post('/blocks/:id/toggle-visibility', micrositeController.toggleBlockVisibility);

// Media management
router.post('/:micrositeId/media/upload', upload.single('file'), micrositeController.uploadMedia);
router.get('/:micrositeId/media', micrositeController.getMicrositeMedia);
router.put('/media/:id', micrositeController.updateMediaFile);
router.delete('/media/:id', micrositeController.deleteMediaFile);

export default router;