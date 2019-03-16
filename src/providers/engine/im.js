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
  STATE: 'RTCUserChangeMessage',
  ROOM_NOTIFY: 'RTCRoomDataNotifyMessage',
  USER_NOTIFY: 'RTCUserDataNotifyMessage'
};

const MessageName = {
  PUBLISH: 'RCRTC:PublishResource',
  UNPUBLISH: 'RCRTC:UnpublishResource',
  MODIFY: 'RCRTC:ModifyResource',
  STATE: 'RCRTC:state',
  ROOM_NOTIFY: 'RCRTC:RoomNtf',
  USER_NOTIFY: 'RCRTC:UserNtf'
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
const getMsgName = (type) => {
  switch (type) {
    case Message.PUBLISH:
      return MessageName.PUBLISH;
    case Message.UNPUBLISH:
      return MessageName.UNPUBLISH;
    case Message.MODIFY:
      return MessageName.MODIFY;
    case Message.STATE:
      return MessageName.STATE;
    case Message.ROOM_NOTIFY:
      return MessageName.ROOM_NOTIFY;
    case Message.USER_NOTIFY:
      return MessageName.USER_NOTIFY;
  }
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
            Logger.log(LogTag.ROOM, {
              msg: 'room:member:left',
              user
            });
            context.emit(DownEvent.ROOM_USER_LEFT, { id });
            break;
          default:
            Logger.warn(`UserState: unkown state ${state}`);
        }
      });
    };
    /**
     * 收到 UnkownMessage 自动转为 ObjectName + "Message" 做为 MessageType
     * 免去注册自定义消息逻辑
     */
    let renameMessage = (message) => {
      let { messageType } = message;
      if (!utils.isEqual(im.MessageType.UnknownMessage, messageType)) {
        return message;
      }
      let { objectName } = message;
      let clear = (msg, content) => {
        let { objectName: objName } = content;
        if (utils.isEqual(objName, objectName)) {
          delete content.objectName;
        }
        delete msg.conversationType;
        delete msg.messageId;
        delete msg.offLineMessage;
        delete msg.receivedStatus;
        delete msg.messageType;
        delete msg.targetId;
      };
      let msg = utils.parse(utils.toJSON(message));
      let { content: { message: { content } } } = msg;
      clear(msg, content);
      utils.extend(msg, {
        content
      });
      msg = utils.rename(msg, {
        objectName: 'name',
        messageUId: 'uId',
        senderUserId: 'senderId',
        messageDirection: 'direction'
      })
      return msg
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
          context.emit(DownEvent.MESSAGE_RECEIVED, renameMessage(message));
      }
      Logger.log(LogTag.IM, {
        msg: 'receive:message',
        message
      });
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
      name: getMsgName(Message.PUBLISH),
      props: ['uris']
    }, {
      type: Message.UNPUBLISH,
      name: getMsgName(Message.UNPUBLISH),
      props: ['uris']
    }, {
      type: Message.MODIFY,
      name: getMsgName(Message.MODIFY),
      props: ['uris']
    }, {
      type: Message.STATE,
      name: getMsgName(Message.STATE),
      props: ['users']
    }, {
      type: Message.ROOM_NOTIFY,
      name: getMsgName(Message.ROOM_NOTIFY),
      props: ['content']
    }, {
      type: Message.USER_NOTIFY,
      name: getMsgName(Message.USER_NOTIFY),
      props: ['content']
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
        onSuccess: (users) => {
          utils.extend(room, {
            users
          });
          context.emit(CommonEvent.JOINED, room);
          context.rtcPing(room);
          resolve(users);
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
    context.emit(CommonEvent.LEFT, room);
    return utils.deferred((resolve, reject) => {
      im.getInstance().quitRTCRoom(room, {
        onSuccess: () => {
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
  getAuthPath() {
    let { im } = this;
    let navi = im.getInstance().getNavi();
    return navi.authHost || 'http://navqa.cn.ronghub.com';
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
  setUserData(key, value, isInner, message) {
    let { room: { id }, im } = this;
    value = utils.toJSON(value);
    Logger.log(LogTag.STREAM_HANDLER, {
      msg: 'setUserData:before',
      roomId: id,
      value,
      message
    });
    return utils.deferred((resolve, reject) => {
      im.getInstance().setRTCUserData(id, key, value, isInner, {
        onSuccess: function () {
          Logger.log(LogTag.STREAM_HANDLER, {
            msg: 'setUserData:after',
            roomId: id,
            value,
            message
          });
          resolve();
        },
        onError: reject
      }, message);
    });
  }
  getUserData(keys, isInner) {
    let { room: { id }, im } = this;
    if (!utils.isArray(keys)) {
      keys = [keys];
    }
    return utils.deferred((resolve, reject) => {
      im.getInstance().getRTCUserData(id, keys, isInner, {
        onSuccess: resolve,
        onError: function (error) {
          reject(error);
        }
      });
    });
  }
  removeUserData(keys, isInner, message) {
    let { room: { id }, im } = this;
    if (!utils.isArray(keys)) {
      keys = [keys];
    }
    return utils.deferred((resolve, reject) => {
      im.getInstance().removeRTCUserData(id, keys, isInner, {
        onSuccess: resolve,
        onError: reject
      }, message);
    });
  }
  setRoomData(key, value, isInner, message) {
    let { room: { id }, im } = this;
    return utils.deferred((resolve, reject) => {
      im.getInstance().setRTCRoomData(id, key, value, isInner, {
        onSuccess: resolve,
        onError: reject
      }, message);
    });
  }
  getRoomData(keys, isInner) {
    let { room: { id }, im } = this;
    if (!utils.isArray(keys)) {
      keys = [keys];
    }
    return utils.deferred((resolve, reject) => {
      im.getInstance().getRTCRoomData(id, keys, isInner, {
        onSuccess: function (data) {
          resolve(data);
        },
        onError: reject
      });
    });
  }
  removeRoomData(keys, isInner, message) {
    let { room: { id }, im } = this;
    if (!utils.isArray(keys)) {
      keys = [keys];
    }
    return utils.deferred((resolve, reject) => {
      im.getInstance().removeRTCRoomData(id, keys, isInner, {
        onSuccess: resolve,
        onError: reject
      }, message);
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
  getMessage(type, content) {
    let name = getMsgName(type);
    content = utils.toJSON(content);
    return {
      name,
      content
    };
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