import EventEmitter from '../event-emitter';
import utils from '../utils';
import { NetworkEvents } from './events';

export default function Network(rtc) {
  var eventEmitter = new EventEmitter();

  utils.forEach(NetworkEvents, (event) => {
    let { name, type } = event;
    rtc._on(name, (error, user) => {
      if(error){
        throw new Error(error);
      }
      let result = {
        type,
        user
      };
      eventEmitter.emit(type, result);
    });
  });

  let _on = (name, event) => {
    return eventEmitter.on(name, (error, result) => {
      if(error){
        throw new Error(error);
      }
      event(result)
    });
  };

  let _off = (name) => {
    return eventEmitter.off(name);
  }

  return {
    _on,
    _off
  }
}