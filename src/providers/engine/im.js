import utils from '../../utils';
const Message = {
  JOIN: 'RTCJoinRoomMessage',
  LEAVE: 'RTCLeftRoomMessage',
  MODIFY: 'RTCModifyResourceMessage'
};
class IM {
  setOption(option) {
    let { RongIMLib: { RongIMClient } } = option;
    let im = RongIMClient.getInstance();
    utils.extend(this, {
      im
    });
  }
  registerMessage() {
    let { RongIMLib: { RongIMClient }, RongIMLib } = this;
    let register = (message) => {
      let { type, name, props } = message;
      let isCounted = false;
      let isPersited = false;
      let tag = new RongIMLib.MessageTag(isCounted, isPersited);
      RongIMClient.registerMessageType(type, name, tag, props);
    };
    let messages = [{
      type: Message.JOIN,
      name: 'RCRTC:Join',
      props: ['url', 'type', 'tag', 'streamId']
    }, {
      type: Message.LEAVE,
      name: 'RCRTC:Left',
      props: []
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
    let { im } = this;
    return utils.deferred((resolve, reject) => {
      im.joinRTCRoom(room, {
        onSuccess: resolve,
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
  getRoom(room){
    let { im } = this;
    return utils.deferred((resolve, reject) => {
      im.getRTCRoomData(room, {
        onSuccess: resolve,
        reject: reject
      });
    });
  }
}

export default Message;
export const im = new IM();