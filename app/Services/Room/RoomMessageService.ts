import Room from 'App/models/Room/Room'
import RoomService from './RoomService'
import Logger from '@ioc:Adonis/Core/Logger'
import RoomMessage from 'App/Models/Room/RoomMessage'
import ApiValidator from 'App/Validators/ApiValidator'
import RoomMessageValidator from 'App/Validators/Room/RoomMessageValidator'
import { Error } from 'Contracts/services'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Config/response'

type Columns = typeof RoomMessage['columns'][number]

export default class RoomMessageService {
  public static async paginate(roomSlug: Room['slug'], config: ApiValidator['schema']['props'], columns: Columns[] = []): Promise<ModelPaginatorContract<RoomMessage>> {
    let room: Room

    try {
      room = await RoomService.get(roomSlug)
    } catch (err: Error | any) {
      throw err
    }

    try {
      return await room
        .related('messages')
        .query()
        .select(columns)
        .getViaPaginate(config)
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
