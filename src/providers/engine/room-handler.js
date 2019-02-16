import { UpEvent, DownEvent } from '../../event-name';
import utils from '../../utils';
import { request } from './request';
import { Path } from './path';
import Logger from '../../logger';
import { LogTag } from '../../enum';
function RoomHandler(im) {
  let join = (room) => {
    Logger.log(LogTag.ROOM_HANDLER, {
      msg: 'join:before',
      room
    });
    return im.joinRoom(room).then(() => {
      Logger.log(LogTag.ROOM_HANDLER, {
        msg: 'join:after',
        room
      });
      Logger.log(LogTag.ROOM_HANDLER, {
        msg: 'getUsers:before',
        room
      });
      return im.getExistUsers().then(({ users }) => {
        Logger.log(LogTag.ROOM_HANDLER, {
          msg: 'getUsers:after',
          room,
          users
        });
        utils.forEach(users, (user) => {
          let { userId: id } = user;
          im.emit(DownEvent.ROOM_USER_JOINED, {
            id
          });
        });
      }, error => {
        Logger.log(LogTag.ROOM_HANDLER, {
          msg: 'getUsers:after',
          room,
          error
        });
        return error;
      });
    }, (error) => {
      Logger.log(LogTag.ROOM_HANDLER, {
        msg: 'join:after',
        room,
        error
      });
      return error;
    }).then(() => {
      return room;
    });
  };
  let leave = () => {
    let roomId = im.getRoomId();
    Logger.log(LogTag.ROOM_HANDLER, {
      msg: 'leave:before',
      roomId
    });
    return im.leaveRoom().then(() => {
      Logger.log(LogTag.ROOM_HANDLER, {
        msg: 'leave:after',
        roomId
      });
      let token = im.getToken();
      if (utils.isString(token)) {
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
    }, error => {
      Logger.log(LogTag.ROOM_HANDLER, {
        msg: 'leave:after',
        roomId,
        error
      });
      return error;
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
        Logger.warn(LogTag.ROOM_HANDLER, {
          event,
          msg: 'unkown event'
        });
    }
  };
  return {
    dispatch
  };
}

export default RoomHandler;