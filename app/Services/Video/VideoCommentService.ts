import Video from 'App/Models/Video/Video'
import Logger from '@ioc:Adonis/Core/Logger'
import VideoComment from 'App/Models/Video/VideoComment'
import VideoCommentValidator from 'App/Validators/Video/VideoCommentValidator'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { Err, PaginateConfig, ServiceConfig } from 'Contracts/services'

type Columns = typeof VideoComment['columns'][number]

export default class VideoCommentService {
  public static async getVideoComments(videoId: Video['id'], config: PaginateConfig<Columns>): Promise<ModelPaginatorContract<VideoComment>> {
    try {
      return await VideoComment
        .query()
        .where('video_id', videoId)
        .getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async create(payload: VideoCommentValidator['schema']['props']): Promise<VideoComment> {
    try {
      const item: VideoComment = await VideoComment.create(payload)
      await item.load('user')

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async update(id: VideoComment['id'], { description }: VideoCommentValidator['schema']['props'], config: ServiceConfig<VideoComment> = {}): Promise<VideoComment> {
    let item: VideoComment

    try {
      item = await this.get(id, config)
    } catch (err: Err | any) {
      throw err
    }

    try {
      item = await item.merge({ description }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }

    try {
      return await this.get(item.id, config)
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async delete(id: VideoComment['id'], config: ServiceConfig<VideoComment> = {}): Promise<void> {
    let item: VideoComment

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

  /**
   * * Private methods
   */

  public static async get(id: VideoComment['id'], config: ServiceConfig<VideoComment> = {}): Promise<VideoComment> {
    let item: VideoComment | null

    try {
      item = await VideoComment.find(id, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.VIDEO_COMMENT_NOT_FOUND } as Err

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
}
