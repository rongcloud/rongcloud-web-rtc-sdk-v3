export const StreamType = {
  NODE: -1,
  AUDIO: 0,
  VIDEO: 1,
  AUDIO_AND_VIDEO: 2
};

export const StreamSize = {
  MAX: 1,
  MIN: 2
};

export const StreamState = {
  ENABLE: 1,
  DISBALE: 0
};

export const UserState = {
  JOINED: 0,
  LEFT: 1,
  OFFLINE: 2
};

export const PingCount = 3;

export const LogTag = {
  ICE: 'ice',
  LIFECYCLE: 'lifecycle',
  ROOM: 'room',
  STREAM: 'stream',
  STREAM_HANDLER: 'stream_handler',
  ROOM_HANDLER: 'room_handler',
  STORAGE_HANDLER: 'storage_handler',
  IM: 'im',
  MESSAGE: 'message'
};

export const LogLevel = {
  INFO: 'I',
  DEBUG: 'D',
  VERBOSE: 'V',
  WARN: 'W',
  ERROR: 'E'
};

export const EventType = {
  REQUEST: 1,
  RESPONSE: 2
}

export const StorageType = {
  ROOM: 1,
  USER: 2
};