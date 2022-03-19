import User from 'App/Models/User/User'
import Hash from '@ioc:Adonis/Core/Hash'
import UserService from './User/UserService'
import Logger from '@ioc:Adonis/Core/Logger'
import LoginValidator from 'App/Validators/LoginValidator'
import { Error } from 'Contracts/services'
import { RoleTypes, ROLE_TYPES } from 'Config/role'
import { ResponseCodes, ResponseMessages } from 'Config/response'

const ERROR: Error = { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.USER_NOT_FOUND }

export default class AuthService {
  public static async login(payload: LoginValidator['schema']['props']): Promise<User> {
    let user: User

    try {
      user = await UserService.getByEmail(payload.email)
    } catch (err: Error | any) {
      throw ERROR
    }

    try {
      if (!(await Hash.verify(user.password, payload.password)))
        throw null

      return user
    } catch (err: any) {
      Logger.error(err)
      throw ERROR
    }
  }

  public static async checkAdminAccess(id: User['id']): Promise<void> {
    let user: User

    try {
      user = await UserService.get(id, { relations: ['role'] })
    } catch (err: Error | any) {
      throw ERROR
    }

    if (user.role.name != ROLE_TYPES[RoleTypes.ADMIN])
      throw ERROR
  }
}
