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
  }
};