import Room from 'App/Models/Room/Room'
import RoomService from './RoomService'
import Logger from '@ioc:Adonis/Core/Logger'
import RoomMessage from 'App/Models/Room/RoomMessage'
import ApiValidator from 'App/Validators/ApiValidator'
import RoomMessageValidator from 'App/Validators/Room/RoomMessageValidator'
import { Err } from 'Contracts/services'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Config/response'

type Columns = typeof RoomMessage['columns'][number]

export default class RoomMessageService {
  public static async paginate(roomSlug: Room['slug'], config: ApiValidator['schema']['props'], columns: Columns[] = []): Promise<ModelPaginatorContract<RoomMessage>> {
    let room: Room

    try {
      room = await RoomService.getBySlug(roomSlug)
    } catch (err: Err | any) {
      throw err
    }

    try {
      const messages: ModelPaginatorContract<RoomMessage> = await room
        .related('messages')
        .query()
        .select(columns)
        .getViaPaginate(config)

      return messages
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }

  public static async create(payload: RoomMessageValidator['schema']['props']): Promise<RoomMessage> {
    let id: RoomMessage['id']

    try {
      const item: RoomMessage = await RoomMessage.create(payload)

      id = item.id
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

  /**
   * * Private methods
   */

  private static async get(id: RoomMessage['id']): Promise<RoomMessage> {
    let item: RoomMessage | null

    try {
      item = await RoomMessage.find(id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.ERROR } as Err

    return item
  }
}
