import { UpEvent } from '../../../event-name';
import { LogTag, StorageType } from '../../../enum';
import utils from '../../../utils';
import Logger from '../../../logger';

function StorageHandler(im) {
  let isInner = false;
  let getType = (type) => {
    return utils.isEqual(type, StorageType.ROOM) ? 'Room' : 'User';
  };
  let getName = (operate, type) => {
    let tpl = '{operate}{type}Data';
    type = getType(type);
    return utils.tplEngine(tpl, {
      operate,
      type
    })
  };
  let set = (type, key, value, message) => {
    let name = getName('set', type);
    return im[name](key, value, isInner, message)
  };
  let get = (type, key) => {
    let name = getName('get', type);
    return im[name](key, isInner);
  };
  let remove = (type, key, message) => {
    let name = getName('remove', type);
    return im[name](key, isInner, message);
  };
  let dispatch = (event, args) => {
    switch (event) {
      case UpEvent.STORAGE_SET:
        return set(...args);
      case UpEvent.STORAGE_GET:
        return get(...args);
      case UpEvent.STORAGE_REMOVE:
        return remove(...args);
      default:
        Logger.warn(LogTag.STORAGE_HANDLER, {
          event,
          msg: 'unkown event'
        });
    }
  };
  return {
    dispatch
  };
}
export default StorageHandler;