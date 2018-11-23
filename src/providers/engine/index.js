/* 
  1、对上层（RongRTC）暴露 API
  2、如果后期 rtc.js 重构或 API 有重大调整，可重写此文件，保证对上层 API 不变
*/
import { RTC, EventHandler } from './rtc';
import utils from '../../utils';
import EventEmitter from '../../event-emitter';
import { EventName, Error } from '../../enum';

let option = {
  url: 'https://rtcapi.ronghub.com/nav/websocketlist',
  currentUsreId: ''
};
let rtc = null;
let eventHandler = null;
let eventEmitter = null;

let getCurrentUser = () => {
  return {
    id: option.currentUsreId
  };
};
let setEventHandler = () => {
  var eventFactory = {
    // user = > {id: 'userId', type: 1}
    onJoinComplete: (data) => {
      let user = getCurrentUser();
      let { isJoined } = data;
      let error = isJoined ? null : Error.JOIN_ERROR;
      eventEmitter.emit(EventName.ROOM_SELF_JOINED, user, error);
    },
    // user = > {id: 'userId'}
    onLeaveComplete: (data) => {
      let { isLeft } = data;
      let user = getCurrentUser();
      let error = isLeft ? null : Error.LEAVE_ERROR;
      eventEmitter.emit(EventName.ROOM_SELF_LEFT, user, error);
    },
    onAddStream: (result) => {
      let { userId, userType } = result;
      let user = {
        id: userId,
        type: userType
      };
      eventEmitter.emit(EventName.STREAM_ADDED, user);
    },
    onUserJoined: (user) => {
      let { userId, userType } = user;
      user = {
        id: userId,
        type: userType
      };
      eventEmitter.emit(EventName.ROOM_JOINED, user);
    },
    onUserLeft: (user) => {
      let { userId, userType } = user;
      user = {
        id: userId,
        type: userType
      };
      eventEmitter.emit(EventName.ROOM_LEAVED, user);
    },
    onTurnTalkType: (user) => {
      let { userId, type } = user;
      user = {
        id: userId,
        type: type
      };
      eventEmitter.emit(EventName.ROOM_CHANGED, user);
    },
    onConnectionStateChanged: (network) => {
      network = utils.rename(network, {
        connectionState: 'state'
      });
      eventEmitter.emit(EventName.NETWORK, network);
    },
    // 创建白板回调 
    onWhiteBoardURL: (data) => {
      // TODO: isSuccess 为 false 情况处理，需要修改 rtc.js ，后续处理
      let { isSuccess, url } = data;
      let error = isSuccess ? null : Error.CREATE_WB_ERROR;
      let whiteboard = {
        url
      };
      eventEmitter.emit(EventName.WHITEBOARD_CREATED, whiteboard, error);
    },
    // 获取白板
    onWhiteBoardQuery: (whiteboard) => {
      // TODO: isSuccess 为 false 情况处理，需要修改 rtc.js ，后续处理
      let { isSuccess, url } = data;
      let error = isSuccess ? null : Error.GET_WB_ERROR;
      let whiteboard = {
        list: [{
          url
        }]
      };
      eventEmitter.emit(EventName.WHITEBOARD_GETLIST, whiteboard, error);
    },
    onNetworkSentLost: (network) => {
      // TODO: eventEmitter.emit(EventName.NETWORK, network);
    },
    onStartScreenShareComplete: (data) => {
      let { isSuccess, code } = data;
      let errors = {
        1: Error.SCREEN_SHARE_PLUGIN_SUPPORT_ERROR,
        2: Error.SCREEN_SHARE_NOT_INSTALL_ERROR
      };
      let error = isSuccess ? null : errors[code];
      let result = null;
      eventEmitter.emit(EventName.SCREEN_SHARE_START, result, error);
    },
    onStopScreenShareComplete: () => {
      let result = null;
      eventEmitter.emit(EventName.SCREEN_SHARE_STOP, result);
    }
  };
  utils.forEach(eventFactory, function (event, name) {
    eventHandler.on(name, event);
  });
};
export default class RTCEngine {
  constructor(_option) {
    utils.extend(option, _option);
    rtc = new RTC(option.url);
    eventEmitter = new EventEmitter();
    eventHandler = new EventHandler();
    setEventHandler();
    rtc.setRongRTCEngineEventHandle(eventHandler);

  }

  joinRoom(room) {
    return utils.deferred((resolve, reject) => {
      console.log(room);
    });
  }

  leaveRoom(room) {
    console.log(room);
  }

  getStream(user) {
    console.log(user);
  }

  mute(user) {
    console.log(user);
  }

  unmute(user) {
    console.log(user);
  }

  disableVideo(user) {
    console.log(user);
  }

  enableVideo(user) {
    console.log(user);
  }

  createWhiteBoard() {
    console.log(user);
  }

  getWhiteBoardList() {
    console.log(user);
  }

  startScreenShare() {

  }

  stopScreenShare() {

  }

  _on(name, event) {
    eventEmitter.on(name, event);
  }
}