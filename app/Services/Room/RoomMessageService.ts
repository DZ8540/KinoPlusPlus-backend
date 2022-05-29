import Room from 'App/Models/Room/Room'
import RoomService from './RoomService'
import Video from 'App/Models/Video/Video'
import Logger from '@ioc:Adonis/Core/Logger'
import VideoService from '../Video/VideoService'
import RoomMessage from 'App/Models/Room/RoomMessage'
import ApiValidator from 'App/Validators/ApiValidator'
import RoomMessageValidator from 'App/Validators/Room/RoomMessageValidator'
import { Error } from 'Contracts/services'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Config/response'

type Columns = typeof RoomMessage['columns'][number]
type ReturnPaginateData = {
  messages: ModelPaginatorContract<RoomMessage>,
  video: Video,
}

export default class RoomMessageService {
  public static async paginate(roomSlug: Room['slug'], config: ApiValidator['schema']['props'], columns: Columns[] = []): Promise<ReturnPaginateData> {
    let room: Room
    let video: Video

    try {
      room = await RoomService.get(roomSlug)
      video = await VideoService.get(room.videoId)
    } catch (err: Error | any) {
      throw err
    }

    try {
      const messages: ModelPaginatorContract<RoomMessage> = await room
        .related('messages')
        .query()
        .select(columns)
        .getViaPaginate(config)

      return { messages, video }
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async create(payload: RoomMessageValidator['schema']['props']): Promise<RoomMessage> {
    try {
      return await RoomMessage.create(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }
}
