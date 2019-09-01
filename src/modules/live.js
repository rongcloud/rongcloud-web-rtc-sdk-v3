import { getError, check } from '../common';
import utils from '../utils';
import { UpEvent } from '../event-name';

export default class Live {
  constructor() {
    let context = this;
    let client = context.getClient();
    utils.extend(context, {
      client
    });
  }
  subscribe(room) {
    let { isIllegal, name } = check(room, ['liveUrl']);
    if (isIllegal) {
      let error = getError(name);
      return utils.Defer.reject(error);
    }
    let { client } = this;
    return client.exec({
      event: UpEvent.LIVE_SUBSCRIBE,
      type: 'live',
      args: [room]
    });
  }
  unsubscribe(room) {
    let { isIllegal, name } = check(room, ['liveUrl']);
    if (isIllegal) {
      let error = getError(name);
      return utils.Defer.reject(error);
    }
    let { client } = this;
    return client.exec({
      event: UpEvent.LIVE_UNSUBSCRIBE,
      type: 'live',
      args: [room]
    });
  }
}