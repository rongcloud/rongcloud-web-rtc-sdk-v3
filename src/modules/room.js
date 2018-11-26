import EventEmitter from '../event-emitter';
import utils from '../utils';
import { RoomEvents } from './events';

export default function Room(rtc) {
  let eventEmitter = new EventEmitter();
  utils.forEach(RoomEvents, (event) => {
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

  let join = (room) => {
    return rtc.joinRoom(room);
  };

  let leave = (room) => {
    return rtc.leaveRoom(room);
  };

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
    join,
    leave,
    _on,
    _off
  }
}