import User from 'App/Models/User/User'
import ApiValidator from 'App/Validators/ApiValidator'
import UserService from 'App/Services/User/UserService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import ListValidator from 'App/Validators/User/ListValidator'
import { JSONPaginate } from 'Contracts/database'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LaterListsController {
  public async getUserLaterList({ request, params, response }: HttpContextContract) {
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
      const laterList: JSONPaginate = await UserService.getUserLaterList(id, config)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, laterList))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async add({ request, response }: HttpContextContract) {
    let payload: ListValidator['schema']['props']

    try {
      payload = await request.validate(ListValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      await UserService.addToLaterList(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    let payload: ListValidator['schema']['props']

    try {
      payload = await request.validate(ListValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        msg: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      await UserService.removeFromLaterList(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
