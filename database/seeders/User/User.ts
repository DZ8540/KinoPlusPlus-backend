import User from 'App/Models/User/User'
import Role from 'App/Models/User/Role'
import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import RoleService from 'App/Services/User/RoleService'
import { Error } from 'Contracts/services'
import { UserFactory } from 'Database/factories'
import { RoleTypes, ROLE_TYPES } from 'Config/role'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    let adminRole: Role
    const adminRoleName: Role['name'] = ROLE_TYPES[RoleTypes.ADMIN]

    try {
      adminRole = await RoleService.getByName(adminRoleName)
    } catch (err: Error | any) {
      throw err
    }

    try {
      await User.createMany([
        {
          nickname: 'Admin',
          email: 'admin@mail.ru',
          password: '1234Admin',
          roleId: adminRole.id,
        },
        {
          nickname: 'Test',
          email: 'test@mail.ru',
          password: '1234Test',
        },
      ])

      await UserFactory.createMany(20)
    } catch (err: any) {
      Logger.error(err)
    }
  }
}
