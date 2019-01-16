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

export default class Client extends EventEmitter {
  constructor() {
    super();
    RTCAdapter.init();
    let im = new IM();
    let RequestHandler = {
      room: RoomHandler(im),
      stream: StreamHandler(im)
    };
    utils.extend(this, {
      im,
      RequestHandler
    });
  }
  /* 
    let option = {
      url: 'mediaServer path',
      RongIMLib
    };
  */
  setOption(option) {
    let context = this;
    let { im } = context;
    let { RongIMLib } = option;
    utils.extend(context, {
      RongIMLib,
      option
    });
    im.setOption(option);
    let bindEvent = (event) => {
      let { name } = event;
      im.on(name, (error, user) => {
        context.emit(name, user, error);
      });
    };
    utils.forEach(RoomEvents, bindEvent);
    let dispatchStreamEvent = (user, callback) => {
      let { id, uris } = user;
      uris = JSON.parse(uris);
      let streams = [user];
      if (uris) {
        streams = utils.uniq(uris, (target) => {
          let { streamId, tag } = target;
          return {
            key: [streamId, tag].join('_'),
            value: {
              tag
            }
          }
        });
      }
      utils.forEach(streams, (stream) => {
        callback({
          id,
          stream
        });
      });
    };
    im.on(DownEvent.STREAM_READIY, (error, user) => {
      dispatchStreamEvent(user, (user) => {
        context.emit(DownEvent.STREAM_READIY, user, error);
      });
    });
    im.on(DownEvent.STREAM_UNPUBLISH, (error, user) => {
      dispatchStreamEvent(user, (user) => {
        context.emit(DownEvent.STREAM_UNPUBLISH, user, error);
      });
    });
    im.on(DownEvent.STREAM_CHANGED, (error, user) => {
      dispatchStreamEvent(user, (user) => {
        context.emit(DownEvent.STREAM_CHANGED, user, error);
      });
    });
    im.on(DownEvent.STREAM_PUBLISH, (error, stream) => {
      let { id: streamId } = stream;
      let [userId, tag] = streamId.split('_');
      context.emit(DownEvent.STREAM_PUBLISH, {
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
    let { im } = this;
    if (!im.isReady()) {
      return utils.Defer.reject(ErrorType.Inner.IM_NOT_CONNECTED);
    }
    let { type, args, event } = params;
    let { RequestHandler } = this;
    return RequestHandler[type].dispatch(event, args);
  }
}