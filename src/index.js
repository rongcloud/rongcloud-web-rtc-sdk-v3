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
      url: 'http://10.12.8.187:8585/',
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
      option
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
  destory() {
    let { option: { destroyed } } = this;
    destroyed();
    //TODO: destroy
  }
}