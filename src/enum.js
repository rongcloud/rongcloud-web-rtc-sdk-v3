export const EventName = {
  ROOM_SELF_JOINED: 'room_self_joined',
  ROOM_SELF_LEFT: 'room_self_left',

  ROOM_USER_JOINED: 'room_user_joined',
  ROOM_USER_LEFT: 'room_user_left',
  
  ROOM_CHANGED: 'room_changed',
  
  STREAM_ADDED: 'stream_added',
  
  NETWORK: 'network',
  WHITEBOARD_CREATED: 'whiteboard_created',
  WHITEBOARD_GETLIST: 'whiteboard_getlist',
  SCREEN_SHARE_START: 'screen_share_start',
  SCREEN_SHARE_STOP: 'screen_share_stop'
};

export const Error = {
  JOIN_ERROR: {
    code: 20000,
    msg: '加入房间失败，请检查网络是否正常'
  },
  LEAVE_ERROR: {
    code: 20001,
    msg: '离开房间失败，请检查网络是否正常'
  },
  CREATE_WB_ERROR: {
    code: 21000,
    msg: '获取白板失败'
  },
  GET_WB_ERROR: {
    code: 21001,
    msg: '获取白板列表失败'
  },
  SCREEN_SHARE_PLUGIN_SUPPORT_ERROR: {
    code: 22001,
    msg: '屏幕共享失败, 当前浏览器不支持屏幕共享'
  },
  SCREEN_SHARE_NOT_INSTALL_ERROR: {
    code: 22002,
    msg: '屏幕共享失败, 未安装浏览器屏幕共享插件, 下载地址: http://fsprodrcx.cn.ronghub.com/zaoh1s2oIOU9siHWzaoh1sSRr-3NqK1xoM9SpazNRA/rong-rtc-plugin.zip'
  }
};

export const UserType = {
  /** 普通模式 */
  NORMAL: 1,
  /** 观察者模式 */
  OBSERVER: 2
};