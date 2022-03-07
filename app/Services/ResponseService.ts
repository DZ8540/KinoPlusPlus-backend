import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class ResponseService {
  public code: ResponseCodes = ResponseCodes.SUCCESS
  public status: number = 200

  public message: ResponseMessages
  public body?: any

  constructor(message: ResponseMessages, body?: any) {
    this.message = message
    this.body = body
  }
}
