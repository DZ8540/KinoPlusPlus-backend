import Room from 'App/Models/Room/Room'
import Video from 'App/Models/Video/Video'
import RoomMessage from 'App/Models/Room/RoomMessage'
import ApiValidator from 'App/Validators/ApiValidator'
import RoomService from 'App/Services/Room/RoomService'
import ResponseService from 'App/Services/ResponseService'
import RoomValidator from 'App/Validators/Room/RoomValidator'
import RoomMessageService from 'App/Services/Room/RoomMessageService'
import { Error } from 'Contracts/services'
import { validator } from '@ioc:Adonis/Core/Validator'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Config/response'
// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

const apiValidator: ApiValidator = new ApiValidator()
const roomValidator: RoomValidator = new RoomValidator()

export default class RoomsController {
  // public async search({ request, response }: HttpContextContract) {

  // }

  /**
   * * Socket
   */

  public static async paginate(request: any, cb: (result: Error | ResponseService) => void) {
    let config: ApiValidator['schema']['props']

    try {
      config = await validator.validate({
        data: request,
        schema: apiValidator.schema,
        messages: apiValidator.messages,
      })
    } catch (err: any) {
      return cb({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const rooms: ModelPaginatorContract<Room> = await RoomService.paginate(config)

      return cb(new ResponseService(ResponseMessages.SUCCESS, rooms))
    } catch (err: Error | any) {
      return cb(err)
    }
  }

  public static async create(request: any, cb: (result: Error | ResponseService) => void) {
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
      const slug: Room['slug'] = await RoomService.create(payload)

      cb(new ResponseService(ResponseMessages.SUCCESS, slug))
      return slug
    } catch (err: Error | any) {
      return cb(err)
    }
  }

  public static async update(slug: Room['slug'], request: any, cb: (result: Error | ResponseService) => void): Promise<void | Room['isOpen']> {
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
      const isOpen: Room['isOpen'] = await RoomService.update(slug, payload)

      cb(new ResponseService(ResponseMessages.SUCCESS))
      return isOpen
    } catch (err: Error | any) {
      return cb(err)
    }
  }

  public static async delete(slug: Room['slug']) {
    try {
      await RoomService.delete(slug)
    } catch (err: Error | any) {}
  }

  public static async join(slug: Room['slug'], request: any, cb: (result: Error | ResponseService) => void): Promise<{ messages: ModelPaginatorContract<RoomMessage>, video: Video } | void> {
    let config: ApiValidator['schema']['props']

    try {
      config = await validator.validate({
        data: request,
        schema: apiValidator.schema,
        messages: apiValidator.messages,
      })
    } catch (err: any) {
      return cb({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      return await RoomMessageService.paginate(slug, config)
    } catch (err: Error | any) {
      return cb(err)
    }
  }
}
