import Video from 'App/Models/Video'
import Logger from '@ioc:Adonis/Core/Logger'
import HttpClientService from '../HttpClientService'
import { AgeLimits } from 'Config/video'
import { DateTime, Duration } from 'luxon'
import { Error } from 'Contracts/services'
import { parseAgeLimit } from '../../../helpers/video'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class VideoSyncService {
  public static async sync(): Promise<any> {
    // let maxPages: number = (await HttpClientService.videoApiInstance().get('/movies')).data['last_page']
    let maxPages: number = 5
    let startPage: number = 1

    try {
      for (let i = startPage; i <= maxPages; i++) {
        let { data } = await HttpClientService.videoApiInstance().get('/movies', {
          params: {
            page: i,
          }
        })

        for (let item of data.data) {
          let { data } = await HttpClientService.mainDataApiInstance().get(`/${item['imdb_id']}`)
          let mainDataApiDuration: string = data.runtimeMins
          let duration: Duration = Duration.fromObject({ minutes: +mainDataApiDuration })
          let contentRating: keyof typeof AgeLimits = data.contentRating

          await Video.create({
            name: item['ru_title'],
            description: data.plotLocal,
            ageLimit: parseAgeLimit(contentRating),
            country: data.countries,
            rating: +data.imDbRating,
            released: DateTime.fromFormat(item.year, 'yyyy-MM-dd'),
            duration: DateTime.fromISO(duration.toISOTime()),
            poster: data.image,
          })
        }
      }
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, msg: ResponseMessages.ERROR } as Error
    }
  }
}
