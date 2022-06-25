import Room from 'App/Models/Room/Room'
import RoomMessage from 'App/Models/Room/RoomMessage'
import ApiValidator from 'App/Validators/ApiValidator'
import ResponseService from 'App/Services/ResponseService'
import RoomMessageService from 'App/Services/Room/RoomMessageService'
import RoomMessageValidator from 'App/Validators/Room/RoomMessageValidator'
import { Err } from 'Contracts/services'
import { validator } from '@ioc:Adonis/Core/Validator'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Config/response'

const apiValidator: ApiValidator = new ApiValidator()
const roomMessageValidator: RoomMessageValidator = new RoomMessageValidator()

export default class RoomsMessagesController {
  public static async paginate(slug: Room['slug'], request: any, cb: (result: Err | ResponseService) => void): Promise<void> {
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
      const messages: ModelPaginatorContract<RoomMessage> = await RoomMessageService.paginate(slug, config)

      return cb(new ResponseService(ResponseMessages.SUCCESS, messages))
    } catch (err: Err | any) {
      return cb(err)
    }
  }

  public static async sendMessage(request: any, cb: (result: Err | ResponseService) => void): Promise<void | RoomMessage> {
    let payload: RoomMessageValidator['schema']['props']

    try {
      payload = await validator.validate({
        data: request,
        schema: roomMessageValidator.schema,
        messages: roomMessageValidator.messages,
      })
    } catch (err: any) {
      return cb({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const message: RoomMessage = await RoomMessageService.create(payload)

      cb(new ResponseService(ResponseMessages.SUCCESS, message))
      return message
    } catch (err: Err | any) {
      return cb(err)
    }
  }
}
