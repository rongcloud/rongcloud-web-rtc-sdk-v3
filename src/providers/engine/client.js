import EventEmitter from '../../event-emitter';
import utils from '../../utils';
import StreamHandler from './stream-handler';
import RoomHandler from './room-handler';
import { im } from './im';
import { request } from './request';
import RTCAdapter from './3rd/adapter';

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
    request.setOption(option);
  }
  exec(params) {
    let { type, args, event } = params;
    return RequestHandler[type].dispatch(event, args);
  }
}
export const client = new Client();