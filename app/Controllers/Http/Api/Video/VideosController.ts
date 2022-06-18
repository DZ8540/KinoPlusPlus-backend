import User from 'App/Models/User/User'
import Room from 'App/Models/Room/Room'
import Video from 'App/Models/Video/Video'
import UserService from 'App/Services/User/UserService'
import VideoService from 'App/Services/Video/VideoService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import ListValidator from 'App/Validators/User/ListValidator'
import NewestValidator from 'App/Validators/Video/NewestValidator'
import SearchValidator from 'App/Validators/Video/SearchValidator'
import PopularValidator from 'App/Validators/Video/PopularValidator'
import { Err } from 'Contracts/services'
import { JSONPaginate } from 'Contracts/database'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelObject, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

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
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async get({ params, response }: HttpContextContract) {
    const slug: Video['slug'] = params.slug
    const currentUserId: User['id'] | undefined = params.currentUserId

    try {
      let item: Video | ModelObject = await VideoService.getBySlug(slug, { relations: ['genres'] })

      item = await VideoService.incrementViewsCount(item as Video)
      await item.load('rooms', (query: ModelQueryBuilderContract<typeof Room>) => {
        query
          .withScopes((scopes) => scopes.opened())
          .limit(3)
      })

      if (currentUserId) {
        const historyListPayload: ListValidator['schema']['props'] = {
          userId: currentUserId,
          videoId: item.id,
        }

        await UserService.addToHistoryList(historyListPayload)
        item = await item.getForUser(currentUserId)
      }

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Err | any) {
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
      } as Err)
    }

    try {
      const data: ModelObject[] = await VideoService.getNewest(payload, currentUserId)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, data))
    } catch (err: Err | any) {
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
      } as Err)
    }

    try {
      const data: ModelObject[] = await VideoService.getPopular(payload, currentUserId)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, data))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
