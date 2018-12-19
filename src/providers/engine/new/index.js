/* 
  Engine 实现思路：

  1、梳理定义信令

  2、index.js 暴露 API

  3、定义 PeerConnection 工具类

  4、考虑到有 IE 插件版、Electron 中使用自定义 Web RTC 此处 API 不会按模块划分
*/
import Client from './client';
import EventEmitter from '../../../event-emitter';
import { SignalEvent, DownEventFlag } from './events';
import utils from '../../../utils';
import { EventName } from '../../../enum';
let FuncFactory = {
  joinRoom(context, room) {
    return utils.deferred((resolve, reject) => {
      context.once(SignalEvent.ConnectAck, (error) => {
        if(error){
          return context.emit(EventName.RTC_ERROR, error);
        }
        context.once(SignalEvent.JoinAck, (error, user) => {
          if (error) {
            return reject(error);
          }
          resolve(user);
        });
        context.emit(SignalEvent.Join, room);
      });
      context.emit(SignalEvent.Connect);
    });
  },
  leaveRoom(context) {
    return utils.deferred((resolve, reject) => {
      context.once(SignalEvent.LeaveAck, (error, user) => {
        if (error) {
          return reject(error);
        }
        resolve(user);
      });
      context.emit(SignalEvent.Leave);
    });
  },
  setProfiles(context, constraints) {
    return utils.deferred((resolve, reject) => {
      context.once(SignalEvent.SetProfileAck, (error, user) => {
        if (error) {
          return reject(error);
        }
        resolve(user);
      });
      context.emit(SignalEvent.SetProfile, constraints);
    });
  },
  getStream(context, user) {
    return utils.deferred((resolve, reject) => {
      context.once(SignalEvent.GetStreamAck, (error, stream) => {
        if (error) {
          return reject(error);
        }
        resolve(stream);
      });
      context.emit(SignalEvent.GetStream, user);
    });
  },
  mute(context, user) {
    return utils.deferred((resolve, reject) => {
      context.once(SignalEvent.MuteAck, (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
      context.emit(SignalEvent.Mute, user);
    });
  },
  unmute(context, user) {
    return utils.deferred((resolve, reject) => {
      context.once(SignalEvent.UnMuteAck, (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
      context.emit(SignalEvent.UnMute, user);
    });
  },
  disableVideo(context, user) {
    return utils.deferred((resolve, reject) => {
      context.once(SignalEvent.DisableVideoAck, (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
      context.emit(SignalEvent.DisableVideo, user);
    });
  },
  enableVideo(context, user) {
    return utils.deferred((resolve, reject) => {
      context.once(SignalEvent.EnableVideoAck, (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
      context.emit(SignalEvent.EnableVideo, user);
    });
  },
  createWhiteBoard(context) {
    return utils.deferred((resolve, reject) => {
      context.once(SignalEvent.CreateWhiteBoardAck, (error, whiteboard) => {
        if (error) {
          return reject(error);
        }
        resolve(whiteboard);
      });
      context.emit(SignalEvent.CreateWhiteBoard);
    });
  },
  getWhiteBoardList(context) {
    return utils.deferred((resolve, reject) => {
      context.once(SignalEvent.GetWhiteBoardListAck, (error, whiteboard) => {
        if (error) {
          return reject(error);
        }
        resolve(whiteboard);
      });
      context.emit(SignalEvent.GetWhiteBoardList);
    });
  },
  startScreenShare(context) {
    return utils.deferred((resolve, reject) => {
      context.once(SignalEvent.GetWhiteBoardListAck, (error, whiteboard) => {
        if (error) {
          return reject(error);
        }
        resolve(whiteboard);
      });
      context.emit(SignalEvent.GetWhiteBoardList);
    });
  },
  stopScreenShare(context) {
    return utils.deferred((resolve, reject) => {
      context.once(SignalEvent.StartScreenShareAck, (error, whiteboard) => {
        if (error) {
          return reject(error);
        }
        resolve(whiteboard);
      });
      context.emit(SignalEvent.StartScreenShare);
    });
  },
  setDevice(context) {
    return utils.deferred((resolve, reject) => {
      context.once(SignalEvent.SetDeviceAck, (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
      context.emit(SignalEvent.SetDevice);
    });
  },
  checkDevice(context) {
    return utils.deferred((resolve, reject) => {
      context.once(SignalEvent.CheckDeviceAck, (error, devices) => {
        if (error) {
          return reject(error);
        }
        resolve(devices);
      });
      context.emit(SignalEvent.CheckDevice);
    });
  },
  getDeviceList(context) {
    return utils.deferred((resolve, reject) => {
      context.once(SignalEvent.GetDeviceListAck, (error, devices) => {
        if (error) {
          return reject(error);
        }
        resolve(devices);
      });
      context.emit(SignalEvent.GetDeviceList);
    });
  }
};
export default class RTCEngine extends EventEmitter {
  constructor(option) {
    super();
    let context = this;
    let client = new Client(option);
    utils.forEach(SignalEvent, (name, key) => {
      let isDownEvent = utils.isContain(key, DownEventFlag);
      // 绑定下行、Ack 事件，并进行分发
      if (isDownEvent) {
        client.on(name, (data) => {
          context.emit(name, data);
        });
      }
      // RTCEngine 绑定上行事件，并传递至 Client
      let isUpEvent = !isDownEvent;
      if (isUpEvent) {
        context.on(name, (data) => {
          client.emit(name, data)
        });
      }
    });
  }
  exec(name, ...data) {
    let func = FuncFactory[name] || utils.noop;
    return func(this, ...data);
  }
}