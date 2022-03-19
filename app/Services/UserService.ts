import User from 'App/Models/User'
import Logger from '@ioc:Adonis/Core/Logger'
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
      throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.VIDEO_NOT_FOUND } as Error

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
}
