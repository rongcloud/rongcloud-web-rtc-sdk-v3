import { DownEvent } from '../event-name';

export const RoomEvents = [{
  name: DownEvent.ROOM_USER_JOINED,
  type: 'joined'
}, {
  name: DownEvent.ROOM_USER_LEFT,
  type: 'left'
}];

export const StreamEvents = [{
  name: DownEvent.STREAM_PUBLISH,
  type: 'published'
},{
  name: DownEvent.STREAM_UNPUBLISH,
  type: 'unpublished'
},{
  name: DownEvent.STREAM_DISABLED,
  type: 'disabled'
},{
  name: DownEvent.STREAM_ENABLED,
  type: 'enabled'
},{
  name: DownEvent.STREAM_MUTED,
  type: 'muted'
},{
  name: DownEvent.RTC_UNMOUNTED,
  type: 'unmuted'
}];

export const ErrorEvents = [{
  name: DownEvent.RTC_ERROR,
  type: 'error'
}];