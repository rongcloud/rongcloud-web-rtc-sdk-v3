import utils from '../../utils';
const Message = {
  JOIN: 'RTCJoinRoomMessage',
  LEAVE: 'RTCLeftRoomMessage',
  PUBLISH: 'RTCPublishResourceMessage',
  UNPUBLISH: 'RTCUnpublishResourceMessage',
  MODIFY: 'RTCModifyResourceMessage'
};
class IM {
  setOption(option) {
    let { RongIMLib: { RongIMClient: im }, RongIMLib } = option;
    utils.extend(this, {
      im,
      RongIMLib
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
      im.joinRTCRoom(room, {
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
      im.quitRTCRoom(room, {
        onSuccess: resolve,
        onErrror: reject
      });
    });
  }
  getRoom(room) {
    let { im } = this;
    return utils.deferred((resolve, reject) => {
      im.getRTCRoomData(room, {
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
      im.sendMessage(conversationType, targetId, msg, {
        onSuccess: resolve,
        onErrror: reject
      });
    });
  }
}

export default Message;
export const im = new IM();