import User from 'App/Models/User/User'
import Video from 'App/Models/Video/Video'
import VideoService from 'App/Services/Video/VideoService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import NewestValidator from 'App/Validators/Video/NewestValidator'
import SearchValidator from 'App/Validators/Video/SearchValidator'
import PopularValidator from 'App/Validators/Video/PopularValidator'
import { Error } from 'Contracts/services'
import { JSONPaginate } from 'Contracts/database'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VideosController {
  public async search({ request, params, response }: HttpContextContract) {
    let payload: SearchValidator['schema']['props']
    const currentUserId: User['id'] | undefined = params.currentUserId

    try {
      payload = await request.validate(SearchValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const videos: JSONPaginate = await VideoService.search(payload, currentUserId)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, videos))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async get({ params, response }: HttpContextContract) {
    const slug: Video['slug'] = params.slug
    const currentUserId: User['id'] | undefined = params.currentUserId

    try {
      let item: Video | ModelObject = await VideoService.getBySlug(slug, { relations: ['genres'] })

      item = await VideoService.incrementViewsCount(item as Video)
      if (currentUserId)
        item = await item.getForUser(currentUserId)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async getNewest({ request, params, response }: HttpContextContract) {
    let payload: NewestValidator['schema']['props']
    const currentUserId: User['id'] | undefined = params.currentUserId

    try {
      payload = await request.validate(NewestValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      } as Error)
    }

    try {
      const data: ModelObject[] = await VideoService.getNewest(payload, currentUserId)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, data))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async getPopular({ request, params, response }: HttpContextContract) {
    let payload: PopularValidator['schema']['props']
    const currentUserId: User['id'] | undefined = params.currentUserId

    try {
      payload = await request.validate(PopularValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      } as Error)
    }

    try {
      const data: ModelObject[] = await VideoService.getPopular(payload, currentUserId)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, data))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
