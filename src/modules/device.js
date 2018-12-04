import utils from '../utils';
export default function Device(rtc) {
  let isInvalid = (device) => {
    let error = false;
    device = device || {};
    if(!utils.isObject(device.input)){
      error = true;
    }
    return error;
  };
  let set = (device) => {
    if(isInvalid(device)){
      return utils.Defer.reject(device);
    }
    return rtc.exec('setDevice', device);
  };
  let check = () => {
    return rtc.exec('checkDevice');
  };
  let getList = () => {
    return rtc.exec('getDeviceList');
  };
  return {
    set,
    check,
    getList
  }
}