import { UpEvent, DownEvent } from '../../event-name';
import utils from '../../utils';
import Message, { im } from './im';

function RoomHandler() {
  let join = (room) => {
    return im.joinRoom(room).then(() => {
      im.sendMessage(room, {
        type: Message.JOIN,
        content: {}
      });
      return im.getExistUsers(room).then(({ users }) => {
        utils.forEach(users, (user) => {
          let { userId: id } = user;
          im.emit(DownEvent.ROOM_USER_JOINED, {
            id
          });
        });
      });
    }).then(() => {
      return room;
    });
  };
  let leave = (room) => {
    return im.leaveRoom(room).then(() => {
      return im.sendMessage(room, {
        type: Message.LEAVE,
        content: {}
      });
    }).then(() => {
      return room;
    });
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

export default RoomHandler;