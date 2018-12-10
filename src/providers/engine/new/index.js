import Room from './modules/room';
import Stream from './modules/stream';
import Device from './modules/device';
import ScreenShare from './modules/screenshare';
import WhiteBoard from './modules/whiteboard';

import Client from './client';
import EventEmitter from '../../../event-emitter';
import { SignalEvent, DownEventFlag } from './events';
import utils from '../../../utils';

export default class RTCEngine extends EventEmitter{
  constructor(option){
    super();
    let context = this;
    let client = new Client(option);

    utils.forEach(SignalEvent, (name, key) => {
      let isDownEvent = utils.isContain(key, DownEventFlag);
      // 绑定下行、Ack 事件，并进行分发
      if(isDownEvent){
        client.on(name, (data) => {
          context.emit(name, data);
        });
      }
      // RTCEngine 绑定上行事件，并传递至 Client
      let isUpEvent = !isDownEvent;
      if(isUpEvent){
        context.on(name, (data) => {
          client.emit(name, data)
        });
      }
    });

    utils.extend(context, {
      Room: Room(context),
      Stream: Stream(context),
      WhiteBoard: WhiteBoard(context),
      ScreenShare: ScreenShare(context),
      Device: Device(context)
    });
  }
}