import Room from 'App/Models/Room/Room'
import RoomService from 'App/Services/Room/RoomService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import VideoSearchValidator from 'App/Validators/Video/VideoSearchValidator'
import { Err } from 'Contracts/services'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RoomsController {
  public async search({ request, response }: HttpContextContract) {
    let payload: VideoSearchValidator['schema']['props']

    try {
      payload = await request.validate(VideoSearchValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const rooms: ModelPaginatorContract<Room> = await RoomService.search(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, rooms))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
