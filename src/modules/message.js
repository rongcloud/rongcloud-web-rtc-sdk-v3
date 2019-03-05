import utils from '../utils';
import { MessageEvents } from './events';
import { LogTag } from '../enum';
import { UpEvent } from '../event-name';
import { check, getError } from '../common';
import Logger from '../logger';

export default class Message {
  constructor(_option) {
    let context = this;
    let client = context.getClient();
    let option = {
      received: () => { }
    };
    utils.extend(option, _option);
    utils.extend(context, {
      client,
      option
    });
    utils.forEach(MessageEvents, (event) => {
      let { name, type } = event;
      client.on(name, (error, message) => {
        event = option[type] || utils.noop;
        event(message, error);
        Logger.log(LogTag.MESSAGE, {
          event: type,
          message
        });
      });
    });
  }
  send(message) {
    let {isIllegal, name} = check(message, ['name', 'content']);
    if (isIllegal) {
      let error = getError(name);
      return utils.Defer.reject(error);
    }
    let context = this;
    let { client } = context;
    return client.exec({
      event: UpEvent.MESSAGE_SEND,
      type: 'message',
      args: [message]
    });
  }
}