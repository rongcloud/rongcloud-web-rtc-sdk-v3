export const DownEvent = {
  ROOM_SELF_JOINED: 'room_self_joined',
  ROOM_SELF_LEFT: 'room_self_left',
  ROOM_USER_JOINED: 'room_user_joined',
  ROOM_USER_LEFT: 'room_user_left',

  STREAM_ADDED: 'stream_added',
  STREAM_REMOVED: 'stream_removed',
  STREAM_CHANGED: 'stream_changed',
  
  RTC_ERROR: 'rtc_error'
};

export const UpEvent = {
  ROOM_JOIN: 'room_join',
  ROOM_LEAVE: 'room_leave',
  ROOM_GET: 'room_get',

  STREAM_PUBLISH: 'stream_publish',
  STREAM_UNPUBLISH: 'stream_UNPUBLISH',
  STREAM_OPEN: 'stream_open',
  STREAM_CLOSE: 'stream_close',
  STREAM_RESIZE: 'stream_resize',
  STREAM_GEt: 'stream_get',

  DEVICE_CHECK: 'device_check',
  DEVICE_GET_LIST: 'device_get_list'
};