import Room from 'App/Models/Room/Room'
import User from 'App/Models/User/User'

export type JoinRoomData = {
  userId: User['id'],
  roomSlug: Room['slug'],
  isCreator: boolean,
}
