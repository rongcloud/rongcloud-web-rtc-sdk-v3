import utils from './utils';
let getErrors = () => {
  let errors = [{
    code: 10000,
    name: 'INSTANCE_IS_DESTROYED',
    msg: 'RongRTC 实例已销毁，请创建实例并绑定事件后再调用实例方法'
  },
  {
    code: 10001,
    name: 'NOT_JOIN_ROOM',
    msg: '不在房间内，请先加入房间再调用业务接口'
  },
  {
    code: 20000,
    name: 'JOIN_ERROR',
    msg: '加入房间失败，请检查网络是否正常'
  },
  {
    code: 20001,
    name: 'LEAVE_ERROR',
    msg: '离开房间失败，请检查网络是否正常'
  },
  {
    code: 21000,
    name: 'CREATE_WB_ERROR',
    msg: '获取白板失败'
  },
  {
    code: 21001,
    name: 'GET_WB_ERROR',
    msg: '获取白板列表失败'
  },
  {
    code: 22001,
    name: 'SCREEN_SHARE_PLUGIN_SUPPORT_ERROR',
    msg: '屏幕共享失败, 当前浏览器不支持屏幕共享'
  },
  {
    code: 22002,
    name: 'SCREEN_SHARE_NOT_INSTALL_ERROR',
    msg: '屏幕共享失败, 未安装浏览器屏幕共享插件, 下载地址: http://fsprodrcx.cn.ronghub.com/zaoh1s2oIOU9siHWzaoh1sSRr-3NqK1xoM9SpazNRA/rong-rtc-plugin.zip'
  },
  {
    code: 30001,
    name: 'TOKEN_USERID_MISMATCH',
    msg: 'Token 与 UserId 不匹配'
  }];

  let Inner = {}, Outer = {};
  utils.forEach(errors, (error) => {
    let { name, code, msg } = error;
    Inner[name] = {
      code,
      msg
    };
    Outer[name] = code;
  });
  return {
    Inner,
    Outer
  };
};
export const ErrorType = getErrors();