import Room from 'App/Models/Room/Room'
import User from 'App/Models/User/User'
import RoomService from 'App/Services/Room/RoomService'
import ResponseService from 'App/Services/ResponseService'
import RoomValidator from 'App/Validators/Room/RoomValidator'
import { Err } from 'Contracts/services'
import { JoinRoomData } from 'Contracts/room'
import { validator } from '@ioc:Adonis/Core/Validator'
import { ResponseCodes, ResponseMessages } from 'Config/response'
// import ApiValidator from 'App/Validators/ApiValidator'
// import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// const apiValidator: ApiValidator = new ApiValidator()
const roomValidator: RoomValidator = new RoomValidator()

export default class RoomsController {
  // public async paginate(request: any, cb: (result: Err | ResponseService) => void) {
  //   let config: ApiValidator['schema']['props']

  //   try {
  //     config = await validator.validate({
  //       data: request,
  //       schema: apiValidator.schema,
  //       messages: apiValidator.messages,
  //     })
  //   } catch (err: any) {
  //     return cb({
  //       code: ResponseCodes.VALIDATION_ERROR,
  //       msg: ResponseMessages.VALIDATION_ERROR,
  //       errors: err.messages,
  //     })
  //   }

  //   try {
  //     const rooms: ModelPaginatorContract<Room> = await RoomService.paginate(config)

  //     return cb(new ResponseService(ResponseMessages.SUCCESS, rooms))
  //   } catch (err: Err | any) {
  //     return cb(err)
  //   }
  // }

  // public async search({ request, response }: HttpContextContract) {}

  /**
   * * Socket
   */

  public static async create(userId: User['id'], request: any, cb: (result: Err | ResponseService) => void) {
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

  public static async delete(slug: Room['slug']) {
    try {
      await RoomService.delete(slug)
    } catch (err: Err | any) {}
  }

  public static async join(data: JoinRoomData, cb: (result: Err | ResponseService) => void): Promise<Room | void> {
    try {
      return await RoomService.joinAction(data, 'join')
    } catch (err: Err | any) {
      return cb(err)
    }
  }

  public static async unJoin(data: JoinRoomData, cb: (result: Err | ResponseService) => void): Promise<Room | void> {
    try {
      return await RoomService.joinAction(data, 'unJoin')
    } catch (err: Err | any) {
      return cb(err)
    }
  }

  public static async disconnectUnJoin(data: JoinRoomData): Promise<Room | void> {
    try {
      return await RoomService.joinAction(data, 'unJoin')
    } catch (err: Err | any) {}
  }
}
