import authConfig from 'Config/auth'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User/User'
import TokenService from './TokenService'
import Mail from '@ioc:Adonis/Addons/Mail'
import Logger from '@ioc:Adonis/Core/Logger'
import Application from '@ioc:Adonis/Core/Application'
import { Err } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { SignTokenConfig, TokenUserPayload } from 'Contracts/token'

export default class MailerService {
  public static async sendMailVerificationToken(user: User): Promise<void> {
    const fromEmail: string = Env.get('SMTP_FROM')
    const tokenPayload: TokenUserPayload = {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      birthday: user.birthday,
      phone: user.phone,
      sex: user.sex,
    }
    const tokenConfig: SignTokenConfig = {
      key: authConfig.emailVerify.key,
      expire: authConfig.emailVerify.expire,
    }
    const token: string = TokenService.createToken(tokenPayload, tokenConfig)

    if (Application.inDev)
      Logger.info(token)

    try {
      await Mail.send((message) => {
        message
          .from(fromEmail)
          .to(user.email)
          .subject('Email confirmation from Kino++!')
          .htmlView('emails/emailConfirmation', { user, token })
      })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.MAILER_ERROR, msg: ResponseMessages.ERROR } as Err
    }
  }
}
