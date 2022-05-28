import User from 'App/Models/User/User'
import Room from 'App/models/Room/Room'
import Video from 'App/Models/Video/Video'
import Logger from '@ioc:Adonis/Core/Logger'
import UserService from '../User/UserService'
import VideoService from '../Video/VideoService'
import ApiValidator from 'App/Validators/ApiValidator'
import RoomValidator from 'App/Validators/Room/RoomValidator'
import { Error } from 'Contracts/services'
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
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async create(payload: RoomValidator['schema']['props']): Promise<Room['slug']> {
    let user: User
    let video: Video

    try {
      user = await UserService.get(payload.userId)
      video = await VideoService.get(payload.videoId)
    } catch (err: Error | any) {
      throw err
    }

    try {
      const slug: string = `${user.nickname}-${video.slug}`
      const roomPayload: Partial<ModelAttributes<Room>> = {
        slug,
        isOpen: payload.isOpen,
        userId: user.id,
        videoId: video.id,
      }

      const room: Room = await Room.create(roomPayload)
      return room.slug
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async update(slug: Room['slug'], { isOpen }: RoomValidator['schema']['props']): Promise<Room['isOpen']> {
    let item: Room

    try {
      item = await this.get(slug)
    } catch (err: Error | any) {
      throw err
    }

    try {
      item = await item.merge({ isOpen }).save()
      return item.isOpen
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(slug: Room['slug']): Promise<void> {
    let item: Room

    try {
      item = await this.get(slug)
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

  public static async get(slug: Room['slug']): Promise<Room> {
    let item: Room | null

    try {
      item = await Room.findBy('slug', slug)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.ERROR } as Error

    return item
  }
}
