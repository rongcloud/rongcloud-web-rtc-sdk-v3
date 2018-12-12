import EventEmitter from '../event-emitter';
import utils from '../utils';
import { ScreenShareEvents } from './events';

export default function ScreenShare(rtc) {
  let eventEmitter = new EventEmitter();
  utils.forEach(ScreenShareEvents, (event) => {
    let { name, type } = event;
    rtc._on(name, (error, result) => {
      if (error) {
        throw new Error(error);
      }
      utils.extend(result, {
        type
      });
      eventEmitter.emit(type, result);
    });
  });
  let start = () => {
    return rtc.exec('startScreenShare')
  };
  let stop = () => {
    return rtc.exec('stopScreenShare');
  };
  let _on = (name, event) => {
    return eventEmitter.on(name, (error, result) => {
      if (error) {
        throw new Error(error);
      }
      event(result)
    });
  };
  let _off = (name) => {
    return eventEmitter.off(name);
  };
  let _teardown = () => {
    return eventEmitter.teardown();
  };
  return {
    start,
    stop,
    _on,
    _off,
    _teardown
  }
}