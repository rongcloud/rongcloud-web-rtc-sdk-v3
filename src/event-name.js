export const DownEvent = {
  ROOM_USER_JOINED: 'room_user_joined',
  ROOM_USER_LEFT: 'room_user_left',

  STREAM_READY: 'stream_ready',
  STREAM_PUBLISH: 'stream_publish',
  STREAM_UNPUBLISH: 'stream_unpublish',
  STREAM_CHANGED: 'stream_changed',
  
  RTC_ERROR: 'rtc_error',
  RTC_MOUNTED: 'rtc_mounted',
  RTC_UNMOUNTED: 'rtc_unmounted'
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
  STREAM_GET: 'stream_get',

  AUDIO_MUTE: 'audio_mute',
  AUDIO_UNMUTE: 'audio_unmute',

  VIDEO_DISABLE: 'video_disable',
  VIDEO_ENABLE: 'video_enable',

  DEVICE_CHECK: 'device_check',
  DEVICE_GET_LIST: 'device_get_list'
};