import Room from 'App/Models/Room/Room'
import RoomMessage from 'App/Models/Room/RoomMessage'
import ApiValidator from 'App/Validators/ApiValidator'
import ResponseService from 'App/Services/ResponseService'
import RoomValidator from 'App/Validators/Room/RoomValidator'
import RoomMessageValidator from 'App/Validators/Room/RoomMessageValidator'
import { Error } from './services'

export interface ServerToClientEvents {
  'room:delete': () => void,
  'room:newMessage': (msg: RoomMessage) => void,
  'room:update': (isOpen: Room['isOpen']) => void,
}

export interface ClientToServerEvents {
  'room:unJoin': (slug: Room['slug'], cb: (result: Error | ResponseService) => void) => void,
  'room:paginate': (request: ApiValidator['schema']['props'], cb: (result: Error | ResponseService) => void) => void,
  'room:create': (request: RoomValidator['schema']['props'] | any, cb: (result: Error | ResponseService) => void) => void,
  'room:update': (slug: Room['slug'], request: RoomValidator['schema']['props'], cb: (result: Error | ResponseService) => void) => void,
  'room:join': (slug: Room['slug'], request: ApiValidator['schema']['props'] | any, cb: (result: Error | ResponseService) => void) => void,
  'room:getMessages': (slug: Room['slug'], request: ApiValidator['schema']['props'] | any, cb: (result: Error | ResponseService) => void) => void,
  'room:sendMessage': (slug: Room['slug'], request: RoomMessageValidator['schema']['props'] | any, cb: (result: Error | ResponseService) => void) => void,
}

export interface InterServerEvents {}

export interface SocketData {
  rooms: Room['slug'][],
}
