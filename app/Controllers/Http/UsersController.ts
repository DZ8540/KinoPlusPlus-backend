import User from 'App/Models/User/User'
import UserService from 'App/Services/UserService'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async index({ view, session, request, response, route }: HttpContextContract) {
    try {
      const baseURL: string = route!.pattern
      const page: number = request.input('page', 1)

      const columns: typeof User.columns[number][] = ['id', 'nickname', 'avatar', 'email', 'isEmailVerified']
      const users: User[] = await UserService.paginate({ baseURL, page }, columns)

      return view.render('pages/users/index', { users })
    } catch (err: Error | any) {
      session.flash('error', err.msg)
      return response.redirect().back()
    }
  }

  public async show({ params, view, session, response }: HttpContextContract) {
    const id: User['id'] = params.id

    try {
      const item: User = await UserService.get(id)

      return view.render('pages/users/show', { item })
    } catch (err: Error | any) {
      session.flash('error', err.msg)
      return response.redirect().back()
    }
  }

  public async destroy({}: HttpContextContract) {}
}
