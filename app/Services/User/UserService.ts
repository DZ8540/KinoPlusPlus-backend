import authConfig from 'Config/auth'
import User from 'App/Models/User/User'
import TokenService from '../TokenService'
import Logger from '@ioc:Adonis/Core/Logger'
import RegisterValidator from 'App/Validators/Api/Auth/RegisterValidator'
import { TokenUserPayload } from 'Contracts/token'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { Error, PaginateConfig, ServiceConfig } from 'Contracts/services'

type Columns = typeof User['columns'][number]

export default class UserService {
  public static async paginate(config: PaginateConfig<Columns>, columns: Columns[] = []): Promise<ModelPaginatorContract<User>> {
    try {
      return await User.query().select(columns).getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async get(id: User['id'], config: ServiceConfig<User> = {}): Promise<User> {
    let item: User | null

    try {
      item = await User.find(id, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.USER_NOT_FOUND } as Error

    try {
      if (config.relations) {
        for (const relationItem of config.relations) {
          await item.load(relationItem)
        }
      }

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async getByEmail(email: User['email'], config: ServiceConfig<User> = {}): Promise<User> {
    let item: User | null

    try {
      item = await User.findBy('email', email, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.USER_NOT_FOUND } as Error

    try {
      if (config.relations) {
        for (const relationItem of config.relations) {
          await item.load(relationItem)
        }
      }

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async create(payload: RegisterValidator['schema']['props'], { trx }: ServiceConfig<User> = {}): Promise<User> {
    try {
      return await User.create(payload, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  /**
   * * For API
   */

  public static async activate(token: string): Promise<User> {
    let payload: TokenUserPayload
    let user: User

    try {
      payload = TokenService.verifyToken<TokenUserPayload>(token, authConfig.emailVerify.key)
      user = await this.getByEmail(payload.email)
    } catch (err: Error | any) {
      throw err
    }

    if (user.isEmailVerified)
      throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.ACCOUNT_ALREADY_ACTIVATED } as Error

    try {
      return await user.merge({ isEmailVerified: true }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }
}
