import utils from './utils';

let getErrors = () => {
  let errors = [{
    code: 10000,
    name: 'INSTANCE_IS_DESTROYED',
    msg: 'RongRTC 实例已销毁，请创建实例并绑定事件后再调用实例方法'
  },
  {
    code: 10001,
    name: 'NOT_JOIN_ROOM',
    msg: '不在房间内，请先加入房间再调用业务接口'
  },
  {
    code: 20000,
    name: 'JOIN_ERROR',
    msg: '加入房间失败，请检查网络是否正常'
  },
  {
    code: 20001,
    name: 'LEAVE_ERROR',
    msg: '离开房间失败，请检查网络是否正常'
  },
  {
    code: 21000,
    name: 'CREATE_WB_ERROR',
    msg: '获取白板失败'
  },
  {
    code: 21001,
    name: 'GET_WB_ERROR',
    msg: '获取白板列表失败'
  },
  {
    code: 22001,
    name: 'SCREEN_SHARE_PLUGIN_SUPPORT_ERROR',
    msg: '屏幕共享失败, 当前浏览器不支持屏幕共享'
  },
  {
    code: 22002,
    name: 'SCREEN_SHARE_NOT_INSTALL_ERROR',
    msg: '屏幕共享失败, 未安装浏览器屏幕共享插件, 下载地址: http://fsprodrcx.cn.ronghub.com/zaoh1s2oIOU9siHWzaoh1sSRr-3NqK1xoM9SpazNRA/rong-rtc-plugin.zip'
  },
  {
    code: 30001,
    name: 'TOKEN_USERID_MISMATCH',
    msg: 'Token 与 UserId 不匹配'
  }];

  let Inner = {}, Outer = {};
  utils.forEach(errors, (error) => {
    let { name, code, msg } = error;
    Inner[name] = {
      code,
      msg
    };
    Outer[name] = code;
  });
  return {
    Inner,
    Outer
  };
};
export const ErrorType = getErrors();

export const UserType = {
  /** 普通模式 */
  NORMAL: 1,
  /** 观察者模式 */
  OBSERVER: 2
};

export const EventName = {
  ROOM_SELF_JOINED: 'room_self_joined',
  ROOM_SELF_LEFT: 'room_self_left',
  ROOM_USER_JOINED: 'room_user_joined',
  ROOM_USER_LEFT: 'room_user_left',
  STREAM_ADDED: 'stream_added',
  STREAM_REMOVED: 'stream_removed',
  STREAM_CHANGED: 'stream_changed',
  RTC_SERVER: 'rtc_server',
  RTC_SERVER_READY: 'rtc_server_ready',
  RTC_SERVER_COLSE: 'rtc_server_ready',
  RTC_ERROR: 'rtc_error',
  WHITEBOARD_CREATED: 'whiteboard_created',
  WHITEBOARD_GETLIST: 'whiteboard_getlist',
  SCREEN_SHARE_START: 'screen_share_start',
  SCREEN_SHARE_STOP: 'screen_share_stop',
  SCREEN_SHARE_FINISHED: 'screen_share_finished'
};

export const StreamType = {
  NONE: 0,
  AUDIO: 1,
  VIDEO: 2,
  AUDIO_AND_VIDEO: 3,
  SCREEN_SHARE: 4
};

export const StreamSize = {
  MAX: 1,
  MIN: 2
};