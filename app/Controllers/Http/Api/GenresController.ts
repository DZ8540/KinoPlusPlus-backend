import Genre from 'App/Models/Genre'
import GenreService from 'App/Services/GenreService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { Error } from 'Contracts/services'
import { ResponseMessages } from 'Config/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GenresController {
  public async getAll({ response }: HttpContextContract) {
    try {
      let genres: Genre[] = await GenreService.getAll()

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, genres))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async get({ params, response }: HttpContextContract) {
    let slug: Genre['slug'] = params.slug

    try {
      let item: Genre = await GenreService.get(slug)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
