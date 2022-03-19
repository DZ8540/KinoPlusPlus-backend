import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    return {
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      password: '1234Test',
    }
  })
  .build()
