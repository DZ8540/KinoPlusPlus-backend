import ExceptionService from 'App/Services/ExceptionService'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckAuthHeaders {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    if (
      !request.header('User-Agent') ||
      !request.header('User-Fingerprint') ||
      !request.ip()
    ) throw new ExceptionService({ code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.MISSING_AUTH_HEADERS })

    await next()
  }
}
