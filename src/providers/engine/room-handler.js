import { UpEvent } from '../../event-name';
import utils from '../../utils';
import { im } from './im';

function RoomHandler() {
  let join = (room) => {
    return im.joinRoom(room);
  };
  let leave = (room) => {
    return im.leaveRoom(room);
  };
  let get = (room) => {
    return im.getRoom(room);
  };
  let dispatch = (event, args) => {
    switch (event) {
      case UpEvent.ROOM_JOIN:
        return join(...args);
      case UpEvent.ROOM_LEAVE:
        return leave(...args);
      case UpEvent.ROOM_GET:
        return get(...args);
      default:
        utils.Logger.log(`RoomHandler: unkown upevent ${event}`);
    }
  };
  return {
    dispatch
  };
}

export default RoomHandler();