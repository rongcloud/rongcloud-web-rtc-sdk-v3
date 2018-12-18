/* 
  1、对上层（RongRTC）暴露 API
  2、如果后期 rtc.js 重构或 API 有重大调整，可重写此文件，保证对上层 API 不变
*/
import { RTC, EventHandler } from './rtc';
import utils from '../../utils';
import EventEmitter from '../../event-emitter';
import { EventName, ErrorType, StreamType } from '../../enum';
let { Inner: Error } = ErrorType;

let option = {
  url: 'https://rtc.ronghub.com/nav/websocketlist',
  currentUser: ''
};
let rtc = null;
let eventHandler = null;
let eventEmitter = null;

let getCurrentUser = () => {
  return option.currentUser;
};
let isCrruentUser = (user) => {
  return user.id === option.currentUser.id;
}
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
      let user = getCurrentUser();
      let { isLeft } = data;
      if (isLeft) {
        rtc.closeLocalStream();
      }
      let error = isLeft ? null : Error.LEAVE_ERROR;
      eventEmitter.emit(EventName.ROOM_SELF_LEFT, user, error);
    },
    onNotifyUserVideoCreated: (data) => {
      let { userId, resource: type } = data;
      let user = {
        id: userId
      };
      let stream = rtc.getRemoteStream(userId, type);
      let result = {
        user,
        stream: {
          type,
          mediaStream: stream
        }
      };
      eventEmitter.emit(EventName.STREAM_ADDED, result);
    },
    onUserJoined: (user) => {
      let { userId, userType } = user;
      user = {
        id: userId,
        type: userType
      };
      eventEmitter.emit(EventName.ROOM_USER_JOINED, user);
    },
    onUserLeft: (user) => {
      let { userId } = user;
      user = {
        id: userId
      };
      eventEmitter.emit(EventName.ROOM_USER_LEFT, user);
    },
    onNotifyResourceUpdated: (user) => {
      let { userId: id, resource: type } = user;
      user = { id };
      let stream = rtc.getLocalStream();
      let result = {
        user,
        stream: {
          type,
          mediaStream: stream
        }
      };
      eventEmitter.emit(EventName.STREAM_CHANGED, result);
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
    onWhiteBoardQuery: (data) => {
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
    // onNetworkSentLost: (network) => {
    // TODO: eventEmitter.emit(EventName.NETWORK, network);
    // },
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
    onStopScreenShareComplete: (result) => {
      let { reason } = result;
      if(reason == 2){
        return eventEmitter.emit(EventName.SCREEN_SHARE_FINISHED);
      }
      eventEmitter.emit(EventName.SCREEN_SHARE_STOP);
    },
    onNotifyRTCError: (result) => {
      let { code } = result;
      let errors = {
        1: Error.TOKEN_USERID_MISMATCH
      };
      let error = errors[code] || result;
      eventEmitter.emit(EventName.RTC_ERROR, error);
    }
  };
  utils.forEach(eventFactory, function (event, name) {
    eventHandler.on(name, event);
  });
};
let CacheName = {
  IS_DESTROYED: 'isDestroyed',
  IS_IN_ROOM: 'isInRoom'
};
let SessionCache = utils.Cache({
  isDestroyed: false,
  isInRoom: false
});

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
      eventEmitter.once(EventName.ROOM_SELF_JOINED, (error, user) => {
        if (error) {
          return reject(error);
        }
        SessionCache.set(CacheName.IS_IN_ROOM, true);
        resolve(user);
      });
      let { user } = room;
      let { id: userId, token } = user;
      utils.extend(option, {
        currentUser: {
          id: userId
        }
      });
      let { id } = room;
      rtc.joinChannel(id, userId, token);
    });
  }

  leaveRoom() {
    return utils.deferred((resolve, reject) => {
      eventEmitter.once(EventName.ROOM_SELF_LEFT, (error, user) => {
        if (error) {
          return reject(error);
        }
        SessionCache.set(CacheName.IS_IN_ROOM, false);
        resolve(user);
      });
      rtc.leaveChannel();
    });
  }

  setProfiles(constraints) {
    rtc.setVideoParameters(constraints);
  }

  getStream(user) {
    return utils.deferred((resolve) => {
      let method = isCrruentUser(user) ? 'getLocalStream' : 'getRemoteStream';
      let { id } = user;
      let mediaStream = rtc[method](id);
      resolve({
        user,
        stream: {
          type: StreamType.VIDEO,
          mediaStream
        }
      });
    });
  }

  mute(user) {
    return utils.deferred((resolve) => {
      //TODO: 成员静音需要区分 userId
      let method = isCrruentUser(user) ? 'muteMicrophone' : 'closeRemoteAudio';
      let isMute = true;
      rtc[method](isMute);
      resolve();
    });
  }

  unmute(user) {
    return utils.deferred((resolve) => {
      //TODO: 成员静音需要区分 userId
      let method = isCrruentUser(user) ? 'muteMicrophone' : 'closeRemoteAudio';
      let isMute = false;
      rtc[method](isMute);
      resolve();
    });
  }

  disableVideo(user) {
    return utils.deferred((resolve) => {
      //TODO: 禁用其他成员的视频流，订阅分发可视为修改订阅关系，不订阅指定用户的视频流
      if (isCrruentUser(user)) {
        var isClose = true;
        rtc.closeLocalVideo(isClose);
      }
      resolve();
    });
  }

  enableVideo(user) {
    return utils.deferred((resolve) => {
      //TODO: 禁用其他成员的视频流，订阅分发可视为修改订阅关系，订阅指定用户的视频流
      if (isCrruentUser(user)) {
        var isClose = false;
        rtc.closeLocalVideo(isClose);
      }
      resolve();
    });
  }

  createWhiteBoard() {
    return utils.deferred((resolve, reject) => {
      eventEmitter.once(EventName.WHITEBOARD_CREATED, (error, whiteboard) => {
        if (error) {
          return reject(error);
        }
        resolve(whiteboard);
      });
      rtc.requestWhiteBoardURL();
    });
  }

  getWhiteBoardList() {
    return utils.deferred((resolve, reject) => {
      eventEmitter.once(EventName.WHITEBOARD_GETLIST, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
      rtc.queryWhiteBoard();
    });
  }

  startScreenShare() {
    return utils.deferred((resolve, reject) => {
      eventEmitter.once(EventName.SCREEN_SHARE_START, (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
      rtc.startScreenShare();
    });
  }

  stopScreenShare() {
    return utils.deferred((resolve, reject) => {
      eventEmitter.once(EventName.SCREEN_SHARE_STOP, (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
      rtc.stopScreenShare();
    });
  }

  setDevice(device) {
    let { input: { video } } = device;
    return utils.deferred(resolve => {
      rtc.switchVideo(video.id);
      resolve();
    });
  }

  checkDevice() {
    return rtc.checkDeviceState().then(state => {
      return utils.rename(state, {
        audioState: 'audio',
        videoState: 'video'
      });
    });
  }

  getDeviceList() {
    return rtc.getDevicesInfos().then(devices => {
      let audioInputs = [], videoInputs = [], audioOutputs = [];
      let add = (inputs, device) => {
        let { deviceId: id, label, groupId } = device;
        inputs.push({
          id,
          label,
          groupId
        });
      };
      let deviceKinds = {
        videoinput: (device) => {
          add(videoInputs, device);
        },
        audioinput: (device) => {
          add(audioInputs, device);
        },
        audiooutput: (device) => {
          add(audioOutputs, device);
        }
      };
      devices.forEach(device => {
        let { kind } = device;
        deviceKinds[kind](device);
      });
      return {
        input: {
          audio: audioInputs,
          video: videoInputs
        },
        output: {
          audio: audioOutputs
        }
      };
    });
  }

  exec(name, ...data) {
    let isDestroyed = SessionCache.get(CacheName.IS_DESTROYED);
    if (isDestroyed) {
      return utils.Defer.reject(Error.INSTANCE_IS_DESTROYED);
    }
    let isInRoom = SessionCache.get(CacheName.IS_IN_ROOM);
    let isJoin = name === 'joinRoom';
    if (!isInRoom && !isJoin) {
      return utils.Defer.reject(Error.NOT_JOIN_ROOM);
    }
    return this[name](...data);
  }

  _on(name, event) {
    eventEmitter.on(name, event);
  }

  _off(name) {
    eventEmitter.off(name);
  }

  destroy() {
    eventEmitter.teardown();
    SessionCache.set(CacheName.IS_DESTROYED, true);
    this.leaveRoom();
  }
}