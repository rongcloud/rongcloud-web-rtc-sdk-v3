import utils from '../utils';
import { RoomEvents } from './events';
import { client } from '../providers/engine/client';
import { UpEvent } from '../event-name';

export default class Room {
  constructor(option) {
    var context = this;
    utils.forEach(RoomEvents, function (event) {
      let { name, type } = event;
      client.on(name, (error, user) => {
        event = option[type] || utils.noop;
        event(user, error);
      });
    });
    let { id } = option;
    utils.extend(context, {
      option: option,
      room: {
        id: id
      }
    });
  }
  join(user) {
    let { room } = this;
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
    let { room } = this;
    return client.exec({
      event: UpEvent.ROOM_LEAVE,
      type: 'room',
      args: [room]
    });
  }
  get() {
    let { room } = this;
    return client.exec({
      event: UpEvent.ROOM_GET,
      type: 'room',
      args: [room]
    });
  }
}