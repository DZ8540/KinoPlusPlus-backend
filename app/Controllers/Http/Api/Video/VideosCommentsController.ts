import Video from 'App/Models/Video/Video'
import ApiValidator from 'App/Validators/ApiValidator'
import VideoComment from 'App/Models/Video/VideoComment'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import VideoCommentService from 'App/Services/Video/VideoCommentService'
import VideoCommentValidator from 'App/Validators/Video/VideoCommentValidator'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VideosCommentsController {
  public async paginate({ request, params, response }: HttpContextContract) {
    let config: ApiValidator['schema']['props']
    const videoId: Video['id'] = params.videoId

    try {
      config = await request.validate(ApiValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const comments: ModelPaginatorContract<VideoComment> = await VideoCommentService.getVideoComments(videoId, config)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, comments))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async create({ response, request }: HttpContextContract) {
    let payload: VideoCommentValidator['schema']['props']

    try {
      payload = await request.validate(VideoCommentValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const item: VideoComment = await VideoCommentService.create(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    let payload: VideoCommentValidator['schema']['props']
    const id: VideoComment['id'] = params.id

    try {
      payload = await request.validate(VideoCommentValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const item: VideoComment = await VideoCommentService.update(id, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async delete({ params, response }: HttpContextContract) {
    const id: VideoComment['id'] = params.id

    try {
      await VideoCommentService.delete(id)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
