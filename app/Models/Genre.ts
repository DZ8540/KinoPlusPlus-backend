import Video from './Video'
import Drive from '@ioc:Adonis/Core/Drive'
import CamelCaseNamingStrategy from '../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { camelCase } from '../../helpers/index'
import { afterFetch, afterFind, BaseModel, beforeSave, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

export default class Genre extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = [
    'id', 'slug', 'name',
    'description', 'image', 'createdAt',
    'updatedAt',
  ] as const

  @column({ isPrimary: true })
  public id: number

  @column()
  public slug: string

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public image?: string

  @column() // * For aggregate movies count
  public moviesCount?: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: null,
  })
  public updatedAt: DateTime

  /**
   * * Relations
   */

  @manyToMany(() => Video, {
    pivotTable: 'genres_videos',
  })
  public videos: ManyToMany<typeof Video>

  /**
   * * Hooks
   */

  @beforeSave()
  public static async setSlug(genre: Genre) {
    if (genre.$dirty.slug)
      genre.slug = camelCase(genre.slug)

    if (!genre.slug)
      genre.slug = camelCase(genre.name)
  }

  @afterFind()
  public static async getImageFromDrive(item: Genre) {
    if (item.image)
      item.image = await Drive.getUrl(item.image)
  }

  @afterFetch()
  public static async getImagesFromDrive(genres: Genre[]) {
    await Promise.all(genres.map(async (item: Genre) => {
      if (item.image)
        item.image = await Drive.getUrl(item.image)
    }))
  }

  // public async serialize(): Promise<ModelObject> {
  //   const serializedItem: ModelObject = super.serialize()
  //   let showOnMainPage: boolean

  //   const itemFromMongo = await GenresOnMainPage.findOne({ genreId: serializedItem.id })
  //   showOnMainPage = !!itemFromMongo // * Cast to boolean

  //   serializedItem.showOnMainPage = showOnMainPage
  //   return serializedItem
  // }
}