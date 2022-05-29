import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class ResponseService {
  public code: ResponseCodes = ResponseCodes.SUCCESS
  public status: number = 200

  public msg: ResponseMessages
  public body?: any

  constructor(msg: ResponseMessages, body?: any) {
    this.msg = msg
    this.body = body
  }
}
