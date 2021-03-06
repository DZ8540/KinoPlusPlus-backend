import Genre from 'App/Models/Video/Genre'
import GenreService from 'App/Services/GenreService'
import GenreValidator from 'App/Validators/GenreValidator'
import { Err } from 'Contracts/services'
import { ResponseMessages } from 'Config/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GenresController {
  public async index({ response, view, session }: HttpContextContract) {
    try {
      const genres: Genre[] = await GenreService.getAll()

      return view.render('pages/genres/index', { genres })
    } catch (err: Err | any) {
      session.flash('error', err.msg)
      return response.redirect().back()
    }
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages/genres/create')
  }

  public async store({ session, response, request }: HttpContextContract) {
    const payload = await request.validate(GenreValidator)

    try {
      await GenreService.create(payload)

      session.flash('success', ResponseMessages.GENRE_CREATED)
      return response.redirect().toRoute('genres.index')
    } catch (err: Err | any) {
      session.flash('error', err.msg)
      return response.redirect().back()
    }
  }

  public async show({ session, response, view, params }: HttpContextContract) {
    const slug: Genre['slug'] = params.id

    try {
      const genreData = await GenreService.get(slug, { withShowOnMainPage: true })

      return view.render('pages/genres/show', { item: genreData.genre, showOnMainPage: genreData.showOnMainPage })
    } catch (err: Err | any) {
      session.flash('error', err.msg)
      return response.redirect().back()
    }
  }

  public async edit({ params, session, view, response }: HttpContextContract) {
    const slug: Genre['slug'] = params.id

    try {
      const genreData = await GenreService.get(slug, { withShowOnMainPage: true })

      return view.render('pages/genres/edit', { item: genreData.genre, showOnMainPage: genreData.showOnMainPage })
    } catch (err: Err | any) {
      session.flash('error', err.msg)
      return response.redirect().back()
    }
  }

  public async update({ params, session, response, request }: HttpContextContract) {
    const slug: Genre['slug'] = params.id
    const payload = await request.validate(GenreValidator)

    try {
      await GenreService.update(slug, payload)

      session.flash('success', ResponseMessages.GENRE_UPDATED)
      return response.redirect().toRoute('genres.index')
    } catch (err: Err | any) {
      session.flash('error', err.msg)
      return response.redirect().back()
    }
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const slug: Genre['slug'] = params.id

    try {
      await GenreService.delete(slug)

      session.flash('success', ResponseMessages.GENRE_DELETED)
    } catch (err: Err | any) {
      session.flash('error', err.msg)
    }

    return response.redirect().back()
  }
}
