import AuthService from 'App/Services/AuthService'
import LoginValidator from 'App/Validators/LoginValidator'
import { Error } from 'Contracts/services'
import { SESSION_USER_KEY } from 'Config/session'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async login({ view, session, response }: HttpContextContract) {
    if (session.get(SESSION_USER_KEY))
      return response.redirect().back()

    return view.render('pages/auth/login')
  }

  public async loginAction({ session, response, request }: HttpContextContract) {
    const payload = await request.validate(LoginValidator)

    try {
      const { id } = await AuthService.loginViaAdminPanel(payload)

      session.put(SESSION_USER_KEY, id)
      return response.redirect().toRoute('index')
    } catch (err: Error | any) {
      session.flash('error', err.msg)

      session.forget(SESSION_USER_KEY)
      return response.redirect().back()
    }
  }

  public async logout({ session, response }: HttpContextContract) {
    session.forget(SESSION_USER_KEY)
    return response.redirect().toRoute('login')
  }
}
