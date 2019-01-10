import EventEmitter from '../../event-emitter';
import utils from '../../utils';
import StreamHandler from './stream-handler';
import RoomHandler from './room-handler';

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
  }
  exec(params) {
    let {type, args, event} = params;
    return RequestHandler[type].dispatch(event, args);
  }
}
export const client = new Client();