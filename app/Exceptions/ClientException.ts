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
| new ClientException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class ClientException extends BaseException {
  code: ResponseCodes = ResponseCodes.CLIENT_ERROR
  status: number = 400
}
