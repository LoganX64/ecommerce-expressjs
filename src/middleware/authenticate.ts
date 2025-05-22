import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { verify, JwtPayload } from 'jsonwebtoken';
import { config } from '../config/config';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'Authorization token missing or malformed'));
  }

  const token = authHeader.slice(7);

  try {
    const decoded = verify(token, config.jwtSecret as string) as JwtPayload & { role?: string };

    if (!decoded || typeof decoded !== 'object' || !decoded.sub || !decoded.role) {
      return next(createHttpError(401, 'Invalid token payload'));
    }

    const _req = req as AuthRequest;
    _req.userId = decoded.sub;
    _req.userRole = decoded.role;

    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return next(createHttpError(401, 'Invalid or expired token'));
  }
};

export default authenticate;
