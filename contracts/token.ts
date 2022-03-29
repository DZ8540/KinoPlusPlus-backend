import User from 'App/Models/User/User'
import { Algorithm } from 'jsonwebtoken'

export type TokenUserPayload = {
  id: User['id'],
  email: User['email'],
  nickname: User['nickname'],
  sex?: User['sex'],
  phone?: User['phone'],
  birthday?: User['birthday'],
}

export type SignTokenConfig = {
  key: string,
  expire: string | number,
  algorithm?: Algorithm,
}

export type Tokens = {
  access: string,
  refresh: string,
}
