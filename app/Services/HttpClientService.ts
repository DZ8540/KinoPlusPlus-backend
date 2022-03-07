import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'

export default class HttpClientService {
  public static videoApiInstance() {
    return axios.create({
      baseURL: 'https://videocdn.tv/api',
      headers: {
        'API_TOKEN': Env.get('VIDEO_API_TOKEN'),
      },
      params: {
        'api_token': Env.get('VIDEO_API_TOKEN'),
      }, // TODO: remove it in production
    })
  }

  public static mainDataApiInstance() {
    const token: string = Env.get('MAIN_DATA_API_API_TOKEN')

    return axios.create({
      baseURL: `https://imdb-api.com/ru/API/Title/${token}`,
    })
  }
}
