import Room from './modules/room';
import Stream from './modules/stream/index';
import { StreamType, StreamSize } from './enum';
import Client from './providers/engine/client';
import utils from './utils';

let option = {
  url: 'http://127.0.0.1:8090/'
};
export default class RongRTC {
  constructor(_option) {
    let context = this;
    utils.extend(option, _option);
    let client = new Client();
    client.setOption(option);
    utils.forEach([Room, Stream], (module) => {
      module.prototype.getClient = () => {
        return client;
      };
    });
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