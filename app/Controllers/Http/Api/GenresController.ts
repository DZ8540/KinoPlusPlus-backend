import User from 'App/Models/User/User'
import Genre from 'App/Models/Video/Genre'
import GenreService from 'App/Services/GenreService'
import ApiValidator from 'App/Validators/ApiValidator'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { Error } from 'Contracts/services'
import { JSONPaginate } from 'Contracts/database'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GenresController {
  public async getAll({ response }: HttpContextContract) {
    try {
      const genres: Genre[] = await GenreService.getAll([], { withMoviesCount: true })

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, genres))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async showOnMainPage({ response }: HttpContextContract) {
    try {
      const genres: Genre[] = await GenreService.getAllGenresOnMainPage()

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, genres))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async get({ params, response }: HttpContextContract) {
    const slug: Genre['slug'] = params.slug

    try {
      const item: Genre = (await GenreService.get(slug)).genre

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async genreMovies({ request, params, response }: HttpContextContract) {
    let config: ApiValidator['schema']['props']
    const slug: Genre['slug'] = params.slug
    const currentUserId: User['id'] | undefined = params.currentUserId

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
      const movies: JSONPaginate = await GenreService.getGenreMovies(config, slug, currentUserId)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, movies))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
