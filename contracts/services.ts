import { ResponseCodes, ResponseMessages } from 'Config/response'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { ExtractModelRelations, LucidRow } from '@ioc:Adonis/Lucid/Orm'

export type PaginateConfig<M extends string> = {
  page: number,
  baseURL?: string,
  limit?: number,
  orderBy?: 'asc' | 'desc',
  orderByColumn?: M,
}

export type ServiceConfig<M extends LucidRow> = {
  trx?: TransactionClientContract,
  relations?: ExtractModelRelations<M>[],
}

export type Error = {
  code: ResponseCodes,
  msg: ResponseMessages,
  body?: any,
}
