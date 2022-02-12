import ValidationException from 'App/Exceptions/ValidationException'
import { ResponseCodes } from 'Config/response'
import { Error } from 'Contracts/services'

export default class ExceptionService {
  constructor(err: Error) {
    switch (err.code) {
      case ResponseCodes.VALIDATION_ERROR:
        return new ValidationException(err.msg, err.body)
      default:
        break;
    }
  }
}
