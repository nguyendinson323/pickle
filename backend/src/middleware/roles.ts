import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/auth';

export const authorizeRoles = (allowedRoles: UserRole[]) => {
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
  };
};

export const requireRole = (role: UserRole) => {
  return authorizeRoles([role]);
};

export const requireAnyRole = (...roles: UserRole[]) => {
  return authorizeRoles(roles);
};