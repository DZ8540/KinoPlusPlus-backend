import Video from 'App/Models/Video'
import VideoService from 'App/Services/Video/VideoService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import NewestValidator from 'App/Validators/Video/NewestValidator'
import PopularValidator from 'App/Validators/Video/PopularValidator'
import { Error } from 'Contracts/services'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VideosController {
  public async get({ params, response }: HttpContextContract) {
    let slug: Video['slug'] = params.slug

    try {
      let item: Video = await VideoService.getBySlug(slug)
      item = await VideoService.incrementViewsCount(item)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item.serialize()))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

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
      let data: ModelObject[] = await VideoService.getNewest(payload)

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
      let data: ModelObject[] = await VideoService.getPopular(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, data))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
