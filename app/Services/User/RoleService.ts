import Role from 'App/Models/User/Role'
import Logger from '@ioc:Adonis/Core/Logger'
import { Error } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class RoleService {
  public static async getByName(name: Role['name']): Promise<Role> {
    let item: Role | null

    try {
      item = await Role.findBy('name', name)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, msg: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, msg: ResponseMessages.ROLE_NOT_FOUND } as Error

    return item
  }
}
