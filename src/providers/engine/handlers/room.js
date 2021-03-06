import { UpEvent } from '../../../event-name';
import utils from '../../../utils';
import request from '../request';
import { Path } from '../path';
import Logger from '../../../logger';
import { LogTag, STAT_NAME } from '../../../enum';
import { ErrorType } from '../../../error';
import * as common from '../../../common';
import { CommonEvent } from '../events';

function RoomHandler(im, option) {
  let join = (room) => {
    Logger.log(LogTag.ROOM_HANDLER, {
      msg: 'join:before',
      room
    });
    let { Inner } = ErrorType;
    if (im.isJoined()) {
      Logger.log(LogTag.ROOM_HANDLER, {
        msg: 'join:after',
        extra: 'repeate join room'
      });
      return utils.Defer.reject(Inner.ROOM_REPEAT_JOIN);
    }
    if (!im.isIMReady()) {
      Logger.log(LogTag.ROOM_HANDLER, {
        msg: 'im:connected',
        extra: 'IM not connected'
      });
      return utils.Defer.reject(Inner.IM_NOT_CONNECTED);
    }
    return utils.deferred((resolve, reject) => {
      let { mode } = option;
      utils.extend(room, {
        mode
      })
      im.joinRoom(room).then((users) => {
        Logger.log(LogTag.ROOM_HANDLER, {
          msg: 'join:after',
          users
        });
        users = utils.toArray(users);
        users = utils.map(users, (user) => {
          return {
            id: user[0]
          };
        });
        im.emit(CommonEvent.SEND_REPORT, {
          type: STAT_NAME.R1,
          name: UpEvent.ROOM_JOIN,
          content: {}
        });
        resolve({
          users
        });
      }).catch((error) => {
        Logger.log(LogTag.ROOM_HANDLER, {
          msg: 'join:after:error',
          room,
          error
        });
        reject(error);
      });
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
    let token = im.getRTCToken();
    let url = utils.tplEngine(Path.EXIT, {
      roomId
    });
    let headers = common.getHeaders(im);
    utils.extend(im, {
      isJoinRoom: false
    });
    let leaveRoom = (resolve, reject) => {
      im.leaveRoom().then(() => {
        Logger.log(LogTag.ROOM_HANDLER, {
          msg: 'leave:after',
          roomId,
          user
        });
        resolve();
      }, error => {
        Logger.log(LogTag.ROOM_HANDLER, {
          msg: 'leave:im:error',
          roomId,
          error,
          user
        });
        reject(error);
      });
    };
    return utils.deferred((resolve, reject) => {
      request.post({
        path: url,
        headers,
        body: {
          token
        }
      }).then(() => {
        leaveRoom(resolve, reject);
      }, (error) => {
        Logger.log(LogTag.ROOM_HANDLER, {
          msg: 'leave:ms:error',
          roomId,
          error,
          user
        });
        leaveRoom(resolve, reject);
      });
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