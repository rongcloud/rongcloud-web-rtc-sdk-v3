import utils from '../../utils';
import EventEmitter from '../../event-emitter';
import { DownEvent } from '../../event-name';
import { ErrorType } from '../../error';
import { CommonEvent } from './events';
import { StreamType, StreamState, UserState, PingCount, LogTag } from '../../enum';
import Logger from '../../logger';
const Message = {
  PUBLISH: 'RTCPublishResourceMessage',
  UNPUBLISH: 'RTCUnpublishResourceMessage',
  MODIFY: 'RTCModifyResourceMessage',
  STATE: 'RTCUserChangeMessage'
};
const Timeout = {
  TIME: 10 * 1000
};
const errorHandler = (code, reject) => {
  let error = ErrorType[code] || {
    code
  };
  reject(error);
};
export class IM extends EventEmitter {
  constructor(option) {
    super();
    let timer = new utils.Timer({
      timeout: Timeout.TIME
    });
    let context = this;
    let isJoinRoom = false;
    utils.extend(context, {
      timer,
      isJoinRoom
    });
    let { RongIMLib: { RongIMClient: im }, RongIMLib } = option;
    let init = () => {
      if (context.isJoinRoom) {
        context.rePing();
      }
      context.registerMessage();
    };
    let connectState = -1;
    try {
      connectState = im.getInstance().getCurrentConnectionStatus();
    } catch (error) {
      Logger.error(LogTag.IM, {
        content: error,
        pos: 'new RongRTC'
      });
    }
    let { ConnectionStatus: { CONNECTED } } = RongIMLib;
    utils.extend(context, {
      connectState,
      im,
      RongIMLib
    });
    // 如果实例化 RongRTC 时，IM 已连接成功，主动触发内部 init
    if (utils.isEqual(connectState, CONNECTED)) {
      init();
    }
    im.statusWatch((status) => {
      switch (status) {
        case CONNECTED:
          init();
          break;
      }
      utils.extend(context, {
        connectState: status
      });
    });
    let dispatchStreamEvent = (user, callback) => {
      let { id, uris } = user;
      if (utils.isString(uris)) {
        uris = JSON.parse(uris);
      }
      let streams = [user];
      if (uris) {
        streams = utils.uniq(uris, (target) => {
          let { streamId, tag, mediaType, state } = target;
          return {
            key: [streamId, tag].join('_'),
            value: {
              tag,
              uris,
              mediaType,
              state
            }
          }
        });
      }
      utils.forEach(streams, (stream) => {
        callback({
          id,
          stream
        });
      });
    };
    let getModifyEvents = () => {
      let events = {}, tpl = '{type}_{state}';
      // 禁用视频
      let name = utils.tplEngine(tpl, {
        type: StreamType.VIDEO,
        state: StreamState.DISBALE
      });
      events[name] = DownEvent.STREAM_DISABLED;
      // 启用视频
      name = utils.tplEngine(tpl, {
        type: StreamType.VIDEO,
        state: StreamState.ENABLE
      });
      events[name] = DownEvent.STREAM_ENABLED;
      // 音频静音
      name = utils.tplEngine(tpl, {
        type: StreamType.AUDIO,
        state: StreamState.DISBALE
      });
      events[name] = DownEvent.STREAM_MUTED;
      // 音频取消静音
      name = utils.tplEngine(tpl, {
        type: StreamType.AUDIO,
        state: StreamState.ENABLE
      });
      events[name] = DownEvent.STREAM_UNMUTED;
      return events;
    };
    let roomEventHandler = (users) => {
      utils.forEach(users, (user) => {
        let { userId: id, state } = user;
        switch (+state) {
          case UserState.JOINED:
            context.emit(DownEvent.ROOM_USER_JOINED, { id });
            break;
          case UserState.LEFT:
          case UserState.OFFLINE:
            context.emit(DownEvent.ROOM_USER_LEFT, { id });
            break;
          default:
            Logger.warn(`UserState: unkown state ${state}`);
        }
      });
    };
    im.messageWatch((message) => {
      let { messageType: type, senderUserId: id, content: { uris, users } } = message;
      let user = { id };
      switch (type) {
        case Message.STATE:
          roomEventHandler(users);
          break;
        case Message.PUBLISH:
          user = { id, uris };
          dispatchStreamEvent(user, (user) => {
            context.emit(DownEvent.STREAM_PUBLISHED, user);
          });
          break;
        case Message.UNPUBLISH:
          user = { id, uris };
          dispatchStreamEvent(user, (user) => {
            context.emit(DownEvent.STREAM_UNPUBLISHED, user);
          });
          break;
        case Message.MODIFY:
          user = { id, uris };
          dispatchStreamEvent(user, (user) => {
            let { stream: { mediaType: type, state } } = user;
            let tpl = '{type}_{state}';
            let name = utils.tplEngine(tpl, {
              type,
              state
            });
            let events = getModifyEvents();
            let event = events[name];
            context.emit(event, user);
          });
          break;
        default:
          Logger.warn(`MessageWatch: unkown message type ${message.objectName}`);
      }
    });
  }
  registerMessage() {
    let { im, RongIMLib } = this;
    let register = (message) => {
      let { type, name, props } = message;
      let isCounted = false;
      let isPersited = false;
      let tag = new RongIMLib.MessageTag(isCounted, isPersited);
      im.registerMessageType(type, name, tag, props);
    };
    let messages = [{
      type: Message.PUBLISH,
      name: 'RCRTC:PublishResource',
      props: ['uris']
    }, {
      type: Message.UNPUBLISH,
      name: 'RCRTC:UnpublishResource',
      props: ['uris']
    }, {
      type: Message.MODIFY,
      name: 'RCRTC:ModifyResource',
      props: ['uris']
    }, {
      type: Message.STATE,
      name: 'RCRTC:state',
      props: ['users']
    }];
    utils.forEach(messages, (message) => {
      register(message);
    });
  }
  joinRoom(room) {
    let context = this;
    let { im } = context;
    utils.extend(context, {
      room,
      isJoinRoom: true
    });
    return utils.deferred((resolve, reject) => {
      im.getInstance().joinRTCRoom(room, {
        onSuccess: () => {
          context.emit(CommonEvent.JOINED, room);
          context.rtcPing(room);
          resolve();
        },
        onError: (code) => {
          return errorHandler(code, reject);
        }
      });
    });
  }
  leaveRoom() {
    let context = this;
    let { im, room, timer } = context;
    timer.pause();
    utils.extend(context, {
      isJoinRoom: false
    });
    return utils.deferred((resolve, reject) => {
      im.getInstance().quitRTCRoom(room, {
        onSuccess: () => {
          context.emit(CommonEvent.LEFT, room);
          resolve();
        },
        onError: (code) => {
          return errorHandler(code, reject);
        }
      });
    });
  }
  getRoom() {
    let { im, room } = this;
    return utils.deferred((resolve, reject) => {
      im.getInstance().getRTCRoomInfo(room, {
        onSuccess: resolve,
        reject: (code) => {
          return errorHandler(code, reject);
        }
      });
    });
  }
  getUsers() {
    let { im, room } = this;
    return utils.deferred((resolve, reject) => {
      im.getInstance().getRTCUserInfoList(room, {
        onSuccess: resolve,
        onError: (code) => {
          return errorHandler(code, reject);
        }
      });
    });
  }
  getToken() {
    let { room: { user: { token } } } = this;
    return token;
  }
  getRoomId() {
    let { room: { id } } = this;
    return id;
  }
  getUser() {
    let { room: { user } } = this;
    return user;
  }
  setUserInfo(key, value) {
    let { room, im } = this;
    value = utils.toJSON(value);
    let info = {
      key,
      value
    };
    return utils.deferred((resolve, reject) => {
      im.getInstance().setRTCUserInfo(room, info, {
        onSuccess: resolve,
        onError: reject
      });
    });
  }
  removeUserInfo(keys) {
    let { room, im } = this;
    let info = {
      keys
    };
    return utils.deferred((resolve, reject) => {
      im.getInstance().removeRTCUserInfo(room, info, {
        onSuccess: resolve,
        onError: reject
      });
    });
  }
  getExistUsers() {
    let { im, room } = this;
    return utils.deferred((resolve, reject) => {
      im.getInstance().getRTCUserList(room, {
        onSuccess: resolve,
        onError: (code) => {
          return errorHandler(code, reject);
        }
      });
    });
  }
  sendMessage(message) {
    let { im, room } = this;
    return utils.deferred((resolve, reject) => {
      let conversationType = 12,
        targetId = room.id;
      let create = () => {
        let { type, content } = message;
        return new im.RegisterMessage[type](content);
      };
      let msg = create();
      Logger.log(LogTag.IM, {
        msg: 'send:before',
        message
      });
      im.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: () => {
          Logger.log(LogTag.IM, {
            msg: 'send:after',
            message
          });
          resolve(room);
        },
        onError: (code) => {
          Logger.log(LogTag.IM, {
            msg: 'send:after',
            error: code
          });
          reject(code);
        }
      });
    });
  }
  isReady() {
    let context = this;
    let { RongIMLib: { ConnectionStatus: { CONNECTED } } } = context;
    return context.connectState === CONNECTED;
  }
  isJoined() {
    let context = this;
    return context.isJoinRoom;
  }
  rePing() {
    let context = this;
    let { timer } = context;
    let roomId = context.getRoomId();
    if (!utils.isUndefined(roomId)) {
      timer.pause();
      context.rtcPing({
        id: roomId
      });
    }
  }
  rtcPing(room) {
    let context = this;
    let { im, timer } = context;
    let count = 0;
    let isPinging = false;
    let Status = {
      reset: () => {
        count = 0;
        isPinging = false;
      },
      sum: () => {
        count += 1;
      }
    };
    timer.resume(() => {
      if (count > PingCount) {
        timer.pause();
        let { Inner } = ErrorType;
        utils.extend(context, {
          isJoinRoom: false
        });
        context.emit(CommonEvent.LEFT);
        return context.emit(CommonEvent.ERROR, Inner.SOCKET_UNAVAILABLE);
      }
      // 如果上次 Ping 没有结束，累计 Ping 次数
      if (isPinging) {
        Status.sum();
      }
      isPinging = true;
      im.getInstance().RTCPing(room, {
        onSuccess: () => {
          Status.reset();
        },
        onError: (code) => {
          let error = ErrorType[code];
          if (error) {
            context.emit(CommonEvent.ERROR, error);
            timer.pause();
          }
        }
      });
    }, true);
  }
}

export default Message;