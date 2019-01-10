import EventEmitter from '../../event-emitter';
import utils from '../../utils';
import StreamHandler from './stream-handler';
import RoomHandler from './room-handler';
import { im } from './im';
import { request } from './request';

let RequestHandler = {
  room: RoomHandler,
  stream: StreamHandler
};
class Client extends EventEmitter {
  constructor() {
    super();
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
    im.registerMessage();
    request.setOption(option);
  }
  exec(params) {
    let { type, args, event } = params;
    return RequestHandler[type].dispatch(event, args);
  }
}
export const client = new Client();