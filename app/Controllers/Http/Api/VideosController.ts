import Video from 'App/Models/Video/Video'
import VideoService from 'App/Services/Video/VideoService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import NewestValidator from 'App/Validators/Video/NewestValidator'
import SearchValidator from 'App/Validators/Video/SearchValidator'
import PopularValidator from 'App/Validators/Video/PopularValidator'
import { Error } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelObject, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

export default class VideosController {
  public async search({ request, response }: HttpContextContract) {
    let payload: SearchValidator['schema']['props']

    try {
      payload = await request.validate(SearchValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const videos: ModelPaginatorContract<Video> = await VideoService.search(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, videos))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async get({ params, response }: HttpContextContract) {
    const slug: Video['slug'] = params.slug

    try {
      let item: Video = await VideoService.getBySlug(slug, { relations: ['genres'] })
      item = await VideoService.incrementViewsCount(item)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item.serializeForSinglePage()))
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
      const data: ModelObject[] = await VideoService.getNewest(payload)

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
      const data: ModelObject[] = await VideoService.getPopular(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, data))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
