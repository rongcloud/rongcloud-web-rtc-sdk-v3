import utils from './utils';
let getErrors = () => {
  let errors = [{
    code: 10000,
    name: 'INSTANCE_IS_DESTROYED',
    msg: 'RongRTC 实例已销毁，请重新创建实例'
  },
  {
    code: 10001,
    name: 'IM_NOT_CONNECTED',
    msg: '请在 IM 连接成功后开始音频业务'
  },
  {
    code: 10002,
    name: 'RTC_NOT_JOIN_ROOM',
    msg: '未加入房间，加入成功后方可调用业务方法'
  },
  {
    code: 10003,
    name: 'SOCKET_UNAVAILABLE',
    msg: 'IM Socket 连接不可用'
  },
  {
    code: 10004,
    name: 'NETWORK_UNAVAILABLE',
    msg: '网络不可用'
  },
  {
    code: 10005,
    name: 'APPKEY_ILLEGAL',
    msg: 'AppKey 不可为空'
  },
  {
    code: 20001,
    name: 'STREAM_NOT_EXIST',
    msg: 'stream 不存在，请检查传入参数, id、stream.type、stream.tag 是否正确'
  },
  {
    code: 30001,
    name: 'PARAMTER_ILLEGAL',
    msg: '请检查参数，{name} 参数为必传入项'
  },{
    code: 40001,
    name: 'NOT_IN_ROOM',
    msg: '当前用户不在房间内'
  },{
    code: 40002,
    name: 'INTERNAL_ERROR',
    msg: 'IM Server 内部错误'
  },{
    code: 40003,
    name: 'HAS_NO_ROOM',
    msg: 'IM Server 房间信息不存在'
  },{
    code: 40004,
    name: 'INVALID_USERID',
    msg: 'userId 不合法'
  },{
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