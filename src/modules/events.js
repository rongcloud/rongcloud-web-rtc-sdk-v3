import { EventName } from '../enum';

export const RoomEvents = [{
  name: EventName.ROOM_USER_JOINED,
  type: 'joined'
}, {
  name: EventName.ROOM_USER_LEFT,
  type: 'left'
}, {
  name: EventName.ROOM_USER_RESOURCE_CHANGED,
  type: 'changed_resource'
}];

export const StreamEvents = [{
  name: EventName.STREAM_ADDED,
  type: 'added'
}];

export const ErrorEvents = [{
  name: EventName.RTC_ERROR,
  type: 'error'
}];