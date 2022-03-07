import Video from 'App/Models/Video'
import VideoService from 'App/Services/Video/VideoService'
import VideoValidator from 'App/Validators/Video/VideoValidator'
import { Error } from 'Contracts/services'
import { ResponseMessages } from 'Config/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VideosController {
  public async index({ response, view, session, route, request }: HttpContextContract) {
    try {
      const baseURL: string = route!.pattern
      const page: number = request.input('page', 1)

      const columns: typeof Video.columns[number][] = ['id', 'slug', 'name', 'description', 'released', 'country', 'rating', 'poster']
      const videos: Video[] = await VideoService.paginate({ baseURL, page }, columns)

      return view.render('pages/videos/index', { videos })
    } catch (err: Error | any) {
      session.flash('error', err.msg)
      return response.redirect().back()
    }
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages/videos/create')
  }

  public async store({ session, response, request }: HttpContextContract) {
    const payload = await request.validate(VideoValidator)

    try {
      await VideoService.create(payload)

      session.flash('success', ResponseMessages.VIDEO_CREATED)
      return response.redirect().toRoute('videos.index')
    } catch (err: Error | any) {
      session.flash('error', err.msg)
      return response.redirect().back()
    }
  }

  public async show({ session, response, view, params }: HttpContextContract) {
    const id: Video['id'] = params.id

    try {
      const item: Video = await VideoService.get(id)

      return view.render('pages/videos/show', { item })
    } catch (err: Error | any) {
      session.flash('error', err.msg)
      return response.redirect().back()
    }
  }

  public async edit({ params, session, view, response }: HttpContextContract) {
    const id: Video['id'] = params.id

    try {
      const item: Video = await VideoService.get(id)

      return view.render('pages/videos/edit', { item })
    } catch (err: Error | any) {
      session.flash('error', err.msg)
      return response.redirect().back()
    }
  }

  public async update({ params, session, response, request }: HttpContextContract) {
    const id: Video['id'] = params.id
    const payload = await request.validate(VideoValidator)

    try {
      await VideoService.update(id, payload)

      session.flash('success', ResponseMessages.VIDEO_UPDATED)
      return response.redirect().toRoute('videos.index')
    } catch (err: Error | any) {
      session.flash('error', err.msg)
      return response.redirect().back()
    }
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const id: Video['id'] = params.id

    try {
      await VideoService.delete(id)

      session.flash('success', ResponseMessages.VIDEO_DELETED)
    } catch (err: Error | any) {
      session.flash('error', err.msg)
    }

    return response.redirect().back()
  }
}
