import Room from './modules/room';
import Stream from './modules/stream/index';
import WhiteBoard from './modules/whiteboard';
import Device from './modules/device';
import Observer from './observer';

import EventEmitter from './event-emitter';
import { ErrorEvents } from './modules/events';
import { StreamType, StreamSize } from './enum';

import utils from './utils';
import RTCEngine from './providers/engine/index';

export default class RongRTC {
  constructor(option) {
    let context = this;
    let rtc = new RTCEngine(option);
    let eventEmitter = new EventEmitter();
    utils.forEach(ErrorEvents, (event) => {
      let { name, type } = event;
      rtc._on(name, (error, info) => {
        if (error) {
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
      if (context._isDestroyed) {
        return utils.Defer.resolve();
      }
      utils.extend(context, {
        _isDestroyed: true
      });
      utils.forEach(context, (module) => {
        module._teardown && module._teardown();
      });
      rtc.destroy();
      return utils.Defer.resolve();
    };

    let _on = (name, event) => {
      return eventEmitter.on(name, (error, result) => {
        if (error) {
          throw new Error(error);
        }
        event(result);
      });
    };

    let _off = (name) => {
      return eventEmitter.off(name);
    };

    utils.extend(context, {
      StreamType,
      StreamSize,
      Observer,
      Room: Room(rtc),
      Stream: Stream(rtc),
      WhiteBoard: WhiteBoard(rtc),
      Device: Device(rtc),
      destroy,
      _isDestroyed: false,
      _on,
      _off
    });
  }
}