import Room from './modules/room';
import Stream from './modules/stream/index';
import WhiteBoard from './modules/whiteboard';
import ScreenShare from './modules/screenshare';
import Network from './modules/network';
import Observer from './observer';

import EventEmitter from './event-emitter';
import { ErrorEvents } from './modules/events';

import utils from './utils';
import RTCEngine from './providers/engine/index';

export default class RongRTC{
  constructor(option){
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

    utils.extend(this, {
      Observer,
      $room: Room(rtc),
      $stream: Stream(rtc),
      $whiteBoard: WhiteBoard(rtc),
      $screenShare: ScreenShare(rtc),
      $network: Network(rtc),
      _on,
      _off
    });
  }
}