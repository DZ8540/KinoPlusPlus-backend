/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'

const databaseConfig: DatabaseConfig = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */
  connection: Env.get('DB_CONNECTION'),

  connections: {
    /*
    |--------------------------------------------------------------------------
    | PostgreSQL config
    |--------------------------------------------------------------------------
    |
    | Configuration for PostgreSQL database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i pg
    |
    */
    pg: {
      client: 'pg',
      healthCheck: false,
      debug: false,
      seeders: {
        paths: ['./database/seeders/MainSeeder']
      },
      migrations: {
        naturalSort: true,
      },
      connection: {
        host: Env.get('PG_HOST'),
        port: Env.get('PG_PORT'),
        user: Env.get('PG_USER'),
        password: Env.get('PG_PASSWORD', ''),
        database: Env.get('PG_DB_NAME'),
      },
    },

  }
}

export enum TablesNames {
  /**
   * * Genre
   */

  GENRES = 'genres',
  GENRES_VIDEOS = 'genres_videos',

  /**
   * * User
   */

  ROLES = 'roles',
  USERS = 'users',
  SESSIONS = 'sessions',
  WISHLISTS = 'wishlists',
  LATER_LISTS = 'laterLists',
  HISTORY_LISTS = 'historyLists',

  /**
   * * Video
   */

  VIDEOS = 'videos',
  VIDEOS_COMMENTS = 'videosComments',

  /**
   * * Room
   */

  ROOMS = 'rooms',
  ROOMS_MESSAGES = 'roomsMessages',
  ROOMS_USERS = 'rooms_users',
}

export const VIDEOS_DESCRIPTION_LENGTH: number = 8192
export const VIDEO_COMMENTS_DESCRIPTION_LENGTH: number = 4096

export const GENRES_DESCRIPTION_LENGTH: number = 4096

export default databaseConfig
