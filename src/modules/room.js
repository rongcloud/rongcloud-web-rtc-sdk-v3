import utils from '../utils';
import { RoomEvents } from './events';
import { UpEvent } from '../event-name';
import { check, getError } from './common';

export default class Room {
  constructor(option) {
    var context = this;
    let client = context.getClient();
    utils.forEach(RoomEvents, function (event) {
      let { name, type } = event;
      client.on(name, (error, user) => {
        event = option[type] || utils.noop;
        event(user, error);
      });
    });
    let { id } = option;
    utils.extend(context, {
      option,
      client,
      room: {
        id
      }
    });
  }
  join(user) {
    let {isIllegal, name} = check(user, ['id', 'token']);
    if (isIllegal) {
      let error = getError(name);
      return utils.Defer.reject(error);
    }
    let { room, client } = this;
    utils.extend(room, {
      user
    });
    return client.exec({
      event: UpEvent.ROOM_JOIN,
      type: 'room',
      args: [room]
    });
  }
  leave() {
    let { room, client } = this;
    return client.exec({
      event: UpEvent.ROOM_LEAVE,
      type: 'room',
      args: [room]
    });
  }
  get() {
    let { room, client } = this;
    return client.exec({
      event: UpEvent.ROOM_GET,
      type: 'room',
      args: [room]
    });
  }
}