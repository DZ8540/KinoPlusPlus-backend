import User from 'App/Models/User/User'
import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { RoleTypes } from 'Config/role'
import { UserFactory } from 'Database/factories'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    try {
      await User.createMany([
        {
          nickname: 'Admin',
          email: 'admin@mail.ru',
          password: '1234Admin',
          roleId: RoleTypes.ADMIN,
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
