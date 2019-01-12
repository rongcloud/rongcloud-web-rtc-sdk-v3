import EventEmitter from '../../event-emitter';
import utils from '../../utils';
import StreamHandler from './stream-handler';
import RoomHandler from './room-handler';
import { im } from './im';
import { request } from './request';
import RTCAdapter from './3rd/adapter';
import { ErrorType } from '../../error';
import { RoomEvents } from '../../modules/events';
import { DownEvent } from '../../event-name';

let RequestHandler = {
  room: RoomHandler,
  stream: StreamHandler
};
class Client extends EventEmitter {
  constructor() {
    super();
    RTCAdapter.init();
  }
  /* 
    let option = {
      url: 'mediaServer path',
      RongIMLib
    };
  */
  setOption(option) {
    let context = this;
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
      let streams = [user];
      if(uris){
        streams = utils.uniq(uris, (target) => {
          let { streamId, tag, type } = target;
          return {
            key: [streamId, tag].join('_'),
            value: {
              tag,
              type
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
    request.setOption(option);
  }
  exec(params) {
    if (!im.isReady()) {
      return utils.Defer.reject(ErrorType.Inner.IM_NOT_CONNECTED);
    }
    let { type, args, event } = params;
    return RequestHandler[type].dispatch(event, args);
  }
}
export const client = new Client();