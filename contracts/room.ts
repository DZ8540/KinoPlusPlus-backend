import Room from 'App/Models/Room/Room'
import User from 'App/Models/User/User'

export type RoomConfig = {
  usersCount: number,
}

export type RoomJoinPayload = {
  userId: User['id'],
  roomSlug: Room['slug'],
  isCreator: boolean,
}
