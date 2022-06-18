import User from 'App/Models/User/User'
import AuthService from 'App/Services/AuthService'
import { Err } from 'Contracts/services'
import { SESSION_USER_KEY } from 'Config/session'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckAdminPanelAccess {
  public async handle({ session, response }: HttpContextContract, next: () => Promise<void>) {
    const currentUserId: User['id'] | null = session.get(SESSION_USER_KEY)

    try {
      if (!currentUserId)
        throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.USER_NOT_FOUND } as Err

      await AuthService.checkAdminAccess(currentUserId)
    } catch (err: Err | any) {
      session.flash('error', err.msg)

      session.forget(SESSION_USER_KEY)
      response.redirect().toRoute('login')
    }

    await next()
  }
}
