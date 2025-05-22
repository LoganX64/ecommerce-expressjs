import { config as conf } from 'dotenv';
conf();

interface Config {
  port: string;
  databaseUrl: string;
  env: string;
  jwtSecret: string;
  refreshTokenSecret: string;
  cloudinaryCloud: string;
  cloudinaryAPIkey: string;
  cloudinarySecret: string;
  frontendDomain: string;
  emailuser: string;
  emailpass: string;
}

const _config: Config = {
  port: process.env.PORT ?? '5000',
  databaseUrl: process.env.MONGO_CONNECTION_STRING ?? '',
  env: process.env.NODE_ENV ?? 'development',
  jwtSecret: process.env.JWT_SECRET ?? '',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? '',
  cloudinaryCloud: process.env.CLOUDINARY_CLOUD ?? '',
  cloudinaryAPIkey: process.env.CLOUDINARY_API_KEY ?? '',
  cloudinarySecret: process.env.CLOUDINARY_API_SECRET ?? '',
  frontendDomain: process.env.FRONT_END_DOMAIN ?? '',
  emailuser: process.env.EMAIL_USER ?? '',
  emailpass: process.env.EMAIL_PASS ?? '',
};

export const config = Object.freeze(_config);
