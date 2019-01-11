import Room from './modules/room';
import Stream from './modules/stream/index';
import { StreamType, StreamSize } from './enum';
import { client } from './providers/engine/client';
import utils from './utils';

let option = {
  url: 'http://127.0.0.1:8090/'
};
export default class RongRTC {
  constructor(_option) {
    let context = this;
    utils.extend(option, _option);
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