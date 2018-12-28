import { EventName } from '../enum';

export const RoomEvents = [{
  name: EventName.ROOM_USER_JOINED,
  type: 'joined'
}, {
  name: EventName.ROOM_USER_LEFT,
  type: 'left'
}];

export const StreamEvents = [{
  name: EventName.STREAM_ADDED,
  type: 'added'
},{
  name: EventName.STREAM_REMOVED,
  type: 'removed'
},{
  name: EventName.STREAM_CHANGED,
  type: 'changed'
}];

export const ErrorEvents = [{
  name: EventName.RTC_ERROR,
  type: 'error'
}];

export const ScreenShareEvents = [{
  name: EventName.SCREEN_SHARE_FINISHED,
  type: 'finished'
}];