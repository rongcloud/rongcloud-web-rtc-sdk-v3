import { EventName } from '../enum';

export const RoomEvents = [{
  name: EventName.ROOM_USER_JOINED,
  type: 'joined'
}, {
  name: EventName.ROOM_USER_LEFT,
  type: 'leaved'
}, {
  name: EventName.ROOM_CHANGED,
  type: 'changed'
}];

export const StreamEvents = [{
  name: EventName.STREAM_ADDED,
  type: 'added'
}];

export const NetworkEvents = [{
  name: EventName.RTC_SERVER,
  type: 'server-rtc'
}];

export const ErrorEvents = [{
  name: EventName.RTC_ERROR,
  type: 'error'
}];
