import Genre from 'App/Models/Genre'
import Drive from '@ioc:Adonis/Core/Drive'
import Logger from '@ioc:Adonis/Core/Logger'
import GenreValidator from 'App/Validators/GenreValidator'
import { GENRES_IMAGES } from 'Config/drive'
import { Error, ServiceConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Config/response'

type Columns = typeof Genre.columns[number][]
type Payload = GenreValidator['schema']['props']

export default class GenreService {
  public static async getAll(columns: Columns = []): Promise<Genre[]> {
    try {
      return await Genre.query().select(columns)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async get(slug: Genre['slug'], config: ServiceConfig<Genre> = {}): Promise<Genre> {
    let item: Genre | null

    try {
      item = await Genre.findBy('slug', slug, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }

    try {
      if (!item)
        throw null

      if (config.relations) {
        for (const relationItem of config.relations) {
          await item.load(relationItem)
        }
      }

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.GENRE_NOT_FOUND } as Error
    }
  }

  public static async create(payload: Payload, { trx }: ServiceConfig<Genre> = {}): Promise<Genre> {
    let image: string | undefined = undefined

    if (payload.image) {
      try {
        await payload.image.moveToDisk(GENRES_IMAGES)
        image = `${GENRES_IMAGES}/${payload.image.fileName}`
      } catch (err: any) {
        Logger.error(err)
        throw { code: ResponseCodes.SERVER_ERROR, msg: ResponseMessages.ERROR } as Error
      }
    }

    try {
      return await Genre.create({ ...payload, image }, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async update(slug: Genre['slug'], payload: Payload): Promise<Genre> {
    let item: Genre
    let image: string | undefined = undefined

    try {
      item = await this.get(slug)
    } catch (err: Error | any) {
      throw err
    }

    if (payload.image) {
      try {
        if (item.image)
          await Drive.delete(item.image)

        await payload.image.moveToDisk(GENRES_IMAGES)
        image = `${GENRES_IMAGES}/${payload.image.fileName}`
      } catch (err: any) {
        Logger.error(err)
        throw { code: ResponseCodes.SERVER_ERROR, msg: ResponseMessages.ERROR } as Error
      }
    }

    try {
      item = await item.merge({ ...payload, image }).save()

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(slug: Genre['slug']): Promise<void> {
    let item: Genre

    try {
      item = await this.get(slug)
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
      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }
}
