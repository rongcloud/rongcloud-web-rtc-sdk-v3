import EventEmitter from '../../event-emitter';
import utils from '../../utils';
import StreamHandler from './stream-handler';
import RoomHandler from './room-handler';
import { IM } from './im';
import { request } from './request';
import RTCAdapter from './3rd/adapter';
import { ErrorType } from '../../error';
import { RoomEvents } from '../../modules/events';
import { DownEvent, UpEvent } from '../../event-name';
import { CommonEvent } from './events';
import Logger from '../../logger';
import { EventType } from '../../enum';

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
      stream: StreamHandler(im, option)
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
      context.emit(DownEvent.RTC_MOUNTED);
    });
    im.on(CommonEvent.LEFT, () => {
      context.emit(DownEvent.RTC_UNMOUNTED);
    });
    im.on(CommonEvent.ERROR, (error) => {
      context.emit(DownEvent.RTC_ERROR, error);
    });
    let eventHandler = (name, result, error) => {
      let { id, stream: { tag } } = result;
      let user = {
        id,
        stream: {
          tag
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
    request.setOption(option);
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
    if (!utils.isEqual(UpEvent.ROOM_JOIN, event) && !im.isJoined()) {
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
      Logger.log(type, {
        func: event,
        type: EventType.RESPONSE,
        error
      });
      throw error;
    });
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