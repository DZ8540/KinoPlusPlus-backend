import VideoSyncService from 'App/Services/Video/VideoSyncService'
import { Error } from 'Contracts/services'
import { ResponseMessages } from 'Config/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MainsController {
  public async index({ view }: HttpContextContract) {
    return view.render('pages/index')
  }

  public async syncVideos({ view }: HttpContextContract) {
    return view.render('pages/syncVideos')
  }

  public async syncVideosAction({ response, session }: HttpContextContract) {
    try {
      await VideoSyncService.sync()

      session.flash('success', ResponseMessages.SUCCESS_SYNC_VIDEOS)
    } catch (err: Error | any) {
      session.flash('error', err.msg)
    }

    return response.redirect().back()
  }
}
