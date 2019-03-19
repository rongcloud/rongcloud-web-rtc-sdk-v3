import utils from '../utils';
import { StorageType } from '../enum';
import { check, getError } from '../common';
import { UpEvent } from '../event-name';

export default class Storage {
  constructor(_option) {
    _option = _option || {};
    var context = this;
    let client = context.getClient();
    let option = {
      type: StorageType.ROOM
    };
    utils.extend(option, _option);
    utils.extend(context, {
      option,
      client
    });
  }
  set(key, value, message) {
    let { isIllegal, name } = check({ key, value }, ['key', 'value']);
    if (isIllegal) {
      let error = getError(name);
      return utils.Defer.reject(error);
    }
    let context = this;
    let { client, option: { type } } = context;
    return client.exec({
      event: UpEvent.STORAGE_SET,
      type: 'storage',
      args: [type, key, value, message]
    });
  }
  get(key) {
    let { isIllegal, name } = check({ key }, ['key']);
    if (isIllegal) {
      let error = getError(name);
      return utils.Defer.reject(error);
    }
    let context = this;
    let { client, option: { type } } = context;
    return client.exec({
      event: UpEvent.STORAGE_GET,
      type: 'storage',
      args: [type, key]
    });
  }
  remove(key, message) {
    let { isIllegal, name } = check({ key }, ['key']);
    if (isIllegal) {
      let error = getError(name);
      return utils.Defer.reject(error);
    }
    let context = this;
    let { client, option: { type } } = context;
    return client.exec({
      event: UpEvent.STORAGE_REMOVE,
      type: 'storage',
      args: [type, key, message]
    });
  }
}