import Room from './modules/room';
import Stream from './modules/stream/index';
import WhiteBoard from './modules/whiteboard';
import ScreenShare from './modules/screenshare';
import Device from './modules/device';
import Observer from './observer';

import EventEmitter from './event-emitter';
import { ErrorEvents } from './modules/events';

import utils from './utils';
import RTCEngine from './providers/engine/index';

export default class RongRTC{
  constructor(option){
    let that = this;
    let rtc = new RTCEngine(option);
    let eventEmitter = new EventEmitter();
    utils.forEach(ErrorEvents, (event) => {
      let { name, type } = event;
      rtc._on(name, (error, info) => {
        if(error){
          throw new Error(error);
        }
        let result = {
          type,
          info
        };
        eventEmitter.emit(type, result);
      });
    });

    let destroy = () => {
      if(that._isDestroyed){
        return utils.Defer.resolve();
      }
      utils.extend(that, {
        _isDestroyed: true
      });
      utils.forEach(that, (module) => {
        module._teardown && module._teardown();
      });
      rtc.destroy();
      return utils.Defer.resolve();
    };

    let _on = (name, event) => {
      return eventEmitter.on(name, (error, result) => {
        if(error){
          throw new Error(error);
        }
        event(result);
      });
    };
  
    let _off = (name) => {
      return eventEmitter.off(name);
    };

    utils.extend(that, {
      Observer,
      Room: Room(rtc),
      Stream: Stream(rtc),
      WhiteBoard: WhiteBoard(rtc),
      ScreenShare: ScreenShare(rtc),
      Device: Device(rtc),
      destroy,
      _isDestroyed: false,
      _on,
      _off
    });
  }
}