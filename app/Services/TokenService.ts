import User from 'App/Models/User/User'
import Token from 'App/Models/User/Token'
import Logger from '@ioc:Adonis/Core/Logger'
import { Error } from 'Contracts/services'
import { sign, verify } from 'jsonwebtoken'
import { AuthHeaders } from 'Contracts/auth'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { SignTokenConfig, Tokens, TokenUserPayload } from 'Contracts/token'

export default class TokenService {
  public static async getTokenSession(token: Tokens['refresh'], user: User, headers?: AuthHeaders): Promise<Token> {
    let tokenSession: Token | null

    try {
      tokenSession = await user.related('tokens').query().where('token', token).first()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }

    if (!tokenSession)
      throw { code: ResponseCodes.TOKEN_EXPIRED, msg: ResponseMessages.TOKEN_ERROR } as Error

    if (headers) {
      if (
        tokenSession.ip != headers.ip ||
        tokenSession.userAgent != headers.userAgent ||
        tokenSession.fingerprint != headers.fingerprint
      ) throw { code: ResponseCodes.TOKEN_EXPIRED, msg: ResponseMessages.TOKEN_ERROR } as Error
    }

    return tokenSession
  }

  /**
   * * JWT
   */

  public static createToken(payload: TokenUserPayload, config: SignTokenConfig): string {
    if (!config.algorithm)
      config.algorithm = 'HS512'

    return sign(payload, config.key, { algorithm: config.algorithm, expiresIn: config.expire })
  }

  public static verifyToken<D = any>(token: string, key: string): D {
    try {
      // @ts-ignore
      return verify(token, key) as D
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.TOKEN_EXPIRED, msg: ResponseMessages.TOKEN_ERROR } as Error
    }
  }
}
