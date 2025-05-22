import createHttpError from 'http-errors';
import { verify, JwtPayload } from 'jsonwebtoken';
import { config } from '../config/config';

export interface DecodedToken {
  sub: string;
  role: string;
}

/**
 * Verify JWT token and user role inside controller.
 * @param token JWT token string (without "Bearer " prefix)
 * @param allowedRoles Array of roles allowed to access
 * @returns DecodedToken with userId (sub) and role if valid.
 * @throws HttpError 401 if invalid token, 403 if role unauthorized
 */
export const verifyUserRole = (token: string, allowedRoles: string[]): DecodedToken => {
  if (!token) {
    throw createHttpError(401, 'Authorization token is required');
  }

  let decoded: JwtPayload;
  try {
    decoded = verify(token, config.jwtSecret as string) as JwtPayload;
  } catch {
    throw createHttpError(401, 'Invalid or expired token');
  }

  if (!decoded.sub || !decoded.role) {
    throw createHttpError(401, 'Invalid token payload');
  }

  if (!allowedRoles.includes(decoded.role)) {
    throw createHttpError(403, 'Access forbidden: insufficient role');
  }

  return {
    sub: decoded.sub as string,
    role: decoded.role as string,
  };
};
