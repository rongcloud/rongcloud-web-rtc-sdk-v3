import utils from './utils';
let getErrors = () => {
  let errors = [{
    code: 10000,
    name: 'INSTANCE_IS_DESTROYED',
    msg: 'RongRTC 实例已销毁，请重新创建实例'
  },
  {
    code: 50000,
    name: 'IM_NOT_CONNECTED',
    msg: '请在 IM 连接成功后开始音频业务'
  },
  {
    code: 50001,
    name: 'ROOM_ID_IS_ILLEGAL',
    msg: '房间号不合法，只能包含大小写字母、阿拉伯数字、+、=、-、_ 且长度不能超过 64 个字符'
  },
  {
    code: 50002,
    name: 'ROOM_REPEAT_JOIN',
    msg: '重复加入房间'
  },
  {
    code: 50010,
    name: '',
    msg: 'http 请求超时'
  },
  {
    code: 50011,
    name: '',
    msg: 'http response 异常（404、500）'
  },
  {
    code: 50012,
    name: '',
    msg: '请求未发出去、断网'
  },
  {
    code: 50020,
    name: '',
    msg: '资源已发布'
  },
  {
    code: 50021,
    name: 'SET_OFFER_ERROR',
    msg: '设置 Offer 错误'
  },
  {
    code: 50021,
    name: 'SET_ANSWER_ERROR',
    msg: '设置 Answer 错误'
  },
  {
    code: 50023,
    name: 'PUBLISH_STREAM_EXCEED_LIMIT',
    msg: '发布资源个数已经到达上限'
  },
  {
    code: 50030,
    name: 'SUBSCRIBE_STREAM_NOT_EXIST',
    msg: '订阅不存在的资源'
  },
  {
    code: 50030,
    name: 'STREAM_NOT_EXIST',
    msg: 'stream 不存在，请检查传入参数, id、stream.type、stream.tag 是否正确'
  },
  {
    code: 50030,
    name: 'STREAM_TRACK_NOT_EXIST',
    msg: 'Track 不存在，请检查传入参数 stream.type 是否正确'
  },
  {
    code: 50031,
    name: 'STREAM_SUBSCRIBED',
    msg: '资源已订阅'
  },
  {
    code: 50032,
    name: 'UNSUBSCRIBE_STREAM_NOT_EXIST',
    msg: '取消订阅不存在资源'
  },
  {
    code: 50050,
    name: 'RTC_NOT_JOIN_ROOM',
    msg: '未加入房间，加入成功后方可调用业务方法'
  },
  {
    code: 50051,
    name: 'SOCKET_UNAVAILABLE',
    msg: 'IM Socket 连接不可用'
  },
  {
    code: 50052,
    name: 'NETWORK_UNAVAILABLE',
    msg: '网络不可用'
  },
  {
    code: 50053,
    name: 'IM_SDK_VER_NOT_MATCH',
    msg: 'IM SDK 版本过低，最低版本 2.4.0，详细请参考: https://www.rongcloud.cn/docs/web_rtclib.html'
  },
  {
    code: 50054,
    name: 'STREAM_DESKTOPID_ILLEGAL',
    msg: '获取屏幕共享流失败，desktopStreamId 非法'
  },
  {
    code: 50055,
    name: 'PARAMTER_ILLEGAL',
    msg: '请检查参数，{name} 参数为必传入项'
  }, {
    code: 40001,
    name: 'NOT_IN_ROOM',
    msg: '当前用户不在房间内'
  }, {
    code: 40002,
    name: 'INTERNAL_ERROR',
    msg: 'IM Server 内部错误'
  }, {
    code: 40003,
    name: 'HAS_NO_ROOM',
    msg: 'IM Server 房间信息不存在'
  }, {
    code: 40004,
    name: 'INVALID_USERID',
    msg: 'userId 不合法'
  }, {
    code: 40005,
    name: 'REPEAT_JOIN_ROOM',
    msg: '重复加入房间'
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