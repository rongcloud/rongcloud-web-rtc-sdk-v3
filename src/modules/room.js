import utils from '../utils';
import { RoomEvents } from './events';
import { UpEvent, DownEvent } from '../event-name';
import { check, getError } from '../common';
import Logger from '../logger';
import { LogTag, REGEXP_ROOM_ID, LENGTH_ROOM_ID } from '../enum';
import { ErrorType } from '../error';

export default class Room {
  constructor(option) {
    var context = this;
    let { id } = option || '';
    let roomIdLen = id.length;
    let client = context.getClient();
    if (!REGEXP_ROOM_ID.test(id) || roomIdLen > LENGTH_ROOM_ID) {
      let { Inner } = ErrorType;
      return client.emit(DownEvent.RTC_ERROR, Inner.ROOM_ID_IS_ILLEGAL)
    }
    utils.forEach(RoomEvents, function (event) {
      let { name, type } = event;
      client.on(name, (error, user) => {
        event = option[type] || utils.noop;
        event(user, error);
        Logger.log(LogTag.ROOM, {
          event: type,
          user
        });
      });
    });
    utils.extend(context, {
      option,
      client,
      room: {
        id
      }
    });
  }
  join(user) {
    let { isIllegal, name } = check(user, ['id', 'token']);
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