import authConfig from 'Config/auth'
import User from 'App/Models/User/User'
import Hash from '@ioc:Adonis/Core/Hash'
import TokenService from './TokenService'
import Token from 'App/Models/User/Token'
import MailerService from './MailerService'
import UserService from './User/UserService'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import LoginValidator from 'App/Validators/LoginValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'
import { Error } from 'Contracts/services'
import { AuthHeaders } from 'Contracts/auth'
import { RoleTypes, ROLE_TYPES } from 'Config/role'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { SignTokenConfig, Tokens, TokenUserPayload } from 'Contracts/token'

const ERROR: Error = { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.USER_NOT_FOUND }

export default class AuthService {
  public static async loginViaAdminPanel(payload: LoginValidator['schema']['props']): Promise<User> {
    let user: User

    try {
      user = await UserService.getByEmail(payload.email)
    } catch (err: Error | any) {
      throw ERROR
    }

    try {
      if (!(await Hash.verify(user.password, payload.password)))
        throw null

      return user
    } catch (err: any) {
      Logger.error(err)
      throw ERROR
    }
  }

  public static async checkAdminAccess(id: User['id']): Promise<void> {
    let user: User

    try {
      user = await UserService.get(id, { relations: ['role'] })
    } catch (err: Error | any) {
      throw ERROR
    }

    if (user.role.name != ROLE_TYPES[RoleTypes.ADMIN])
      throw ERROR
  }

  /**
   * * For api
   */

  public static async registerViaApi(payload: RegisterValidator['schema']['props']): Promise<void> {
    const trx = await Database.transaction()

    try {
      const user: User = await UserService.create(payload, { trx })

      await MailerService.sendMailVerificationToken(user)
      await trx.commit()
    } catch (err: Error | any) {
      await trx.rollback()

      throw err
    }
  }

  public static async loginViaApi(payload: LoginValidator['schema']['props'], headers: AuthHeaders): Promise<{ tokens: Tokens, user: User }> {
    let user: User

    try {
      user = await UserService.getByEmail(payload.email)

      if (
        !user.isEmailVerified ||
        !(await Hash.verify(user.password, payload.password))
      ) throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.USER_NOT_FOUND } as Error
    } catch (err: Error | any) {
      throw err
    }

    try {
      const tokens: Tokens = this.createTokens(user)

      await user.related('tokens').create({
        ...headers,
        token: tokens.refresh,
      })

      return { tokens, user }
    } catch (err: any) {
      Logger.error(err)
      throw ERROR
    }
  }

  public static async refreshToken(token: string, headers: AuthHeaders): Promise<{ tokens: Tokens, user: User }> {
    let user: User
    let tokenSession: Token

    try {
      const { id }: TokenUserPayload = TokenService.verifyToken<TokenUserPayload>(token, authConfig.refresh.key)

      user = await UserService.get(id)
      tokenSession = await TokenService.getTokenSession(token, user, headers)
    } catch (err: Error | any) {
      throw err
    }

    try {
      const tokens: Tokens = this.createTokens(user)

      await tokenSession.merge({ token: tokens.refresh }).save()

      return { user, tokens }
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async logout(token: string, headers: AuthHeaders): Promise<void> {
    let user: User
    let tokenSession: Token

    try {
      const tokenData: TokenUserPayload = TokenService.verifyToken<TokenUserPayload>(token, authConfig.refresh.key)

      user = await UserService.get(tokenData.id)
      tokenSession = await TokenService.getTokenSession(token, user, headers)
    } catch (err: Error | any) {
      throw err
    }

    try {
      await tokenSession.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  /**
   * * Private methods
   */

  private static createTokens(user: User): Tokens {
    const tokensPayload: TokenUserPayload = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      birthday: user.birthday,
      phone: user.phone,
      sex: user.sex,
    }

    const access: string = this.createAccessToken(tokensPayload)
    const refresh: string = this.createRefreshToken(tokensPayload)

    return { access, refresh }
  }

  private static createAccessToken(payload: TokenUserPayload): string {
    const config: SignTokenConfig = {
      key: authConfig.access.key,
      expire: authConfig.access.expire,
    }

    return TokenService.createToken(payload, config)
  }

  private static createRefreshToken(payload: TokenUserPayload): string {
    const config: SignTokenConfig = {
      key: authConfig.refresh.key,
      expire: authConfig.refresh.expire,
    }

    return TokenService.createToken(payload, config)
  }
}
