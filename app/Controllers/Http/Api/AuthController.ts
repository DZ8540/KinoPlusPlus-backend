import User from 'App/Models/User/User'
import AuthService from 'App/Services/AuthService'
import UserService from 'App/Services/User/UserService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import LoginValidator from 'App/Validators/Api/Auth/LoginValidator'
import RegisterValidator from 'App/Validators/Api/Auth/RegisterValidator'
import { Tokens } from 'Contracts/token'
import { Error } from 'Contracts/services'
import { AuthHeaders } from 'Contracts/auth'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { COOKIE_REFRESH_TOKEN_KEY, COOKIE_REFRESH_TOKEN_OPTIONS } from 'Config/auth'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    let payload: RegisterValidator['schema']['props']

    try {
      payload = await request.validate(RegisterValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages.errors,
      })
    }

    try {
      await AuthService.registerViaApi(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.ACTIVATE_ACCOUNT))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async emailVerify({ params, response }: HttpContextContract) {
    const token: string = params.token

    try {
      const user: User = await UserService.activate(token)

      return response.status(200).send(new ResponseService(ResponseMessages.USER_ACTIVATED, user))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async login({ request, response }: HttpContextContract) {
    let payload: LoginValidator['schema']['props']
    const headers: AuthHeaders = {
      fingerprint: request.header('User-Fingerprint')!,
      userAgent: request.header('User-Agent')!,
      ip: request.ip(),
    }

    try {
      payload = await request.validate(LoginValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const data: { tokens: Tokens, user: User } = await AuthService.loginViaApi(payload, headers)

      response.cookie(COOKIE_REFRESH_TOKEN_KEY, data.tokens.refresh, COOKIE_REFRESH_TOKEN_OPTIONS)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, {
        user: data.user,
        token: data.tokens.access,
      }))
    } catch (err: Error | any) {
      response.clearCookie(COOKIE_REFRESH_TOKEN_KEY)

      throw new ExceptionService(err)
    }
  }

  public async refreshToken({ request, response }: HttpContextContract) {
    const refreshToken: string = request.cookie(COOKIE_REFRESH_TOKEN_KEY)
    const headers: AuthHeaders = {
      fingerprint: request.header('User-Fingerprint')!,
      userAgent: request.header('User-Agent')!,
      ip: request.ip(),
    }

    try {
      const tokens: Tokens = await AuthService.refreshToken(refreshToken, headers)

      response.cookie(COOKIE_REFRESH_TOKEN_KEY, tokens.refresh, COOKIE_REFRESH_TOKEN_OPTIONS)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, tokens.access))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async logout({ request, response }: HttpContextContract) {
    const refreshToken: string = request.cookie(COOKIE_REFRESH_TOKEN_KEY)
    const headers: AuthHeaders = {
      fingerprint: request.header('User-Fingerprint')!,
      userAgent: request.header('User-Agent')!,
      ip: request.ip(),
    }

    try {
      await AuthService.logout(refreshToken, headers)

      response.clearCookie(COOKIE_REFRESH_TOKEN_KEY)

      return response.status(200).send(new ResponseService(ResponseMessages.LOGOUT))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
