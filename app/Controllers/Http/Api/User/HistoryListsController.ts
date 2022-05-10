import User from 'App/Models/User/User'
import ApiValidator from 'App/Validators/ApiValidator'
import UserService from 'App/Services/User/UserService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { JSONPaginate } from 'Contracts/database'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HistoryListsController {
  public async getUserHistoryList({ request, params, response }: HttpContextContract) {
    let config: ApiValidator['schema']['props']
    const id: User['id'] = params.id

    try {
      config = await request.validate(ApiValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const historyList: JSONPaginate = await UserService.getUserHistoryList(id, config)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, historyList))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
