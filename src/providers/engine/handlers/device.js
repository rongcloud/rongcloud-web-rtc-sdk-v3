import { UpEvent } from '../../../event-name';
import { LogTag } from '../../../enum';
import Logger from '../../../logger';

function DeviceHandler() {
  let get = () => {
    return navigator.mediaDevices.enumerateDevices();
  };
  let dispatch = (event, args) => {
    switch (event) {
      case UpEvent.DEVICE_GET:
        return get(...args);
      default:
        Logger.warn(LogTag.DEVICE, {
          event,
          msg: 'unkown event'
        });
    }
  };
  return {
    dispatch
  };
}

export default DeviceHandler;