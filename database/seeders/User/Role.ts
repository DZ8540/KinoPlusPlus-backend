import Role from 'App/Models/User/Role'
import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { RoleTypes, ROLE_TYPES } from 'Config/role'

export default class RoleSeeder extends BaseSeeder {
  public async run () {
    try {
      await Role.createMany([
        { name: ROLE_TYPES[RoleTypes.ADMIN] },
        { name: ROLE_TYPES[RoleTypes.USER] },
      ])
    } catch (err: any) {
      Logger.error(err)
    }
  }
}
