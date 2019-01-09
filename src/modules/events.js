import { DownEvent } from '../event-name';

export const RoomEvents = [{
  name: DownEvent.ROOM_USER_JOINED,
  type: 'joined'
}, {
  name: DownEvent.ROOM_USER_LEFT,
  type: 'left'
}];

export const StreamEvents = [{
  name: DownEvent.STREAM_ADDED,
  type: 'added'
},{
  name: DownEvent.STREAM_REMOVED,
  type: 'removed'
},{
  name: DownEvent.STREAM_CHANGED,
  type: 'changed'
}];

export const ErrorEvents = [{
  name: DownEvent.RTC_ERROR,
  type: 'error'
}];