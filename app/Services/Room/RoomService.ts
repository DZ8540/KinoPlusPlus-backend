import roomConfig from 'Config/room'
import User from 'App/Models/User/User'
import Room from 'App/Models/Room/Room'
import Video from 'App/Models/Video/Video'
import Logger from '@ioc:Adonis/Core/Logger'
import UserService from '../User/UserService'
import VideoService from '../Video/VideoService'
import RoomValidator from 'App/Validators/Room/RoomValidator'
import VideoSearchValidator from 'App/Validators/Video/VideoSearchValidator'
import { RoomJoinPayload } from 'Contracts/room'
import { Err, ServiceConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { JSONPaginate, PaginationConfig } from 'Contracts/database'
import { ModelAttributes, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

export default class RoomService {
  public static async getBySlug(slug: Room['slug'], config: ServiceConfig<Room> = {}): Promise<Room> {
    let item: Room | null

    try {
      item = await Room.findBy('slug', slug, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.ERROR } as Err

    try {
      if (config.relations) {
        for (const relation of config.relations) {
          await item.load(relation)
        }
      }

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async create(userId: User['id'], payload: RoomValidator['schema']['props']): Promise<Room['slug']> {
    let user: User
    let video: Video

    try {
      user = await UserService.get(userId)
      video = await VideoService.get(payload.videoId)
    } catch (err: Err | any) {
      throw err
    }

    try {
      const roomSlug: string = `${user.nickname}-${video.slug}`
      const roomPayload: Partial<ModelAttributes<Room>> = {
        slug: roomSlug,
        isOpen: payload.isOpen,
        videoId: video.id,
      }

      return (await Room.create(roomPayload)).slug
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async update(userId: User['id'],slug: Room['slug'], { isOpen }: RoomValidator['schema']['props']): Promise<Room['isOpen']> {
    let item: Room

    try {
      item = await this.getBySlug(slug)

      if (item.creator[0].id != userId)
        throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.ERROR } as Err
    } catch (err: Err | any) {
      throw err
    }

    try {
      item = await item.merge({ isOpen }).save()
      return item.isOpen
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async delete(slug: Room['slug']): Promise<void> {
    let item: Room

    try {
      item = await this.getBySlug(slug)
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

  public static async joinAction(data: RoomJoinPayload, action: 'join' | 'unJoin'): Promise<Room> {
    let room: Room

    try {
      room = await this.getBySlug(data.roomSlug)
    } catch (err: Err | any) {
      throw err
    }

    if (
      action == 'join' &&
      room.usersCount! >= roomConfig.usersCount
    ) throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.ROOM_USERS_COUNT } as Err

    try {
      if (action == 'join')
        await room.related('users').attach({ [data.userId]: { isCreator: data.isCreator } })
      else
        await room.related('users').detach([data.userId])
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }

    try {
      return await this.getBySlug(data.roomSlug)
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async search(config: VideoSearchValidator['schema']['props']): Promise<ModelPaginatorContract<Room>> {
    let videosIds: Video['id'][]
    const paginateConfig: PaginationConfig = {
      page: config.page,
      limit: config.limit,
      orderBy: config.orderBy,
    }

    try {
      const videos: JSONPaginate = await VideoService.search(config)
      videosIds = videos.data.map(({ id }: Video) => id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      return await Room
        .query()
        .withScopes((scopes) => scopes.opened())
        .whereIn('video_id', videosIds)
        .getViaPaginate(paginateConfig)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async kickUser(roomSlug: Room['slug'], userId: User['id']): Promise<Room> {
    let room: Room

    try {
      room = await this.getBySlug(roomSlug)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await room.related('users').detach([userId])
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }

    try {
      return await this.getBySlug(roomSlug)
    } catch (err: Err | any) {
      throw err
    }
  }
}
