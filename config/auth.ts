import Env from '@ioc:Adonis/Core/Env'
import { AuthConfig } from 'Contracts/auth'

export const COOKIE_REFRESH_TOKEN_KEY: string = 'refreshToken'

const authConfig: AuthConfig = {
  access: {
    key: Env.get('ACCESS_TOKEN_KEY'),
    expire: Env.get('ACCESS_TOKEN_EXPIRE'),
  },
  refresh: {
    key: Env.get('REFRESH_TOKEN_KEY'),
    expire: Env.get('REFRESH_TOKEN_EXPIRE'),
  },
  emailVerify: {
    key: Env.get('MAIL_VERIFY_TOKEN_KEY'),
    expire: Env.get('MAIL_VERIFY_TOKEN_EXPIRE'),
  },
}

export const COOKIE_REFRESH_TOKEN_OPTIONS = {
  path: '/api/auth',
  maxAge: authConfig.refresh.expire,
} as const

export default authConfig
