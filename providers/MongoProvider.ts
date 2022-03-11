import Logger from '@ioc:Adonis/Core/Logger'
import { Mongoose } from 'mongoose'
import { mongoConfig } from 'Config/mongo'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class MongoProvider {
  protected readonly HOST: string = mongoConfig.host
  protected readonly PORT: number = mongoConfig.port
  protected readonly DB_NAME: string = mongoConfig.dbName

  constructor(protected app: ApplicationContract) {}

  public async register() {
    // Register your own bindings

    const mongoose: Mongoose = new Mongoose()

    try {
      await mongoose.connect(`mongodb://${this.HOST}:${this.PORT}/${this.DB_NAME}`, {
        bufferCommands: true,
      })
      this.app.container.singleton('Mongoose', () => mongoose)
    } catch (err: any) {
      Logger.error(err)
    }
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down

    await this.app.container.use('Mongoose').disconnect()
  }
}
