import { getError } from "../common";
import utils from "../utils";
import { UpEvent } from "../event-name";

export default class Broadcast {
  constructor(_option) {
    let context = this;
    let client = context.getClient();
  }
  subscribe(room) {
    let { isIllegal, name } = check(room, ['liveUrl']);
    if (isIllegal) {
      let error = getError(name);
      return utils.Defer.reject(error);
    }
    let { client } = this;
    return client.exec({
      event: UpEvent.BROADCAST_SUBSCRIBE,
      type: 'broadcast',
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
      event: UpEvent.BROADCAST_UNSUBSCRIBE,
      type: 'broadcast',
      args: [room]
    });
  }
}