import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { verifyUserRole } from '../utils/verifyUserRole';

interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authorize =
  (allowedRoles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw createHttpError(401, 'Authorization header missing');

      const token = authHeader.split(' ')[1];

      const decoded = verifyUserRole(token, allowedRoles);

      req.userId = decoded.sub;
      req.userRole = decoded.role;

      next();
    } catch (error) {
      next(error);
    }
  };
