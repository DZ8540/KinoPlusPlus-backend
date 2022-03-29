import BaseException from './BaseException'
import { ResponseCodes } from 'Config/response'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new MailerException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class MailerException extends BaseException {
  code: ResponseCodes = ResponseCodes.MAILER_ERROR
  status: number = 500
}
