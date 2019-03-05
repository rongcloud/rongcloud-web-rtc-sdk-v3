import Room from './modules/room';
import Stream from './modules/stream/index';
import { StreamType, StreamSize, LogTag, StorageType } from './enum';
import Client from './providers/engine/client';
import utils from './utils';
import { DownEvent } from './event-name';
import Logger from './logger';
import { ErrorType } from './error';
import Storage from './modules/storage';
import Message from './modules/message';

export default class RongRTC {
  constructor(_option) {
    let context = this;
    let option = {
      appkey: '',
      url: 'https://msqa.rongcloud.net/',
      debug: false,
      created: () => { },
      mounted: () => { },
      unmounted: () => { },
      destroyed: () => { },
      error: () => { }
    };
    utils.extend(option, _option);
    let { logger, debug } = option;
    if (utils.isFunction(logger)) {
      Logger.watch(logger);
    }
    if (debug) {
      Logger.watch(log => {
        utils.Log.log(log);
      });
    }
    let client = new Client(option);
    utils.forEach([Room, Stream, Storage, Message], (module) => {
      module.prototype.getClient = () => {
        return client;
      };
    });
    utils.extend(context, {
      Room,
      Stream,
      Storage,
      StreamType,
      StreamSize,
      StorageType,
      Message,
      option,
      client
    });
    let { appkey, created, mounted, unmounted, error } = option;
    if (utils.isEmpty(appkey)) {
      let { Inner } = ErrorType;
      return error(Inner.APPKEY_ILLEGAL);
    }
    created();
    Logger.log(LogTag.LIFECYCLE, {
      state: 'created'
    });
    client.on(DownEvent.RTC_MOUNTED, () => {
      mounted();
      Logger.log(LogTag.LIFECYCLE, {
        state: 'mounted'
      });
    });
    client.on(DownEvent.RTC_UNMOUNTED, () => {
      unmounted();
      Logger.log(LogTag.LIFECYCLE, {
        state: 'unmounted'
      });
    });
    client.on(DownEvent.RTC_ERROR, (e, data) => {
      if (e) {
        throw new Error(e);
      }
      error(data);
    });
  }
  destroy() {
    let { option: { destroyed }, client } = this;
    destroyed();
    client.destroy();
    Logger.log(LogTag.LIFECYCLE, {
      state: 'destroyed'
    });
  }
}