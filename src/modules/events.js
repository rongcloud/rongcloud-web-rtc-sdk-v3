import { EventName } from '../enum';

export const RoomEvents = [{
  name: EventName.ROOM_USER_JOINED,
  type: 'joined'
}, {
  name: EventName.ROOM_USER_LEFT,
  type: 'leaved'
}, {
  name: EventName.ROLE_CHANGED,
  type: 'changed'
}];

export const StreamEvents = [{
  name: EventName.STREAM_ADDED,
  type: 'added'
}];

export const NetworkEvents = [{
  name: EventName.NETWORK,
  type: 'network'
}]