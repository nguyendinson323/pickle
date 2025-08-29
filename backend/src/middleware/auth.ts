import { Request, Response, NextFunction } from 'express';
import jwtService from '../services/jwtService';
import { UserRole } from '../types/auth';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        role: UserRole;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = jwtService.extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    const payload = jwtService.verifyAccessToken(token);
    
    if (!payload) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    };

    next();
    return;
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
    return;
  };
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = jwtService.extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
      const payload = jwtService.verifyAccessToken(token);
      
      if (payload) {
        req.user = {
          userId: payload.userId,
          email: payload.email,
          role: payload.role
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};