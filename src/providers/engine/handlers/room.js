import { UpEvent } from '../../../event-name';
import utils from '../../../utils';
import request from '../request';
import { Path } from '../path';
import Logger from '../../../logger';
import { LogTag } from '../../../enum';
import { ErrorType } from '../../../error';
import * as common from '../../../common';

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
    return utils.deferred((resolve, reject) => {
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
    return utils.deferred((resolve, reject) => {
      request.post({
        path: url,
        headers,
        body: {
          token
        }
      }).then(() => {
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
      }, (error) => {
        Logger.log(LogTag.ROOM_HANDLER, {
          msg: 'leave:ms:error',
          roomId,
          error,
          user
        });
        reject(error);
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