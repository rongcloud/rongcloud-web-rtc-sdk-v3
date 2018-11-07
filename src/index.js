import Room from './modules/room';
import Stream from './modules/stream/index';
import WhiteBoard from './modules/whiteboard';
import ScreenShare from './modules/screenshare';
import utils from './utils';

export default class RongRTC {
  constructor(option){
    utils.extend(this, {
      Room,
      Stream,
      WhiteBoard,
      ScreenShare
    });
  }
}