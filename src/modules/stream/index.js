import EventEmitter from '../../event-emitter';
import utils from '../../utils';
import { StreamEvents } from '../events';

import Video from './video';
import Audio from './audio';

export default function Stream(rtc) {
  let eventEmitter = new EventEmitter();
  utils.forEach(StreamEvents, (event) => {
    let { name, type } = event;
    rtc._on(name, (error, result) => {
      if(error){
        throw new Error(error);
      }
      utils.extend(result, {
        type
      });
      eventEmitter.emit(type, result);
    });
  });

  let $video = Video(rtc);
  let $audio = Audio(rtc);
  let get = (user) => { 
    return rtc.getStream(user);
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
    $video,
    $audio,
    get,
    _on,
    _off
  };
}