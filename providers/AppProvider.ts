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

    ModelQueryBuilder.macro('get', async function({ page, limit, orderByColumn, orderBy, baseURL }: PaginationConfig) {
      orderByColumn = orderByColumn ?? 'id'

      return (await this.orderBy(orderByColumn, orderBy).paginate(page, limit)).baseUrl(baseURL)
    })
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
