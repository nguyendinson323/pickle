import { Request, Response, NextFunction } from 'express';
import { MicrositeService } from '../services/micrositeService';

const micrositeService = new MicrositeService();

export interface SubdomainRequest extends Request {
  subdomain?: string;
  microsite?: any;
}

export const extractSubdomain = (req: SubdomainRequest, res: Response, next: NextFunction) => {
  const host = req.get('host') || req.get('x-forwarded-host');
  
  if (!host) {
    return next();
  }

  // Extract subdomain from host
  // Expected format: subdomain.pickleballfed.mx or subdomain.localhost:3000
  const hostParts = host.split('.');
  
  // For development/localhost
  if (hostParts.length >= 2 && hostParts[0] !== 'www' && hostParts[0] !== 'api') {
    // Check if it's a valid subdomain (not the main domain)
    const mainDomains = ['pickleballfed', 'localhost'];
    const subdomain = hostParts[0];
    
    // Skip if subdomain is empty or matches main domain patterns
    if (subdomain && !mainDomains.includes(subdomain)) {
      req.subdomain = subdomain;
    }
  }

  next();
};

export const loadMicrosite = async (req: SubdomainRequest, res: Response, next: NextFunction) => {
  if (!req.subdomain) {
    return next();
  }

  try {
    const microsite = await micrositeService.getMicrositeBySubdomain(req.subdomain);
    
    if (microsite) {
      req.microsite = microsite;
    }
    
    next();
  } catch (error) {
    console.error('Error loading microsite:', error);
    next();
  }
};

export const requireMicrosite = (req: SubdomainRequest, res: Response, next: NextFunction) => {
  if (!req.microsite) {
    return res.status(404).json({
      error: 'Microsite not found',
      message: 'The requested subdomain does not exist or is not published'
    });
  }
  
  next();
};

export const micrositeRenderer = (req: SubdomainRequest, res: Response, next: NextFunction) => {
  if (req.microsite) {
    // This request is for a microsite, handle it differently
    req.url = `/microsite${req.url}`;
  }
  
  next();
};