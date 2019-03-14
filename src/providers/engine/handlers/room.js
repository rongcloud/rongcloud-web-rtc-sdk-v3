import { UpEvent, DownEvent } from '../../../event-name';
import utils from '../../../utils';
import { request } from '../request';
import { Path } from '../path';
import Logger from '../../../logger';
import { LogTag } from '../../../enum';
import { ErrorType } from '../../../error';
function RoomHandler(im) {
  let join = (room) => {
    Logger.log(LogTag.ROOM_HANDLER, {
      msg: 'join:before',
      room
    });
    if (im.isJoined()) {
      let { Inner } = ErrorType;
      Logger.log(LogTag.ROOM_HANDLER, {
        msg: 'join:after',
        extra: 'repeate join room'
      });
      return utils.Defer.reject(Inner.ROOM_REPEAT_JOIN);
    }
    return im.joinRoom(room).then((users) => {
      Logger.log(LogTag.ROOM_HANDLER, {
        msg: 'join:after',
        room
      });
      utils.forEach(users, (user, id) => {
        Logger.log(LogTag.ROOM_HANDLER, {
          msg: 'join:after:existUsers',
          user
        });
        im.emit(DownEvent.ROOM_USER_JOINED, {
          id
        });
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
    let user = im.getUser();
    Logger.log(LogTag.ROOM_HANDLER, {
      msg: 'leave:before',
      roomId,
      user
    });
    return im.leaveRoom().then(() => {
      Logger.log(LogTag.ROOM_HANDLER, {
        msg: 'leave:after',
        roomId,
        user
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
        error,
        user
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