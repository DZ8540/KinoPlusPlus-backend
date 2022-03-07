import Video from './Video'
import Drive from '@ioc:Adonis/Core/Drive'
import CamelCaseNamingStrategy from '../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { IMG_PLACEHOLDER } from 'Config/drive'
import { camelCase } from '../../helpers/index'
import { BaseModel, beforeSave, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: null,
  })
  public updatedAt: DateTime

  @manyToMany(() => Video, {
    pivotTable: 'genres_videos',
  })
  public videos: ManyToMany<typeof Video>

  @beforeSave()
  public static async setSlug(genre: Genre) {
    if (genre.$dirty.slug)
      genre.slug = camelCase(genre.slug)

    if (!genre.slug)
      genre.slug = camelCase(genre.name)
  }

  public async imageForUser(): Promise<string> {
    return this.image ? await Drive.getUrl(this.image) : IMG_PLACEHOLDER
  }
}
