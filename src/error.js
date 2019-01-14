import utils from './utils';
let getErrors = () => {
  let errors = [{
    code: 10000,
    name: 'INSTANCE_IS_DESTROYED',
    msg: 'RongRTC 实例已销毁，请创建实例并绑定事件后再调用实例方法'
  },
  {
    code: 10001,
    name: 'IM_NOT_CONNECTED',
    msg: '请在 IM 连接成功后开始音频业务'
  },
  {
    code: 20001,
    name: 'STREAM_NOT_EXIST',
    msg: 'stream 不存在，请检查传入参数, id、stream.type、stream.tag 是否正确'
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