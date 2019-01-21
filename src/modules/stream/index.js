import utils from '../../utils';
import { StreamEvents } from '../events';
import Video from './video';
import Audio from './audio';
import { UpEvent } from '../../event-name';
import { check, getError } from '../common';

export default class Stream {
  constructor(option) {
    var context = this;
    let client = context.getClient();
    utils.forEach(StreamEvents, (event) => {
      let { name, type } = event;
      client.on(name, (error, user) => {
        event = option[type] || utils.noop;
        event(user, error);
      });
    });
    utils.extend(context, {
      option,
      client,
      video: new Video(client),
      audio: new Audio(client)
    });
  }
  publish(user) {
    let { isIllegal, name } = check(user, ['id', 'stream.tag', 'stream.mediaStream', 'stream.type']);
    if (isIllegal) {
      let error = getError(name);
      return utils.Defer.reject(error);
    }
    let { client } = this;
    return client.exec({
      event: UpEvent.STREAM_PUBLISH,
      type: 'stream',
      args: [user]
    });
  }
  unpublish(user) {
    let { isIllegal, name } = check(user, ['id', 'stream.tag', 'stream.type']);
    if (isIllegal) {
      let error = getError(name);
      return utils.Defer.reject(error);
    }
    let { client } = this;
    return client.exec({
      event: UpEvent.STREAM_UNPUBLISH,
      type: 'stream',
      args: [user]
    });
  }
  subscribe(user) {
    let { isIllegal, name } = check(user, ['id', 'stream.tag', 'stream.type']);
    if (isIllegal) {
      let error = getError(name);
      return utils.Defer.reject(error);
    }
    let { client } = this;
    return client.exec({
      event: UpEvent.STREAM_SUBSCRIBE,
      type: 'stream',
      args: [user]
    });
  }
  unsubscribe(user) {
    let { isIllegal, name } = check(user, ['id', 'stream.tag']);
    if (isIllegal) {
      let error = getError(name);
      return utils.Defer.reject(error);
    }
    let { client } = this;
    return client.exec({
      event: UpEvent.STREAM_UNSUBSCRIBE,
      type: 'stream',
      args: [user]
    });
  }
  resize(user) {
    let { isIllegal, name } = check(user, ['id', 'stream.tag']);
    if (isIllegal) {
      let error = getError(name);
      return utils.Defer.reject(error);
    }
    let { client } = this;
    return client.exec({
      event: UpEvent.STREAM_RESIZE,
      type: 'stream',
      args: [user]
    });
  }
  get(user) {
    let { client } = this;
    let { isIllegal, name } = check(user, ['id', 'stream.tag']);
    if (isIllegal) {
      let error = getError(name);
      return utils.Defer.reject(error);
    }
    return client.exec({
      event: UpEvent.STREAM_GET,
      type: 'stream',
      args: [user]
    });
  }
}