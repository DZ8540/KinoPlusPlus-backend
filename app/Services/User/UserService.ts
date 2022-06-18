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
import { Err, PaginateConfig, ServiceConfig } from 'Contracts/services'
import { ModelAttributes, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

type Columns = typeof User['columns'][number]

export default class UserService {
  public static async paginate(config: PaginateConfig<Columns>, columns: Columns[] = []): Promise<ModelPaginatorContract<User>> {
    try {
      return await User.query().select(columns).getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async get(id: User['id'], config: ServiceConfig<User> = {}): Promise<User> {
    let item: User | null

    try {
      item = await User.find(id, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.USER_NOT_FOUND } as Err

    try {
      if (config.relations) {
        for (const relationItem of config.relations) {
          await item.load(relationItem)
        }
      }

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async getByEmail(email: User['email'], config: ServiceConfig<User> = {}): Promise<User> {
    let item: User | null

    try {
      item = await User.findBy('email', email, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.USER_NOT_FOUND } as Err

    try {
      if (config.relations) {
        for (const relationItem of config.relations) {
          await item.load(relationItem)
        }
      }

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async create(payload: RegisterValidator['schema']['props'], { trx }: ServiceConfig<User> = {}): Promise<User> {
    try {
      return await User.create(payload, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  /**
   * * For API
   */

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
    } catch (err: Err | any) {
      throw err
    }

    if (payload.oldPassword) {
      if (!(await Hash.verify(user.password, payload.oldPassword)))
        throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.OLD_PASSWORD_INCORRECT } as Err
    }

    if (payload.avatar) {
      if (user.avatar) {
        await Drive.delete(user.$original.avatar)
      }

      await payload.avatar.moveToDisk('User')
      userPayload.avatar = `User/${payload.avatar.fileName}`
    }

    try {
      await user.merge(userPayload).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }

    try {
      return await this.get(id)
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async activate(token: string): Promise<void> {
    let payload: TokenUserPayload
    let user: User

    try {
      payload = TokenService.verifyToken<TokenUserPayload>(token, authConfig.emailVerify.key)
      user = await this.getByEmail(payload.email)
    } catch (err: Err | any) {
      throw err
    }

    if (user.isEmailVerified)
      throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.ACCOUNT_ALREADY_ACTIVATED } as Err

    try {
      await user.merge({ isEmailVerified: true }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  /**
   * * Wishlist
   */

  public static async getUserWishlist(userId: User['id'], config: ApiValidator['schema']['props']): Promise<JSONPaginate> {
    let user: User

    try {
      user = await this.get(userId)
    } catch (err: Err | any) {
      throw err
    }

    try {
      const wishlist: JSONPaginate = (await user.related('wishlist').query().getViaPaginate(config)).toJSON()

      wishlist.data = await Promise.all(wishlist.data.map(async (item: Video) => item.getForUser(userId)))

      return wishlist
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async addToWishlist(payload: ListValidator['schema']['props']): Promise<void> {
    let user: User

    try {
      user = await this.get(payload.userId)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await user.related('wishlist').attach([payload.videoId])
      await this.addToHistoryList(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async removeFromWishlist(payload: ListValidator['schema']['props']): Promise<void> {
    let user: User

    try {
      user = await this.get(payload.userId)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await user.related('wishlist').detach([payload.videoId])
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  /**
   * * Later list
   */

  public static async getUserLaterList(userId: User['id'], config: ApiValidator['schema']['props']): Promise<JSONPaginate> {
    let user: User

    try {
      user = await this.get(userId)
    } catch (err: Err | any) {
      throw err
    }

    try {
      const laterList: JSONPaginate = (await user.related('laterList').query().getViaPaginate(config)).toJSON()

      laterList.data = await Promise.all(laterList.data.map(async (item: Video) => item.getForUser(userId)))

      return laterList
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async addToLaterList(payload: ListValidator['schema']['props']): Promise<void> {
    let user: User

    try {
      user = await this.get(payload.userId)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await user.related('laterList').attach([payload.videoId])
      await this.addToHistoryList(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async removeFromLaterList(payload: ListValidator['schema']['props']): Promise<void> {
    let user: User

    try {
      user = await this.get(payload.userId)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await user.related('laterList').detach([payload.videoId])
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  /**
   * * History list
   */

  public static async getUserHistoryList(userId: User['id'], config: ApiValidator['schema']['props']): Promise<JSONPaginate> {
    let user: User

    try {
      user = await this.get(userId)
    } catch (err: Err | any) {
      throw err
    }

    try {
      const historyList: JSONPaginate = (await user
        .related('historyList')
        .query()
        .getViaPaginate(config))
        .toJSON()

      historyList.data = await Promise.all(historyList.data.map(async (item: Video) => item.getForUser(userId)))

      return historyList
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async addToHistoryList(payload: ListValidator['schema']['props'], safety: boolean = true): Promise<void> {
    let user: User

    try {
      user = await this.get(payload.userId)
    } catch (err: Err | any) {
      throw err
    }

    try {
      if (safety) {
        const isAlreadyInHistory: Video | null = await user.related('historyList').query().where('video_id', payload.videoId).first()

        if (isAlreadyInHistory) return
      }

      await user.related('historyList').attach([payload.videoId])
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }
}
