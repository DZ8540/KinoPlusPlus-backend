import TokenException from 'App/Exceptions/TokenException'
import ClientException from 'App/Exceptions/ClientException'
import MailerException from 'App/Exceptions/MailerException'
import ServerException from 'App/Exceptions/ServerException'
import DatabaseException from 'App/Exceptions/DatabaseException'
import ValidationException from 'App/Exceptions/ValidationException'
import { Err } from 'Contracts/services'
import { ResponseCodes } from 'Config/response'

export default class ExceptionService {
  constructor(err: Err) {
    switch (err.code) {
      case ResponseCodes.CLIENT_ERROR:
        return new ClientException(err.msg, err.errors, err.body)

      case ResponseCodes.DATABASE_ERROR:
        return new DatabaseException(err.msg, err.errors, err.body)

      case ResponseCodes.MAILER_ERROR:
        return new MailerException(err.msg, err.errors, err.body)

      case ResponseCodes.SERVER_ERROR:
        return new ServerException(err.msg, err.errors, err.body)

      case ResponseCodes.VALIDATION_ERROR:
        return new ValidationException(err.msg, err.errors, err.body)

      case ResponseCodes.TOKEN_EXPIRED:
        return new TokenException(err.msg, err.errors, err.body)

      default:
        break;
    }
  }
}
