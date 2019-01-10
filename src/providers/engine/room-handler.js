import { UpEvent } from '../../event-name';
import utils from '../../utils';

function RoomHandler() {
  let join = () => {
    return utils.deferred(() => {

    });
  };
  let leave = () => {
    return utils.deferred(() => {

    });
  };
  let get = () => {
    return utils.deferred(() => {

    });
  };
  let dispatch = (event, args) => {
    switch (event) {
      case UpEvent.ROOM_JOIN:
        return join(...args);
      case UpEvent.ROOM_LEAVE:
        return leave(...args);
      case UpEvent.ROOM_GET:
        return get(...args);
      default:
        utils.Logger.log(`RoomHandler: unkown upevent ${event}`);
    }
  };
  return {
    dispatch
  };
}

export default RoomHandler();