import { Error } from 'Contracts/services'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NewestValidator from 'App/Validators/Video/NewestValidator'
import ExceptionService from 'App/Services/ExceptionService'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import Video from 'App/Models/Video'
import VideoService from 'App/Services/VideoService'
import ResponseService from 'App/Services/ResponseService'
import PopularValidator from 'App/Validators/Video/PopularValidator'

export default class VideosController {
  public async getNewest({ request, response }: HttpContextContract) {
    let payload: NewestValidator['schema']['props']

    try {
      payload = await request.validate(NewestValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      } as Error)
    }

    try {
      let data: Video[] = await VideoService.getNewest(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, data))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async getPopular({ request, response }: HttpContextContract) {
    let payload: PopularValidator['schema']['props']

    try {
      payload = await request.validate(PopularValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      } as Error)
    }

    try {
      let data: Video[] = await VideoService.getPopular(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, data))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
