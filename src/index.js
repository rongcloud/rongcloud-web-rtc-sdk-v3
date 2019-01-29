import Room from './modules/room';
import Stream from './modules/stream/index';
import { StreamType, StreamSize } from './enum';
import Client from './providers/engine/client';
import utils from './utils';
import { DownEvent } from './event-name';

export default class RongRTC {
  constructor(_option) {
    let context = this;
    let option = {
      url: 'https://ms-xq.rongcloud.net/',
      // url: 'http://10.13.10.123:7788/',
      created: () => { },
      mounted: () => { },
      unmounted: () => { },
      destroyed: () => { }
    };
    utils.extend(option, _option);
    let client = new Client(option);
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
      option,
      client
    });
    let { created, mounted, unmounted } = option;
    created();
    client.on(DownEvent.RTC_MOUNTED, () => {
      mounted();
    });
    client.on(DownEvent.RTC_UNMOUNTED, () => {
      unmounted();
    });
  }
  destroy() {
    let { option: { destroyed }, client } = this;
    destroyed();
    client.destroy();
  }
}