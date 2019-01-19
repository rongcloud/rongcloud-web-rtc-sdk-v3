import { DownEvent } from '../event-name';

export const RoomEvents = [{
  name: DownEvent.ROOM_USER_JOINED,
  type: 'joined'
}, {
  name: DownEvent.ROOM_USER_LEFT,
  type: 'left'
}];

export const StreamEvents = [{
  name: DownEvent.STREAM_READY,
  type: 'readied'
},{
  name: DownEvent.STREAM_PUBLISH,
  type: 'opened'
},{
  name: DownEvent.STREAM_UNPUBLISH,
  type: 'closed'
},{
  name: DownEvent.STREAM_CHANGED,
  type: 'changed'
}];

export const ErrorEvents = [{
  name: DownEvent.RTC_ERROR,
  type: 'error'
}];