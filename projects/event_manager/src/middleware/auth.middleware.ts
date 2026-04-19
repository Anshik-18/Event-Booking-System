import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/types';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as UserRole;

  if (!userId || !userRole) {
    res.status(401).json({ error: 'Authentication headers x-user-id and x-user-role are required' });
    return;
  }

  if (userRole !== 'organizer' && userRole !== 'customer') {
    res.status(400).json({ error: 'Invalid role' });
    return;
  }

  req.user = { id: userId, role: userRole };
  next();
};

export const requireRole = (requiredRole: UserRole) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    if (req.user.role !== requiredRole) {
      res.status(403).json({ error: `Forbidden: Requires ${requiredRole} role` });
      return;
    }
    
    next();
  };
};
