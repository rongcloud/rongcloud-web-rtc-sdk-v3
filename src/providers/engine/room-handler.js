import { UpEvent, DownEvent } from '../../event-name';
import utils from '../../utils';
import Message from './im';
function RoomHandler(im) {
  let join = (room) => {
    return im.joinRoom(room).then(() => {
      im.sendMessage({
        type: Message.JOIN,
        content: {}
      });
      return im.getExistUsers().then(({ users }) => {
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
  let leave = () => {
    return im.leaveRoom().then(() => {
      return im.sendMessage({
        type: Message.LEAVE,
        content: {}
      });
    })
  };
  let get = () => {
    return im.getRoom();
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