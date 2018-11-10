/* 
  1、对上层（RongRTC）暴露 API
  2、如果后期 rtc.js 重构或 API 有重大调整，可重写此文件，保证对上层 API 不变
*/
import { RTC, EventHandler } from './rtc';
import utils from '../../utils';
import EventEmitter from '../../event-emitter';
import { EventName } from '../../enum';

let option = {
  url: 'https://rtcapi.ronghub.com/nav/websocketlist'
};
let rtc = null;
let eventHandler = null;
let eventEmitter = null;

export default class RTCEngine {
  constructor(_option) {
    utils.extend(option, _option);
    rtc = new RTC(option.url);
    eventHandler = new EventHandler();
    rtc.setRongRTCEngineEventHandle(eventHandler);
    eventEmitter = new EventEmitter();
  }

  joinRoom(room) {
    return utils.deferred((resolve, reject) => {
      console.log(room);
    });
  }

  leaveRoom(room) {
    console.log(room);
  }

  getStream(user) {
    console.log(user);
  }

  mute(user) {
    console.log(user);
  }

  unmute(user) {
    console.log(user);
  }

  disableVideo(user) {
    console.log(user);
  }

  enableVideo(user) {
    console.log(user);
  }

  createWhiteBoard() {
    console.log(user);
  }

  getWhiteBoardList() {
    console.log(user);
  }

  startScreenShare() {

  }

  stopScreenShare() {

  }

  _on(name, event) {
    eventEmitter.on(name, event);
  }
}