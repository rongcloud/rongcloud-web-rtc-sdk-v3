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

export const PingCount = 4;

export const LogTag = {
  ICE: 'ice',
  LIFECYCLE: 'lifecycle',
  ROOM: 'room',
  STREAM: 'stream',
  STREAM_HANDLER: 'stream_handler',
  ROOM_HANDLER: 'room_handler',
  STORAGE_HANDLER: 'storage_handler',
  IM: 'im',
  MESSAGE: 'message',
  DEVICE: 'device'
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

export const REGEXP_ROOM_ID = /[A-Za-z0-9+=-_]+$/;

export const LENGTH_ROOM_ID = 64;

export const DEFAULT_MS_PROFILE = {
  height: 720,
  width: 1280,
  frameRate: 15
};
export const MIN_STREAM_SUFFIX = 'tiny';

export const AUDIO_LEVEL = [0, 1, 2, 3, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9];

export const REPORT_FREQUENCY = 1 * 1000;

export const REQUEST_TIMEOUT = 5 * 1000;

export const MEDIASERVER_SUCCESS = 10000;

export const RTC_MODE = {
  RTC: 0,
  LIVE: 1
};

export const TAG_V2 = '';

export const STAT_FREQUENCY = 2 * 1000;

export const STAT_TPL = {
  R1: 'R1\t{rtcVersion}\t{imVersion}\t{platform}\t{pcName}\t{chromeVersion}',
 
  R2: 'R2\t{type}\t{status}\r{trackIds}',
 
  R3_ITEM: '{googTrackId}\t{googCodecName}\t{audioLevel}\t{samplingRate}\t{transferRate}\t{packetsLost}\t{frameRate}\t{resolution}\t{googRenderDelayMs}\t{googJitterReceived}\t{googNacksReceived}\t{googPlisReceived}\t{googRtt}\t{googFirsReceived}\t{codecImplementationName}',
  R3: 'R3\t{totalRate}\r{tracks}',

  R4_ITEM: '{googTrackId}\t{googCodecName}\t{audioLevel}\t{samplingRate}\t{transferRate}\t{packetsLost}\t{frameRate}\t{resolution}\t{googRenderDelayMs}\t{googJitterReceived}\t{googNacksReceived}\t{googPlisReceived}\t{googRtt}\t{googFirsReceived}\t{codecImplementationName}',
  R4: 'R4\t{totalRate}\r{tracks}',

  R5: 'R5\t-1\t-1\t-1\t{networkType}\t{rtt}\t{localAddress}\t{receiveBand}\t{sendBand}\t{packetsLost}'
};

export const STAT_NONE = '-1';

export const STAT_SEPARATOR = '\n';