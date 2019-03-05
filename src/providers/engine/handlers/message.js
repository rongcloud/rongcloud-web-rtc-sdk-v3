import { UpEvent } from '../../../event-name';
import { LogTag } from '../../../enum';
import Logger from '../../../logger';

function MessageHandler(im) {
  let send = (message) => {
    return im.sendMessage(message);
  };
  let dispatch = (event, args) => {
    switch (event) {
      case UpEvent.MESSAGE_SEND:
        return send(...args);
      default:
        Logger.warn(LogTag.MESSAGE, {
          event,
          msg: 'unkown event'
        });
    }
  };
  return {
    dispatch
  };
}

export default MessageHandler;