import EventEmitter from '../../event-emitter';
import utils from '../../utils';
import StreamHandler from './stream-handler';
import RoomHandler from './room-handler';
import { IM } from './im';
import { request } from './request';
import RTCAdapter from './3rd/adapter';
import { ErrorType } from '../../error';
import { RoomEvents } from '../../modules/events';
import { DownEvent } from '../../event-name';
import { CommonEvent } from './events';

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
      room: RoomHandler(im),
      stream: StreamHandler(im)
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
    im.on(DownEvent.STREAM_PUBLISHED, (error, { id, stream: { tag } }) => {
      context.emit(DownEvent.STREAM_PUBLISHED, { id, stream: { tag } }, error);
    });
    im.on(DownEvent.STREAM_UNPUBLISHED, (error, user) => {
      context.emit(DownEvent.STREAM_UNPUBLISHED, user, error);
    });
    im.on(DownEvent.STREAM_DISABLED, (error, user) => {
      context.emit(DownEvent.STREAM_DISABLED, user, error);
    });
    im.on(DownEvent.STREAM_ENABLED, (error, user) => {
      context.emit(DownEvent.STREAM_ENABLED, user, error);
    });
    im.on(DownEvent.STREAM_MUTED, (error, user) => {
      context.emit(DownEvent.STREAM_MUTED, user, error);
    });
    im.on(DownEvent.STREAM_SUBSCRIBED, (error, stream) => {
      let { id: streamId } = stream;
      let [userId, tag] = streamId.split('_');
      context.emit(DownEvent.STREAM_SUBSCRIBED, {
        id: userId,
        stream: {
          tag,
          mediaStream: stream
        }
      }, error);
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
    let { RequestHandler } = this;
    return RequestHandler[type].dispatch(event, args);
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