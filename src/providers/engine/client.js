import EventEmitter from '../../event-emitter';
import utils from '../../utils';
import StreamHandler from './handlers/stream';
import RoomHandler from './handlers/room';
import StorageHandler from './handlers/storage';
import MessageHandler from './handlers/message';
import DeviceHandler from './handlers/device';

import { IM } from './im';
import request from './request';
import RTCAdapter from './3rd/adapter';
import { ErrorType } from '../../error';
import { RoomEvents } from '../../modules/events';
import { DownEvent, UpEvent } from '../../event-name';
import { CommonEvent } from './events';
import Logger from '../../logger';
import { EventType, StreamType } from '../../enum';

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
      device: DeviceHandler(im)
    };
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
      let url = im.getMSUrl();
      let { url: customUrl } = option;
      url = customUrl || url;
      request.setOption({
        url
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
    if (!im.isReady()) {
      return utils.Defer.reject(ErrorType.Inner.IM_NOT_CONNECTED);
    }
    let { type, args, event } = params;
    let APIWhitelist = [UpEvent.ROOM_JOIN, UpEvent.DEVICE_GET];
    if (!utils.isInclude(APIWhitelist, event) && !im.isJoined()) {
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
  destroy() {
    let context = this;
    utils.extend(context, {
      destroyed: true
    });
    context.teardown();
    context.im.teardown();
  }
}