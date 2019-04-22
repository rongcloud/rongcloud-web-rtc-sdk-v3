import utils from '../../utils';
import EventEmitter from '../../event-emitter';
import { DownEvent } from '../../event-name';
import { ErrorType } from '../../error';
import { CommonEvent } from './events';
import { UserState, PingCount, LogTag } from '../../enum';
import * as common from '../../common';
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
const errorHandler = (code) => {
  let error = ErrorType[code] || {
    code
  };
  return error;
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
    im.statusWatch = im.statusWatch || utils.noop;
    im.statusWatch((status) => {
      switch (status) {
        case CONNECTED:
          init();
          context.emit(CommonEvent.CONNECTED);
          break;
      }
      utils.extend(context, {
        connectState: status
      });
    });
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
      let isCustom = utils.isEqual(im.MessageType.UnknownMessage, messageType);
      let clear = (msg, content) => {
        delete content.objectName;
        delete content.messageName;
        delete msg.conversationType;
        delete msg.messageId;
        delete msg.offLineMessage;
        delete msg.receivedStatus;
        delete msg.messageType;
        delete msg.targetId;
        delete msg.messageDirection;
      };
      let msg = utils.parse(utils.toJSON(message));
      let content = {};
      if (isCustom) {
        let customMsg = msg.content;
        content = customMsg.message.content;
      } else {
        content = msg.content
      }
      clear(msg, content);
      utils.extend(msg, {
        content
      });
      msg = utils.rename(msg, {
        objectName: 'name',
        messageUId: 'uId',
        senderUserId: 'senderId'
      })
      return msg
    };
    im.messageWatch = im.messageWatch || utils.noop;
    im.messageWatch((message) => {
      let { messageType: type, senderUserId: id, content: { uris, users } } = message;
      let user = { id };
      switch (type) {
        case Message.STATE:
          roomEventHandler(users);
          break;
        case Message.PUBLISH:
          user = { id, uris };
          common.dispatchStreamEvent(user, (user) => {
            context.emit(DownEvent.STREAM_PUBLISHED, user);
          });
          break;
        case Message.UNPUBLISH:
          user = { id, uris };
          common.dispatchStreamEvent(user, (user) => {
            context.emit(DownEvent.STREAM_UNPUBLISHED, user);
          });
          break;
        case Message.MODIFY:
          user = { id, uris };
          common.dispatchStreamEvent(user, (user) => {
            common.dispatchOperationEvent(user, (event, user) => {
              context.emit(event, user);
            });
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
        onSuccess: ({ users, token }) => {
          context.rtcPing(room);
          let { id: currentUserId } = context.getUser();
          utils.forEach(users, (user, userId) => {
            user = user || {};
            // 过滤自己和为空的用户
            if (utils.isEmpty(user) || utils.isEqual(currentUserId, user.id)) {
              delete users[userId];
            }
            let { uris } = user;
            if (!utils.isUndefined(uris)) {
              uris = utils.parse(uris);
              utils.extend(user, {
                uris
              });
            }
          });
          utils.extend(room, {
            rtcToken: token,
            users
          });
          context.emit(CommonEvent.JOINED, room);
          resolve(users);
        },
        onError: (code) => {
          return reject(errorHandler(code));
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
          return reject(errorHandler(code));
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
          return reject(errorHandler(code));
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
          return reject(errorHandler(code));
        }
      });
    });
  }
  getRTCToken() {
    let { room: { rtcToken } } = this;
    return rtcToken;
  }
  getRoomId() {
    let { room: { id } } = this;
    return id;
  }
  getMSUrl() {
    let { im } = this;
    let navi = im.getInstance().getNavi();
    let { voipCallInfo: rtcInfo } = navi;
    rtcInfo = rtcInfo || '{"callEngine": [{}]}'
    rtcInfo = utils.parse(rtcInfo);
    let engines = rtcInfo.callEngine;
    let engine = utils.filter(engines, (e) => {
      return e.engineType === 4;
    })[0];
    let { backupMediaServer: urls, mediaServer } = engine;
    if (utils.isUndefined(urls)) {
      urls = [];
    }
    urls.unshift(mediaServer);
    return urls;
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
          return reject(errorHandler(code));
        }
      });
    });
  }
  sendMessage(message) {
    let { im, room, RongIMLib } = this;
    return utils.deferred((resolve, reject) => {
      let conversationType = 12,
        targetId = room.id;
      let register = (name) => {
        let isCounted = false;
        let isPersited = false;
        let tag = new RongIMLib.MessageTag(isCounted, isPersited);
        let { content } = message;
        let props = utils.map(utils.toArray(content), (columns) => { return columns[0]; })
        im.registerMessageType(name, name, tag, props);
      };
      let create = () => {
        let { name, content } = message;
        if (utils.isUndefined(im.RegisterMessage[name])) {
          register(name);
        }
        return new im.RegisterMessage[name](content);
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
  isIMReady() {
    let context = this;
    let { RongIMLib: { ConnectionStatus: { CONNECTED } } } = context;
    return context.connectState === CONNECTED;
  }
  getAppInfo() {
    let context = this;
    let { im } = context;
    return im.getInstance().getAppInfo();
  }
  isJoined() {
    let context = this;
    return context.isJoinRoom;
  }
  isSupportRTC() {
    let context = this;
    let { im } = context;
    let isSupport = false;
    if (utils.isFunction(im.prototype.RTCPing)) {
      isSupport = true;
    }
    return isSupport;
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
    let { Inner } = ErrorType;
    timer.resume(() => {
      if (count > PingCount) {
        timer.pause();
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
          Logger.error(LogTag.IM, {
            msg: 'RTC Ping Error' + code
          });
        }
      });
    }, true);
  }
}

export default Message;