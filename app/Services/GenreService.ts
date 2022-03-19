import Genre from 'App/Models/Video/Genre'
import Drive from '@ioc:Adonis/Core/Drive'
import Logger from '@ioc:Adonis/Core/Logger'
import GenreValidator from 'App/Validators/GenreValidator'
import GenresOnMainPage, { GenreOnMainPage } from 'App/Models/Mongoose/GenresOnMainPage'
import { GENRES_IMAGES } from 'Config/drive'
import { ModelAttributes } from '@ioc:Adonis/Lucid/Orm'
import { Error, ServiceConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Config/response'

type Columns = typeof Genre.columns[number][]
type Payload = GenreValidator['schema']['props']

type GetAllMethodConfig = {
  withMoviesCount?: boolean,
}

type GetMethodConfig = ServiceConfig<Genre> & {
  withShowOnMainPage?: boolean,
}

type GetMethodReturn = {
  genre: Genre,
  showOnMainPage: boolean,
}

export default class GenreService {
  public static async getAll(columns: Columns = [], config: GetAllMethodConfig = {}): Promise<Genre[]> {
    let query = Genre.query().select(columns).orderBy('id')

    if (config.withMoviesCount) {
      query = query.withCount('videos', (query) => {
        query.as('moviesCount')
      })
    }

    try {
      return await query
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async get(property: Genre['id'], config?: GetMethodConfig): Promise<GetMethodReturn>
  public static async get(property: Genre['slug'], config?: GetMethodConfig): Promise<GetMethodReturn>
  public static async get(property: Genre['id'] | Genre['slug'], config: GetMethodConfig = {}): Promise<GetMethodReturn> {
    let item: Genre | null

    try {
      if (typeof property == 'string') {

        item = await Genre.findBy('slug', property, { client: config.trx })

      } else {

        item = await Genre.find(property, { client: config.trx })

      }
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }

    try {
      if (!item)
        throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.GENRE_NOT_FOUND } as Error

      return this.loadModelConfigurations(item, config)
    } catch (err: Error | any) {
      throw err
    }
  }

  public static async create(payload: Payload, { trx }: ServiceConfig<Genre> = {}): Promise<Genre> {
    let item: Genre
    const genrePayload: Partial<ModelAttributes<Genre>> = {
      slug: payload.slug,
      name: payload.name,
      description: payload.description,
      image: undefined,
    }

    if (payload.image) {
      try {
        await payload.image.moveToDisk(GENRES_IMAGES)
        genrePayload.image = `${GENRES_IMAGES}/${payload.image.fileName}`
      } catch (err: any) {
        Logger.error(err)
        throw { code: ResponseCodes.SERVER_ERROR, msg: ResponseMessages.ERROR } as Error
      }
    }

    try {
      item = await Genre.create(genrePayload, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }

    if (payload.isShowOnMainPage) {
      try {
        await this.addGenreToShowOnMainPage(item.id)
      } catch (err: Error | any) {
        throw err
      }
    }

    return item
  }

  public static async update(slug: Genre['slug'], payload: Payload): Promise<Genre> {
    let item: Genre
    const genrePayload: Partial<ModelAttributes<Genre>> = {
      slug: payload.slug,
      name: payload.name,
      description: payload.description,
      image: undefined,
    }

    try {
      item = (await this.get(slug)).genre
    } catch (err: Error | any) {
      throw err
    }

    if (payload.image) {
      try {
        if (item.image)
          await Drive.delete(item.image)

        await payload.image.moveToDisk(GENRES_IMAGES)
        genrePayload.image = `${GENRES_IMAGES}/${payload.image.fileName}`
      } catch (err: any) {
        Logger.error(err)
        throw { code: ResponseCodes.SERVER_ERROR, msg: ResponseMessages.ERROR } as Error
      }
    }

    try {
      item = await item.merge(genrePayload).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }

    try {
      if (payload.isShowOnMainPage)
        await this.addGenreToShowOnMainPage(item.id)
      else
        await this.removeGenreFromShowOnMainPage(item.id)
    } catch (err: Error | any) {
      throw err
    }

    return item
  }

  public static async delete(slug: Genre['slug']): Promise<void> {
    let item: Genre

    try {
      item = (await this.get(slug)).genre
    } catch (err: Error | any) {
      throw err
    }

    if (item.image) {
      try {
        await Drive.delete(item.image)
      } catch (err: any) {
        Logger.error(err)
        throw { code: ResponseCodes.SERVER_ERROR, msg: ResponseMessages.ERROR } as Error
      }
    }

    try {
      await this.removeGenreFromShowOnMainPage(item.id)
    } catch (err: Error | any) {
      throw err
    }

    try {
      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  /**
   * * For API methods
   */

  public static async getAllGenresOnMainPage(): Promise<Genre[]> {
    const genres: Genre[] = []
    let allGenresOnMainPage: GenreOnMainPage[]

    try {
      allGenresOnMainPage = await this.getAllFromMongo()
    } catch (err) {
      throw err
    }

    for (const { genreId } of allGenresOnMainPage) {
      try {
        const { genre } = await this.get(genreId)

        genres.push(genre)
      } catch (err: Error | any) {}
    }

    return genres
  }

  /**
   * * Private methods
   */

  private static async getAllFromMongo(): Promise<GenreOnMainPage[]> {
    try {
      return await GenresOnMainPage.find()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  private static async getFromMongo(genreId: Genre['id']): Promise<GenreOnMainPage> {
    let item: GenreOnMainPage | null

    try {
      item = await GenresOnMainPage.findOne({ genreId })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }

    try {
      if (!item)
        throw null

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  private static async addGenreToShowOnMainPage(genreId: Genre['id']): Promise<void> {
    const genre = new GenresOnMainPage({ genreId })

    // * Check if exists
    try {
      await this.getFromMongo(genreId)
      return
    } catch (err: Error | any) {}
    // * Check if exists

    try {
      await genre.save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  private static async removeGenreFromShowOnMainPage(genreId: Genre['id']): Promise<void> {
    try {
      await GenresOnMainPage.deleteOne({ genreId })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  private static async loadModelConfigurations(item: Genre, config: GetMethodConfig = {}): Promise<GetMethodReturn> {
    let showOnMainPage: boolean = false

    try {
      if (config.relations) {
        for (const relationItem of config.relations) {
          await item.load(relationItem)
        }
      }
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }

    if (config.withShowOnMainPage) {
      try {
        await this.getFromMongo(item.id)

        showOnMainPage = true
      } catch (err: Error | any) {}
    }

    return { genre: item, showOnMainPage } as GetMethodReturn
  }
}
