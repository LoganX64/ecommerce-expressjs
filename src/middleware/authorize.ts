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
      // Extract token from Authorization header: "Bearer <token>"
      const authHeader = req.headers.authorization;
      if (!authHeader) throw createHttpError(401, 'Authorization header missing');

      const token = authHeader.split(' ')[1]; // Get token part

      // Use verifyUserRole to validate token and role
      const decoded = verifyUserRole(token, allowedRoles);

      // Attach user info to req object for downstream use
      req.userId = decoded.sub;
      req.userRole = decoded.role;

      next();
    } catch (error) {
      next(error);
    }
  };
