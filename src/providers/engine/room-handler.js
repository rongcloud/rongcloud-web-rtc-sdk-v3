import { UpEvent, DownEvent } from '../../event-name';
import utils from '../../utils';
import { request } from './request';
import { Path } from './path';
function RoomHandler(im) {
  let join = (room) => {
    return im.joinRoom(room).then(() => {
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
      let roomId = im.getRoomId();
      let token = im.getToken();
      if(utils.isString(token)){
        let url = utils.tplEngine(Path.EXIT, {
          roomId
        });
        request.post({
          path: url,
          body: {
            token
          }
        });
      }
    });
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