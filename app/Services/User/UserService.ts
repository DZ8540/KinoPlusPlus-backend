import authConfig from 'Config/auth'
import User from 'App/Models/User/User'
import Hash from '@ioc:Adonis/Core/Hash'
import TokenService from '../TokenService'
import Drive from '@ioc:Adonis/Core/Drive'
import Video from 'App/Models/Video/Video'
import Logger from '@ioc:Adonis/Core/Logger'
import ApiValidator from 'App/Validators/ApiValidator'
import ListValidator from 'App/Validators/User/ListValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'
import UpdateUserValidator from 'App/Validators/User/UpdateUserValidator'
import { JSONPaginate } from 'Contracts/database'
import { TokenUserPayload } from 'Contracts/token'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { Error, PaginateConfig, ServiceConfig } from 'Contracts/services'
import { ModelAttributes, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

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

  public static async update(id: User['id'], payload: UpdateUserValidator['schema']['props'], { trx }: ServiceConfig<User> = {}): Promise<User> {
    let user: User
    const userPayload: Partial<ModelAttributes<User>> = {
      email: payload.email,
      nickname: payload.nickname,
      password: payload.password,
      phone: payload.phone,
      sex: payload.sex,
      avatar: undefined,
      birthday: undefined,
    }

    try {
      user = await this.get(id, { trx })
    } catch (err: Error | any) {
      throw err
    }

    if (payload.oldPassword) {
      if (!(await Hash.verify(user.password, payload.oldPassword)))
        throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.OLD_PASSWORD_INCORRECT } as Error
    }

    if (payload.avatar) {
      if (user.avatar) {
        await Drive.delete(user.$original.avatar)
      }

      await payload.avatar.moveToDisk('User')
      userPayload.avatar = `User/${payload.avatar.fileName}`
    }

    try {
      return await user.merge(userPayload).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  /**
   * * For API
   */

  public static async activate(token: string): Promise<void> {
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
      await user.merge({ isEmailVerified: true }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async getUserWishlist(userId: User['id'], config: ApiValidator['schema']['props']): Promise<JSONPaginate> {
    let user: User

    try {
      user = await this.get(userId)
    } catch (err: Error | any) {
      throw err
    }

    try {
      const wishlist: JSONPaginate = (await user.related('wishlist').query().getViaPaginate(config)).toJSON()

      wishlist.data = await Promise.all(wishlist.data.map(async (item: Video) => item.getForUser(userId)))

      return wishlist
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async addToWishlist(payload: ListValidator['schema']['props']): Promise<void> {
    let user: User

    try {
      user = await this.get(payload.userId)
    } catch (err: Error | any) {
      throw err
    }

    try {
      await user.related('wishlist').attach([payload.videoId])
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async removeFromWishlist(payload: ListValidator['schema']['props']): Promise<void> {
    let user: User

    try {
      user = await this.get(payload.userId)
    } catch (err: Error | any) {
      throw err
    }

    try {
      await user.related('wishlist').detach([payload.videoId])
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }
}
