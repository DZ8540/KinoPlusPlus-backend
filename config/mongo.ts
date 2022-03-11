import Env from '@ioc:Adonis/Core/Env'

export const mongoConfig = {
  host: Env.get('MONGO_HOST', 'localhost'),
  port: Env.get('MONGO_PORT', 27017),
  dbName: Env.get('MONGO_DB_NAME'),
}
