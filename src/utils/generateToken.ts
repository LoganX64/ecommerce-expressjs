import { sign, SignOptions } from 'jsonwebtoken';
import { config } from '../config/config';
import ms from 'ms';

export interface TokenPayload {
  sub: string;
  role: string;
}

export interface GeneratedTokens {
  accessToken: string;
  refreshToken: string;
}

export const generateTokens = (userId: string, role: string): GeneratedTokens => {
  const payload: TokenPayload = { sub: userId, role };

  const accessTokenOptions: SignOptions = {
    expiresIn: ms('15m'), // or '15m'
  };

  const refreshTokenOptions: SignOptions = {
    expiresIn: ms('7d'), // or '7d'
  };

  const accessToken = sign(payload, config.jwtSecret as string, accessTokenOptions);
  const refreshToken = sign(payload, config.refreshTokenSecret as string, refreshTokenOptions);

  return {
    accessToken,
    refreshToken,
  };
};
