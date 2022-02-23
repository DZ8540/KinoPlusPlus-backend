import Video from 'App/Models/Video'
import Logger from '@ioc:Adonis/Core/Logger'
import VideoValidator from 'App/Validators/Video/VideoValidator'
import NewestValidator from 'App/Validators/Video/NewestValidator'
import PopularValidator from 'App/Validators/Video/PopularValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { Error, PaginateConfig, ServiceConfig } from 'Contracts/services'

type VideoColumns = typeof Video['columns'][number]
type VideoPayload = VideoValidator['schema']['props']
type NewestPayload = NewestValidator['schema']['props']
type PopularPayload = PopularValidator['schema']['props']

export default class VideoService {
  public static async paginate(config: PaginateConfig<VideoColumns>, columns: VideoColumns[] = []): Promise<Video[]> {
    try {
      return await Video.query().select(columns).getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async get(id: Video['id'], config: ServiceConfig<Video> = {}): Promise<Video> {
    let item: Video | null

    try {
      item = await Video.find(id, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.VIDEO_NOT_FOUND } as Error

    try {
      if (config.relations) {
        for (let relationItem of config.relations) {
          await item.load(relationItem)
        }
      }

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async create(payload: VideoPayload): Promise<Video> {
    try {
      return await Video.create(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async update(id: Video['id'], payload: VideoPayload, config: ServiceConfig<Video> = {}): Promise<Video> {
    let item: Video

    try {
      item = await this.get(id, config)
    } catch (err: Error | any) {
      throw err
    }

    try {
      return await item.merge(payload).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(id: Video['id'], config: ServiceConfig<Video> = {}): Promise<void> {
    let item: Video

    try {
      item = await this.get(id, config)
    } catch (err: Error | any) {
      throw err
    }

    try {
      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async incrementViewsCount(item: Video): Promise<Video> {
    let viewsCount: number = ++item.viewsCount

    try {
      return await item.merge({ viewsCount }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async getNewest(payload: NewestPayload): Promise<Video[]> {
    if (!payload.limit)
      payload.limit = 10

    try {
      return await this.paginate({ page: 1, limit: payload.limit, orderByColumn: 'released', orderBy: 'desc' })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async getPopular(payload: PopularPayload): Promise<Video[]> {
    if (!payload.limit)
      payload.limit = 20

    try {
      return await this.paginate({ page: 1, limit: payload.limit, orderByColumn: 'viewsCount', orderBy: 'desc' })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }
}
