import { PaginationConfig } from 'Contracts/database'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready
    const {
      ModelQueryBuilder
    } = this.app.container.use('Adonis/Lucid/Database')

    ModelQueryBuilder.macro('paginate', async function(config: PaginationConfig) {
      config.orderByColumn = config.orderByColumn ?? 'id'
      let result = await this.orderBy(config.orderByColumn, config.orderBy).paginate(config.page, config.limit)

      if (config.baseURL)
        return result.baseUrl(config.baseURL)

      return result
    })
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
