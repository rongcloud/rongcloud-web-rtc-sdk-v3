import EventEmitter from '../../event-emitter';
import utils from '../../utils';
import StreamHandler from './stream-handler';
import RoomHandler from './room-handler';
import { im } from './im';

let RequestHandler = {
  room: RoomHandler,
  stream: StreamHandler
};
class Client extends EventEmitter {
  constructor() {
    super();
  }
  setOption(option) {
    let context = this;
    let { RongIMLib } = option;
    utils.extend(context, {
      RongIMLib,
      option
    });
    im.setOption(option);
    im.registerMessage();
  }
  exec(params) {
    let { RongIMLib } = this;
    let { type, args, event } = params;
    return RequestHandler[type].dispatch(RongIMLib, event, args);
  }
}
export const client = new Client();