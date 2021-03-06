import EventEmitter from '../../event-emitter';
import utils from '../../utils';
import StreamHandler from './handlers/stream';
import RoomHandler from './handlers/room';
import StorageHandler from './handlers/storage';
import MessageHandler from './handlers/message';
import DeviceHandler from './handlers/device';
import Stat from './stat';

import { IM } from './im';
import request from './request';
import RTCAdapter from './3rd/adapter';
import { ErrorType } from '../../error';
import { RoomEvents } from '../../modules/events';
import { DownEvent, UpEvent } from '../../event-name';
import { CommonEvent } from './events';
import Logger from '../../logger';
import { EventType, StreamType } from '../../enum';
import ReportHandler from './handlers/report';

export default class Client extends EventEmitter {
  /* 
    let option = {
      url: 'mediaServer path',
      RongIMLib
    };
  */
  constructor(option) {
    super();
    RTCAdapter.init();
    let im = new IM(option);
    let RequestHandler = {
      room: RoomHandler(im, option),
      stream: StreamHandler(im, option),
      storage: StorageHandler(im),
      message: MessageHandler(im),
      device: DeviceHandler(im),
      report: ReportHandler(im)
    };
    Stat(im, option);
    let context = this;
    let { RongIMLib } = option;
    let destroyed = false;
    utils.extend(context, {
      RongIMLib,
      option,
      destroyed,
      im,
      RequestHandler
    });
    let bindEvent = (event) => {
      let { name } = event;
      im.on(name, (error, user) => {
        context.emit(name, user, error);
      });
    };
    utils.forEach(RoomEvents, bindEvent);
    im.on(CommonEvent.JOINED, () => {
      let urls = im.getMSUrl();
      let { url: customUrl } = option;
      if (!utils.isEmpty(customUrl)) {
        urls = [customUrl];
      }
      if (utils.isEmpty(urls)) {
        let { Inner } = ErrorType;
        let error = Inner.ENGINE_ERROR;
        return context.emit(DownEvent.RTC_ERROR, error);
      }
      request.setOption({
        urls
      });
      context.emit(DownEvent.RTC_MOUNTED);
    });
    im.on(CommonEvent.LEFT, () => {
      context.emit(DownEvent.RTC_UNMOUNTED);
    });
    im.on(CommonEvent.ERROR, (error, data) => {
      context.emit(DownEvent.RTC_ERROR, data, error);
    });
    im.on(DownEvent.MESSAGE_RECEIVED, (error, message) => {
      context.emit(DownEvent.MESSAGE_RECEIVED, message, error);
    });
    im.on(DownEvent.REPORT_SPOKE, (error, user) => {
      context.emit(DownEvent.REPORT_SPOKE, user, error);
    });
    let getMSType = (uris) => {
      let check = (msType) => {
        return utils.some(uris, ({ mediaType }) => {
          // return utils.isEqual(msType, mediaType) && utils.isEqual(state, StreamState.ENABLE);
          // 只区分 track 不区分
          return utils.isEqual(msType, mediaType);
        });
      };
      let type = StreamType.NODE;
      let hasAudio = check(StreamType.AUDIO);
      let hasVideo = check(StreamType.VIDEO);
      if (hasAudio) {
        type = StreamType.AUDIO;
      }
      if (hasVideo) {
        type = StreamType.VIDEO;
      }
      if (hasVideo && hasAudio) {
        type = StreamType.AUDIO_AND_VIDEO;
      }
      return type;
    };
    let eventHandler = (name, result, error) => {
      let { id, stream: { tag, uris } } = result;
      let type = getMSType(uris);
      let user = {
        id,
        stream: {
          tag,
          type
        }
      };
      context.emit(name, user, error);
    };
    im.on(DownEvent.STREAM_PUBLISHED, (error, user) => {
      eventHandler(DownEvent.STREAM_PUBLISHED, user, error);
    });
    im.on(DownEvent.STREAM_UNPUBLISHED, (error, user) => {
      eventHandler(DownEvent.STREAM_UNPUBLISHED, user, error);
    });
    im.on(DownEvent.STREAM_DISABLED, (error, user) => {
      eventHandler(DownEvent.STREAM_DISABLED, user, error);
    });
    im.on(DownEvent.STREAM_ENABLED, (error, user) => {
      eventHandler(DownEvent.STREAM_ENABLED, user, error);
    });
    im.on(DownEvent.STREAM_MUTED, (error, user) => {
      eventHandler(DownEvent.STREAM_MUTED, user, error);
    });
    im.on(DownEvent.STREAM_UNMUTED, (error, user) => {
      eventHandler(DownEvent.STREAM_UNMUTED, user, error);
    });
  }
  exec(params) {
    let context = this;
    let { im } = context;
    if (context.isDestroyed()) {
      return utils.Defer.reject(ErrorType.Inner.INSTANCE_IS_DESTROYED);
    }
    if (!im.isSupportRTC()) {
      return utils.Defer.reject(ErrorType.Inner.IM_SDK_VER_NOT_MATCH);
    }
    let { type, args, event } = params;
    let APIWhitelist = [UpEvent.ROOM_JOIN, UpEvent.DEVICE_GET, UpEvent.STREAM_GET];
    let isInclude = utils.isInclude(APIWhitelist, event);

    if (!im.isIMReady() && !isInclude) {
      return utils.Defer.reject(ErrorType.Inner.IM_NOT_CONNECTED);
    }

    if (!isInclude && !im.isJoined()) {
      return utils.Defer.reject(ErrorType.Inner.RTC_NOT_JOIN_ROOM);
    }
    let { RequestHandler } = this;
    Logger.log(type, {
      func: event,
      type: EventType.REQUEST,
      args
    });
    return RequestHandler[type].dispatch(event, args).then(result => {
      Logger.log(type, {
        func: event,
        type: EventType.RESPONSE,
        result
      });
      return result;
    }, (error) => {
      Logger.error(type, {
        func: event,
        type: EventType.RESPONSE,
        error
      });
      error = utils.rename(error, {
        resultCode: 'code'
      })
      throw error;
    })
  }
  isDestroyed() {
    return this.destroyed;
  }
  extendOption(_option) {
    let context = this;
    utils.extend(context.option, _option);
  }
  destroy() {
    let context = this;
    utils.extend(context, {
      destroyed: true
    });
    context.teardown();
    context.im.teardown();
  }
}