import User from 'App/Models/User/User'
import Video from 'App/Models/Video/Video'
import Logger from '@ioc:Adonis/Core/Logger'
import VideoValidator from 'App/Validators/Video/VideoValidator'
import NewestValidator from 'App/Validators/Video/NewestValidator'
import PopularValidator from 'App/Validators/Video/PopularValidator'
import VideoSearchValidator from 'App/Validators/Video/VideoSearchValidator'
import { JSONPaginate } from 'Contracts/database'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { Err, PaginateConfig, ServiceConfig } from 'Contracts/services'
import { ModelObject, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

type Columns = typeof Video['columns'][number]
type Payload = VideoValidator['schema']['props']
type NewestPayload = NewestValidator['schema']['props']
type PopularPayload = PopularValidator['schema']['props']

export default class VideoService {
  public static async paginate(config: PaginateConfig<Columns>, columns: Columns[] = []): Promise<ModelPaginatorContract<Video>> {
    try {
      return await Video.query().select(columns).getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async get(id: Video['id'], config: ServiceConfig<Video> = {}): Promise<Video> {
    let item: Video | null

    try {
      item = await Video.find(id, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.VIDEO_NOT_FOUND } as Err

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

  public static async getBySlug(slug: Video['slug'], config: ServiceConfig<Video> = {}): Promise<Video> {
    let item: Video | null

    try {
      item = await Video.findBy('slug', slug, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.VIDEO_NOT_FOUND } as Err

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

  public static async create(payload: Payload): Promise<Video> {
    try {
      return await Video.create(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async update(id: Video['id'], payload: Payload, config: ServiceConfig<Video> = {}): Promise<Video> {
    let item: Video

    try {
      item = await this.get(id, config)
    } catch (err: Err | any) {
      throw err
    }

    try {
      return await item.merge(payload).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async delete(id: Video['id'], config: ServiceConfig<Video> = {}): Promise<void> {
    let item: Video

    try {
      item = await this.get(id, config)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async incrementViewsCount(item: Video): Promise<Video> {
    const viewsCount: number = ++item.viewsCount

    try {
      return await item.merge({ viewsCount }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async getNewest(payload: NewestPayload, currentUserId?: User['id']): Promise<ModelObject[]> {
    if (!payload.limit)
      payload.limit = 10

    try {
      const pagination: JSONPaginate = (await this.paginate({ page: 1, limit: payload.limit, orderByColumn: 'released', orderBy: 'desc' })).toJSON()

      if (currentUserId)
        pagination.data = await Promise.all(pagination.data.map(async (item: Video) => item.getForUser(currentUserId)))

      return pagination.data
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async getPopular(payload: PopularPayload, currentUserId?: User['id']): Promise<ModelObject[]> {
    if (!payload.limit)
      payload.limit = 20

    try {
      const pagination: JSONPaginate = (await this
        .paginate(
          {
            page: 1,
            limit: payload.limit,
            orderByColumn: 'viewsCount',
            orderBy: 'desc'
          }
        ))
        .toJSON()

      if (currentUserId)
        pagination.data = await Promise.all(pagination.data.map(async (item: Video) => item.getForUser(currentUserId)))

      return pagination.data
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async search(payload: VideoSearchValidator['schema']['props'], currentUserId?: User['id']): Promise<JSONPaginate> {
    let query = Video.query()

    if (!payload.limit)
      payload.limit = 20

    try {
      let videos: JSONPaginate

      for (const key in payload) {
        switch (key) {
          case 'videoName':
            console.log(payload[key])
            query = query.where('name', 'ilike', `%${payload[key]}%`)

            break

          case 'genres':

            if (payload[key]) {
              for (const genreId of payload[key]!) {

                query = query.orWhereHas('genres', (query) => {
                  query.where('genre_id', genreId)
                })

              }
            }

            break
          default:

            break
        }
      }

      videos = (await query.getViaPaginate(payload)).toJSON()

      if (currentUserId)
        videos.data = await Promise.all(videos.data.map(async (item: Video) => item.getForUser(currentUserId)))

      return videos
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }
}
