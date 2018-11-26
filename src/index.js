import Room from './modules/room';
import Stream from './modules/stream/index';
import WhiteBoard from './modules/whiteboard';
import ScreenShare from './modules/screenshare';
import Observer from './observer';

import utils from './utils';
import RTCEngine from './providers/engine/index';

export default class RongRTC{
  constructor(option){
    let rtc = new RTCEngine(option);
    utils.extend(this, {
      Observer,
      $room: Room(rtc),
      $stream: Stream(rtc),
      $whiteBoard: WhiteBoard(rtc),
      $screenShare: ScreenShare(rtc)
    });
  }
}