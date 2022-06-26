import Room from 'App/Models/Room/Room'
import User from 'App/Models/User/User'
import RoomService from 'App/Services/Room/RoomService'
import ResponseService from 'App/Services/ResponseService'
import RoomValidator from 'App/Validators/Room/RoomValidator'
import { Err } from 'Contracts/services'
import { RoomJoinPayload } from 'Contracts/room'
import { validator } from '@ioc:Adonis/Core/Validator'
import { ResponseCodes, ResponseMessages } from 'Config/response'

const roomValidator: RoomValidator = new RoomValidator()

export default class RoomsController {
  public static async create(userId: User['id'], request: any, cb: (result: Err | ResponseService) => void): Promise<Room['slug'] | void> {
    let payload: RoomValidator['schema']['props']

    try {
      payload = await validator.validate({
        data: request,
        schema: roomValidator.schema,
        messages: roomValidator.messages,
      })
    } catch (err: any) {
      return cb({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const slug: Room['slug'] = await RoomService.create(userId, payload)

      cb(new ResponseService(ResponseMessages.SUCCESS, slug))
      return slug
    } catch (err: Err | any) {
      return cb(err)
    }
  }

  public static async update(userId: User['id'], slug: Room['slug'], request: any, cb: (result: Err | ResponseService) => void): Promise<void | Room['isOpen']> {
    let payload: RoomValidator['schema']['props']

    try {
      payload = await validator.validate({
        data: request,
        schema: roomValidator.schema,
        messages: roomValidator.messages,
      })
    } catch (err: any) {
      return cb({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const isOpen: Room['isOpen'] = await RoomService.update(userId, slug, payload)

      cb(new ResponseService(ResponseMessages.SUCCESS, isOpen))
      return isOpen
    } catch (err: Err | any) {
      return cb(err)
    }
  }

  public static async delete(slug: Room['slug']): Promise<void> {
    try {
      await RoomService.delete(slug)
    } catch (err: Err | any) {}
  }

  public static async join(data: RoomJoinPayload, cb: (result: Err | ResponseService) => void): Promise<Room | void> {
    try {
      return await RoomService.joinAction(data, 'join')
    } catch (err: Err | any) {
      return cb(err)
    }
  }

  public static async unJoin(data: RoomJoinPayload, cb: (result: Err | ResponseService) => void): Promise<Room | void> {
    try {
      return await RoomService.joinAction(data, 'unJoin')
    } catch (err: Err | any) {
      return cb(err)
    }
  }

  public static async kickUser(roomSlug: Room['slug'], userId: User['id'], cb: (result: Err | ResponseService) => void): Promise<Room | void> {
    try {
      const room: Room = await RoomService.kickUser(roomSlug, userId)

      cb(new ResponseService(ResponseMessages.SUCCESS, userId))
      return room
    } catch (err: Err | any) {
      return cb(err)
    }
  }

  public static async disconnectUnJoin(data: RoomJoinPayload): Promise<Room | void> {
    try {
      return await RoomService.joinAction(data, 'unJoin')
    } catch (err: Err | any) {}
  }
}
