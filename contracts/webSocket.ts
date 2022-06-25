import Room from 'App/Models/Room/Room'
import User from 'App/Models/User/User'
import RoomMessage from 'App/Models/Room/RoomMessage'
import ApiValidator from 'App/Validators/ApiValidator'
import ResponseService from 'App/Services/ResponseService'
import RoomValidator from 'App/Validators/Room/RoomValidator'
import RoomMessageValidator from 'App/Validators/Room/RoomMessageValidator'
import { Err } from './services'

export interface ServerToClientEvents {
  'room:delete': () => void,
  'room:newMessage': (msg: RoomMessage) => void,
  'room:update': (isOpen: Room['isOpen']) => void,
  'room:usersCountUpdate': (users: number) => void,
  'room:kickUser': (userId: User['id']) => void,
}

export interface ClientToServerEvents {
  'room:unJoin': (slug: Room['slug'], cb: (result: Err | ResponseService) => void) => void,
  'room:join': (roomSlug: Room['slug'], cb: (result: Err | ResponseService) => void) => void,
  'room:kickUser': (roomSlug: Room['slug'], userId: User['id'], cb: (result: Err | ResponseService) => void) => void,
  'room:create': (request: RoomValidator['schema']['props'], cb: (result: Err | ResponseService) => void) => void,
  'room:update': (slug: Room['slug'], request: RoomValidator['schema']['props'], cb: (result: Err | ResponseService) => void) => void,
  'room:getMessages': (slug: Room['slug'], request: ApiValidator['schema']['props'], cb: (result: Err | ResponseService) => void) => void,
  'room:sendMessage': (slug: Room['slug'], request: RoomMessageValidator['schema']['props'], cb: (result: Err | ResponseService) => void) => void,
}

export interface InterServerEvents {}

export interface SocketData {
  userId: User['id'],
  room: Room['slug'] | null,
  createdRoom: Room['slug'] | null,
}
