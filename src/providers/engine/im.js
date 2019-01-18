import utils from '../../utils';
import EventEmitter from '../../event-emitter';
import { DownEvent } from '../../event-name';
import { ErrorType } from '../../error';
import { CommonEvent } from './events';
const Message = {
  JOIN: 'RTCJoinRoomMessage',
  LEAVE: 'RTCLeftRoomMessage',
  PUBLISH: 'RTCPublishResourceMessage',
  UNPUBLISH: 'RTCUnpublishResourceMessage',
  MODIFY: 'RTCModifyResourceMessage'
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
  constructor() {
    super();
    let timer = new utils.Timer({
      timeout: Timeout.TIME
    });
    utils.extend(this, {
      timer
    });
  }
  setOption(option) {
    let context = this;
    let { RongIMLib: { RongIMClient: im }, RongIMLib } = option;
    let connectState = -1;
    utils.extend(context, {
      connectState,
      im,
      RongIMLib
    });
    let { ConnectionStatus: { CONNECTED } } = RongIMLib;
    im.statusWatch((state) => {
      let isConnected = state === CONNECTED;
      if (isConnected) {
        context.registerMessage();
        utils.extend(context, {
          connectState: state
        });
      }
    });
    im.messageWatch((message) => {
      let { messageType: type, senderUserId: id, content: { uris } } = message;
      let user = { id };
      switch (type) {
        case Message.JOIN:
          context.emit(DownEvent.ROOM_USER_JOINED, user);
          break;
        case Message.LEAVE:
          context.emit(DownEvent.ROOM_USER_LEFT, user);
          break;
        case Message.PUBLISH:
          user = { id, uris };
          context.emit(DownEvent.STREAM_READIY, user);
          break;
        case Message.UNPUBLISH:
          user = { id, uris };
          context.emit(DownEvent.STREAM_UNPUBLISH, user);
          break;
        case Message.MODIFY:
          user = { id, uris };
          context.emit(DownEvent.STREAM_CHANGED, user);
          break;
        default:
          utils.Logger.log(`MessageWatch: unkown message type ${type}`);
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
      type: Message.JOIN,
      name: 'RCRTC:Join',
      props: []
    }, {
      type: Message.LEAVE,
      name: 'RCRTC:Left',
      props: []
    }, {
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
    }];
    utils.forEach(messages, (message) => {
      register(message);
    });
  }
  joinRoom(room) {
    let context = this;
    let { im, timer } = context;
    utils.extend(context, {
      room
    });
    return utils.deferred((resolve, reject) => {
      im.getInstance().joinRTCRoom(room, {
        onSuccess: () => {
          context.emit(CommonEvent.JOINED, room);
          timer.resume(() => {
            im.getInstance().RTCPing(room);
          });
          resolve();
        },
        onError: (code) => {
          return errorHandler(code, reject);
        }
      });
    });
  }
  leaveRoom() {
    let { im, room, timer } = this;
    timer.pause();
    return utils.deferred((resolve, reject) => {
      im.getInstance().quitRTCRoom(room, {
        onSuccess: resolve,
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
  getRoomId(){
    let { room: { id } } = this;
    return id;
  }
  getUser() {
    let { room: { user } } = this;
    return user;
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
    return utils.deferred((resolve) => {
      let conversationType = 12,
        targetId = room.id;
      let create = () => {
        let { type, content } = message;
        return new im.RegisterMessage[type](content);
      };
      let msg = create();
      im.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: () => {
          resolve(room);
        },
        onError: (code) => {
          utils.Logger.warn('SendMessage Error:', code);
        }
      });
    });
  }
  isReady() {
    let context = this;
    let { RongIMLib: { ConnectionStatus: { CONNECTED } } } = context;
    return context.connectState === CONNECTED;
  }
}

export default Message;