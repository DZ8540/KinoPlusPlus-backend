import authConfig from 'Config/auth'
import TokenService from 'App/Services/TokenService'
import ExceptionService from 'App/Services/ExceptionService'
import { Err } from 'Contracts/services'
import { getToken } from 'Helpers/index'
import { TokenUserPayload } from 'Contracts/token'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

const ERROR: Err = { code: ResponseCodes.TOKEN_EXPIRED, msg: ResponseMessages.TOKEN_ERROR }

export default class CheckRefreshToken {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const headerToken: string | undefined = request.header('Authorization')

    if (!headerToken)
      throw new ExceptionService(ERROR)

    try {
      const token: string = getToken(headerToken)
      TokenService.verifyToken<TokenUserPayload>(token, authConfig.access.key)

      await next()
    } catch (err: Err | any) {
      throw new ExceptionService(ERROR)
    }
  }
}
