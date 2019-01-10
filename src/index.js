import Room from './modules/room';
import Stream from './modules/stream/index';
import { StreamType, StreamSize } from './enum';
import { client } from './providers/engine/client';
import utils from './utils';

export default class RongRTC {
  constructor(option) {
    let context = this;
    client.setOption(option);
    utils.extend(context, {
      Room,
      Stream,
      StreamType,
      StreamSize,
    });
  }
  destory() {

  }
}