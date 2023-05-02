import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

const APP_ENV = process.env['APP_ENV'] || 'development';

export const config = {
  APP_ENV,
  APP_IP: process.env['APP_IP'],
  APP_PORT: process.env['APP_PORT'],

  TYPEORM_HOST: process.env['TYPEORM_HOST'],
  TYPEORM_USERNAME: process.env['TYPEORM_USERNAME'],
  TYPEORM_PASSWORD: process.env['TYPEORM_PASSWORD'],
  TYPEORM_DATABASE: process.env['TYPEORM_DATABASE'],
  TYPEORM_PORT: process.env['TYPEORM_PORT'],
  TYPEORM_SYNC: process.env['TYPEORM_SYNC'] === 'true',

  USER_NAME_SMTP: process.env['USER_NAME_SMTP'],
  USER_PASSWORD_SMTP: process.env['USER_PASSWORD_SMTP'],
  HOST_SMTP: process.env['HOST_SMTP'],
  PORT_SMTP: process.env['PORT_SMTP'] || '',
  EMAIL_SEND_FROM_SMTP: process.env['EMAIL_SEND_FROM_SMTP'],
  APP_DOMAIN: process.env['APP_DOMAIN'],

  JWT_SECRET: process.env['JWT_SECRET'],
  JWT_EXPIRES_ACCESS: process.env['JWT_EXPIRES_ACCESS'],
  JWT_EXPIRES_REFRESH: process.env['JWT_EXPIRES_REFRESH'],
};
