import User from 'App/Models/User/User'
import UserService from 'App/Services/User/UserService'
import UserValidator from 'App/Validators/UserValidator'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { Error } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async update({ request, params, response }: HttpContextContract) {
    let payload: UserValidator['schema']['props']
    const id: User['id'] = params.id

    try {
      payload = await request.validate(UserValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const user: User = await UserService.update(id, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.USER_UPDATED, user))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
