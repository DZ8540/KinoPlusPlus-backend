import { SimplePaginatorContract } from '@ioc:Adonis/Lucid/Database'

declare module '@ioc:Adonis/Lucid/Orm' {
  interface ModelQueryBuilderContract<
    Model extends LucidModel,
    Result = InstanceType<Model>
  > {
    get(config: PaginationConfig): Promise<Result extends LucidRow ? ModelPaginatorContract<Result> : SimplePaginatorContract<Result>>,
  }
}

export type PaginationConfig = {
  page: number,
  baseURL: string,
  limit?: number,
  orderByColumn?: string,
  orderBy?: 'asc' | 'desc',
}
