import express from 'express';
import { MicrositeRenderer } from '../services/micrositeRenderer';
import { extractSubdomain, loadMicrosite, requireMicrosite } from '../middleware/subdomain';

const router = express.Router();
const micrositeRenderer = new MicrositeRenderer();

// Apply subdomain middleware to all routes
router.use(extractSubdomain);
router.use(loadMicrosite);

// Public microsite routes (only for subdomains)
router.get('/', requireMicrosite, (req, res) => {
  micrositeRenderer.renderMicrositeHomePage(req, res);
});

router.get('/navigation', requireMicrosite, (req, res) => {
  micrositeRenderer.getMicrositeNavigation(req, res);
});

router.get('/theme.css', requireMicrosite, (req, res) => {
  micrositeRenderer.getMicrositeThemeCSS(req, res);
});

router.get('/:slug', requireMicrosite, (req, res) => {
  micrositeRenderer.renderMicrositePage(req, res);
});

export default router;