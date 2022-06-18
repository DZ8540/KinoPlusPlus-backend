import User from 'App/Models/User/User'
import Room from 'App/Models/Room/Room'
import Video from 'App/Models/Video/Video'
import Logger from '@ioc:Adonis/Core/Logger'
import UserService from '../User/UserService'
import VideoService from '../Video/VideoService'
import ApiValidator from 'App/Validators/ApiValidator'
import RoomValidator from 'App/Validators/Room/RoomValidator'
import { Err } from 'Contracts/services'
import { JoinRoomData } from 'Contracts/room'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { ModelAttributes, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

type Columns = typeof Room['columns'][number]

export default class RoomService {
  public static async paginate(config: ApiValidator['schema']['props'], columns: Columns[] = []): Promise<ModelPaginatorContract<Room>> {
    try {
      return await Room
        .query()
        .select(columns)
        .withScopes((scopes) => scopes.opened())
        .getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async get(slug: Room['slug']): Promise<Room> {
    let item: Room | null

    try {
      item = await Room.findBy('slug', slug)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.ERROR } as Err

    return item
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
      item = await this.get(slug)

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
      item = await this.get(slug)
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

  public static async joinAction(data: JoinRoomData, action: 'join' | 'unJoin'): Promise<Room> {
    let room: Room

    try {
      room = await this.get(data.roomSlug)
    } catch (err: Err | any) {
      throw err
    }

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
      return await this.get(data.roomSlug)
    } catch (err: Err | any) {
      throw err
    }
  }
}
