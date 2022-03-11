import Video from 'App/Models/Video'
import Genre from 'App/Models/Genre'
import Env from '@ioc:Adonis/Core/Env'
import GenreService from '../GenreService'
import Logger from '@ioc:Adonis/Core/Logger'
import HttpClientService from '../HttpClientService'
import GenreValidator from 'App/Validators/GenreValidator'
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { AxiosResponse } from 'axios'
import { DateTime, Duration } from 'luxon'
import { Error } from 'Contracts/services'
import { camelCase } from '../../../helpers/index'
import { parseAgeLimit } from '../../../helpers/video'
import { ModelAttributes } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Config/response'

const DEFAULT_GENRE_DESCRIPTION: string = 'Description coming soon'

export default class VideoSyncService {
  public static async sync(): Promise<number> {
    // let maxPages: number = (await HttpClientService.videoApiInstance().get('/movies')).data['last_page']
    const maxPages: number = Env.get('VIDEO_API_MAX_PAGES_SYNC')
    const limit: number = Env.get('VIDEO_API_LIMIT_PER_PAGE_SYNC')
    const startPage: number = Env.get('VIDEO_API_START_PAGE')
    let videosCount: number = 0

    for (let i = startPage; i <= maxPages; i++) {
      let response: AxiosResponse

      try {
        response = await HttpClientService.videoApiInstance().get('/movies', {
          params: {
            limit,
            page: i,
          }
        })
      } catch (err: any) {
        Logger.error(err)
        throw { code: ResponseCodes.SERVER_ERROR, msg: ResponseMessages.ERROR } as Error
      }

      try {
        this.addVideos(response.data.data)
      } catch (err: Error | any) {
        throw err
      }

      videosCount = i * limit
    }

    return videosCount
  }

  private static async addVideos(videos: any[]): Promise<void> {
    for (const item of videos) {
      const trx: TransactionClientContract = await Database.transaction()
      const videoPayload: Partial<ModelAttributes<Video>> = {}
      let arrGenresIds: Genre['id'][]
      let genres: string

      try {
        let videoData: any = (await HttpClientService.mainDataApiInstance().get(`/${item['imdb_id']}`)).data
        let dateTimeDuration: Duration = Duration.fromObject({ minutes: +videoData.runtimeMins })

        videoPayload.name = item['orig_title']
        videoPayload.description = videoData.plotLocal
        videoPayload.ageLimit = parseAgeLimit(videoData.contentRating)
        videoPayload.rating = +videoData.imDbRating
        videoPayload.released = DateTime.fromFormat(item.year, 'yyyy-MM-dd')
        videoPayload.duration = DateTime.fromISO(dateTimeDuration.toISOTime())
        videoPayload.country = videoData.countries.toLowerCase()
        videoPayload.poster = videoData.image

        genres = videoData.genres
      } catch (err: any) {
        Logger.error(err)
        throw { code: ResponseCodes.SERVER_ERROR, msg: ResponseMessages.ERROR } as Error
      }

      try {
        arrGenresIds = await this.addGenres(genres, trx)
      } catch (err: Error | any) {
        await trx.rollback()

        throw err
      }

      try {
        const video: Video = await Video.create(videoPayload, { client: trx })

        await video.related('genres').attach(arrGenresIds, trx)
        await trx.commit()
      } catch (err: any) {
        await trx.rollback()

        Logger.error(err)
        throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
      }
    }
  }

  private static async addGenres(genres: string, trx: TransactionClientContract): Promise<Genre['id'][]> {
    const arrGenresIds: Genre['id'][] = []
    const arrGenres: string[] = genres.split(',')

    try {
      for (let item of arrGenres) {
        item = item.trim()

        let genre: Genre
        const itemSlug: string = camelCase(item)

        try {
          genre = (await GenreService.get(itemSlug)).genre
        } catch (err: Error | any) {
          const payload: GenreValidator['schema']['props'] = {
            name: item,
            slug: itemSlug,
            description: DEFAULT_GENRE_DESCRIPTION,
            image: undefined,
            isShowOnMainPage: undefined,
          }

          genre = await GenreService.create(payload, { trx })
        }

        arrGenresIds.push(genre.id)
      }
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }

    return arrGenresIds
  }
}
