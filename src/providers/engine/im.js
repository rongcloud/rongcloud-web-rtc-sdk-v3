import utils from '../../utils';
import EventEmitter from '../../event-emitter';
import { DownEvent } from '../../event-name';
const Message = {
  JOIN: 'RTCJoinRoomMessage',
  LEAVE: 'RTCLeftRoomMessage',
  PUBLISH: 'RTCPublishResourceMessage',
  UNPUBLISH: 'RTCUnpublishResourceMessage',
  MODIFY: 'RTCModifyResourceMessage'
};
class IM extends EventEmitter{
  constructor(){
    super();
  }
  setOption(option) {
    let context = this;
    let { RongIMLib: { RongIMClient: im }, RongIMLib } = option;
    utils.extend(context, {
      im,
      RongIMLib
    });
    let { ConnectionStatus: { CONNECTED } } = RongIMLib;
    im.statusWatch((state) => {
      let isConnected = state === CONNECTED;
      if (isConnected) {
        context.registerMessage();
      }
    });
    im.messageWatch((message) => {
      let { messageType: type } = message;
      switch (type) {
        case Message.JOIN:
          context.emit(DownEvent.ROOM_USER_JOINED, message);
          break;
        case Message.LEAVE:
          context.emit(DownEvent.ROOM_USER_LEFT, message);
          break;
        case Message.PUBLISH:
          context.emit(DownEvent.STREAM_READIY, message);
          break;
        case Message.UNPUBLISH:
          context.emit(DownEvent.STREAM_UNPUBLISH, message);
          break;
        case Message.MODIFY:
          context.emit(DownEvent.STREAM_CHANGED, message);
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
      props: ['url', 'type', 'tag', 'streamId']
    }, {
      type: Message.UNPUBLISH,
      name: 'RCRTC:UnpublishResource',
      props: ['url', 'type', 'tag', 'streamId']
    }, {
      type: Message.MODIFY,
      name: 'RCRTC:ModifyResource',
      props: ['url', 'type', 'tag', 'streamId']
    }];
    utils.forEach(messages, (message) => {
      register(message);
    });
  }
  joinRoom(room) {
    let context = this;
    let { im } = context;
    return utils.deferred((resolve, reject) => {
      im.getInstance().joinRTCRoom(room, {
        onSuccess: () => {
          utils.extend(context, {
            room
          });
          resolve();
        },
        onErrror: reject
      });
    });
  }
  leaveRoom(room) {
    let { im } = this;
    return utils.deferred((resolve, reject) => {
      im.getInstance().quitRTCRoom(room, {
        onSuccess: resolve,
        onErrror: reject
      });
    });
  }
  getRoom(room) {
    let { im } = this;
    return utils.deferred((resolve, reject) => {
      im.getInstance().getRTCRoomInfo(room, {
        onSuccess: resolve,
        reject: reject
      });
    });
  }
  sendMessage(message) {
    let { im, room, RongIMClient } = this;
    return utils.deferred((resolve, reject) => {
      let conversationType = 12,
        targetId = room.id;
      let create = () => {
        let { type, content } = message;
        return new RongIMClient.RegisterMessage[type](content);
      };
      let msg = create();
      im.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: resolve,
        onErrror: reject
      });
    });
  }
}

export default Message;
export const im = new IM();