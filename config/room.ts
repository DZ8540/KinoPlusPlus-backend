import Env from '@ioc:Adonis/Core/Env'
import { RoomConfig } from 'Contracts/room'

const DEFAULT_USERS_COUNT: number = 10

const roomConfig: RoomConfig = {
  usersCount: Env.get('ROOM_MAX_USERS_COUNT', DEFAULT_USERS_COUNT)
}

export default roomConfig
