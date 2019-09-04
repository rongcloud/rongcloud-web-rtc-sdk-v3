import utils from './utils';
let getErrors = () => {
  let errors = [{
    code: 10000,
    name: 'INSTANCE_IS_DESTROYED',
    msg: 'RongRTC instance has been destroyed'
  },
  {
    code: 50000,
    name: 'IM_NOT_CONNECTED',
    msg: 'IM not connected'
  },
  {
    code: 50001,
    name: 'ROOM_ID_IS_ILLEGAL',
    msg: 'The roomId is illegal and can contain only upper and lower case letters, Arabic numerals, +, =, -, _ and cannot exceed 64 characters in length'
  },
  {
    code: 50002,
    name: 'ROOM_REPEAT_JOIN',
    msg: 'Not rejoin the room'
  },
  {
    code: 50010,
    name: '',
    msg: 'Http request timeout'
  },
  {
    code: 50011,
    name: '',
    msg: 'http response error'
  },
  {
    code: 50012,
    name: '',
    msg: 'Network unavailable'
  },
  {
    code: 50020,
    name: '',
    msg: 'Resources has been published'
  },
  {
    code: 50021,
    name: 'SET_OFFER_ERROR',
    msg: 'Set offer error'
  },
  {
    code: 50021,
    name: 'SET_ANSWER_ERROR',
    msg: 'Set answer error'
  },
  {
    code: 50023,
    name: 'PUBLISH_STREAM_EXCEED_LIMIT',
    msg: 'The maximum number of published resources has been reached'
  },
  {
    code: 50024,
    name: 'STREAM_NOT_EXIST',
    msg: 'Stream not exist. Please check user.id、stream.type or stream.tag'
  },
  {
    code: 50030,
    name: 'SUBSCRIBE_STREAM_NOT_EXIST',
    msg: 'Subscribe to non-existent resource'
  },
  {
    code: 50030,
    name: 'STREAM_TRACK_NOT_EXIST',
    msg: 'Track not exist. Please check user.id、stream.type or stream.tag'
  },
  {
    code: 50031,
    name: 'STREAM_SUBSCRIBED',
    msg: 'Resources has been subscribed'
  },
  {
    code: 50032,
    name: 'UNSUBSCRIBE_STREAM_NOT_EXIST',
    msg: 'Unsubscribe to non-existent resource'
  },
  {
    code: 50050,
    name: 'RTC_NOT_JOIN_ROOM',
    msg: 'Please join the room first'
  },
  {
    code: 50051,
    name: 'SOCKET_UNAVAILABLE',
    msg: 'IM socket unavailable'
  },
  {
    code: 50052,
    name: 'NETWORK_UNAVAILABLE',
    msg: 'Network unavailable'
  },
  {
    code: 50053,
    name: 'IM_SDK_VER_NOT_MATCH',
    msg: 'IM SDK version is too low, minimum version 2.4.0, please check: https://www.rongcloud.cn/docs/web_rtclib.html'
  },
  {
    code: 50054,
    name: 'STREAM_DESKTOPID_ILLEGAL',
    msg: 'Failed to get screen shared stream, illegal desktopStreamId'
  },
  {
    code: 50055,
    name: 'PARAMTER_ILLEGAL',
    msg: 'Please check the parameters, the {name} parameter is mandatory'
  },
  {
    code: 50056,
    name: 'ENGINE_ERROR',
    msg: 'RTC engine error'
  },
  {
    code: 50057,
    name: 'MEDIA_SERVER_ERROR',
    msg: 'Network is abnormal or Media Server is unavailable'
  },
  {
    code: 50058,
    name: 'MEDIA_SERVER_RESPONSE_EMPTY',
    msg: 'Media Server response body is empty'
  },
  {
    code: 50059,
    name: 'NO_AUDIO_AND_VIDEO_SERVICE',
    msg: 'No audio and video services have been activated'
  }, {
    code: 40001,
    name: 'NOT_IN_ROOM',
    msg: 'Not in the room'
  }, {
    code: 40002,
    name: 'INTERNAL_ERROR',
    msg: 'IM Server internal error'
  }, {
    code: 40003,
    name: 'HAS_NO_ROOM',
    msg: 'IM Server room info not exist'
  }, {
    code: 40004,
    name: 'INVALID_USERID',
    msg: 'UserId illegal'
  }, {
    code: 40005,
    name: 'REPEAT_JOIN_ROOM',
    msg: 'Not rejoin the room'
  }];

  let errorMap = {
    Inner: {},
    Outer: {}
  };
  utils.forEach(errors, (error) => {
    let { name, code, msg } = error;
    let info = {
      code,
      msg
    };
    errorMap.Inner[name] = info;
    errorMap[code] = info;
    errorMap.Outer[name] = code;
  });
  return errorMap;
};
export const ErrorType = getErrors();