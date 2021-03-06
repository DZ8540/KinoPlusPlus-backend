/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
	HOST: Env.schema.string({ format: 'host' }),
	PORT: Env.schema.number(),
	APP_KEY: Env.schema.string(),
	APP_NAME: Env.schema.string(),
	CACHE_VIEWS: Env.schema.boolean(),
	SESSION_DRIVER: Env.schema.string(),
  DRIVE_DISK: Env.schema.enum(['local'] as const),
	NODE_ENV: Env.schema.enum(['development', 'production', 'testing'] as const),

  /**
   * * Auth
   */

  ACCESS_TOKEN_KEY: Env.schema.string(),
  ACCESS_TOKEN_EXPIRE: Env.schema.string(),
  REFRESH_TOKEN_KEY: Env.schema.string(),
  REFRESH_TOKEN_EXPIRE: Env.schema.string(),
  MAIL_VERIFY_TOKEN_KEY: Env.schema.string(),
  MAIL_VERIFY_TOKEN_EXPIRE: Env.schema.string(),

  /**
   * * Postgres
   */

  PG_HOST: Env.schema.string({ format: 'host' }),
  PG_PORT: Env.schema.number(),
  PG_USER: Env.schema.string(),
  PG_PASSWORD: Env.schema.string.optional(),
  PG_DB_NAME: Env.schema.string(),

  /**
   * * Mongo
   */

  MONGO_HOST: Env.schema.string({ format: 'host' }),
  MONGO_PORT: Env.schema.number(),
  MONGO_DB_NAME: Env.schema.string(),

  /**
   * * Mailer
   */

  SMTP_HOST: Env.schema.string({ format: 'host' }),
  SMTP_PORT: Env.schema.number(),
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.string(),
  SMTP_FROM: Env.schema.string(),

  /**
   * * Video API
   */

  MAIN_DATA_API_API_TOKEN: Env.schema.string(),
  VIDEO_API_TOKEN: Env.schema.string(),
  VIDEO_API_MAX_PAGES_SYNC: Env.schema.number(),
  VIDEO_API_START_PAGE: Env.schema.number(),
  VIDEO_API_LIMIT_PER_PAGE_SYNC: Env.schema.number(),

  /**
   * * Room
   */

  ROOM_MAX_USERS_COUNT: Env.schema.number(),
})
