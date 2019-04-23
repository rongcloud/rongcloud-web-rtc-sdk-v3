export const DownEvent = {
  ROOM_USER_JOINED: 'room_user_joined',
  ROOM_USER_LEFT: 'room_user_left',

  STREAM_PUBLISHED: 'stream_published',
  STREAM_UNPUBLISHED: 'stream_unpublished',
  STREAM_DISABLED: 'stream_disabled',
  STREAM_ENABLED: 'stream_enabled',
  STREAM_MUTED: 'stream_muted',
  STREAM_UNMUTED: 'stream_unmuted',

  RTC_ERROR: 'rtc_error',
  RTC_MOUNTED: 'rtc_mounted',
  RTC_UNMOUNTED: 'rtc_unmounted',

  MESSAGE_RECEIVED: 'message_received',

  REPORT_SPOKE: 'report_spoke'
};

export const UpEvent = {
  ROOM_JOIN: 'room_join',
  ROOM_LEAVE: 'room_leave',
  ROOM_GET: 'room_get',

  STREAM_PUBLISH: 'stream_publish',
  STREAM_UNPUBLISH: 'stream_UNPUBLISH',
  STREAM_SUBSCRIBE: 'stream_subscribe',
  STREAM_UNSUBSCRIBE: 'stream_unsubscribe',
  STREAM_RESIZE: 'stream_resize',
  STREAM_GET: 'stream_get',

  AUDIO_MUTE: 'audio_mute',
  AUDIO_UNMUTE: 'audio_unmute',

  VIDEO_DISABLE: 'video_disable',
  VIDEO_ENABLE: 'video_enable',

  STORAGE_SET: 'strorage_set',
  STORAGE_GET: 'strorage_get',
  STORAGE_REMOVE: 'strorage_remove',

  MESSAGE_SEND: 'message_send',

  DEVICE_GET: 'device_get',

  REPORT_START: 'report_start',
  REPORT_STOP: 'report_stop'
};

export const NetworkEvent = {
  ONLINE: 'online',
  OFFLINE: 'offline'
};