import utils from '../../utils';
import { StreamEvents } from '../events';
import Video from './video';
import Audio from './audio';
import { client } from '../../providers/engine/client';
import { UpEvent } from '../../event-name';

export default class Stream {
  constructor(option) {
    var context = this;
    utils.forEach(StreamEvents, (event) => {
      let { name, type } = event;
      client.on(name, (error, result) => {
        utils.extend(result, {
          type
        });
        event = option[type] || utils.noop;
        event(result, error);
      });
    });
    utils.extend(context, {
      option,
      video: new Video(),
      audio: new Audio()
    });
  }
  publish(user) {
    return client.exec({
      event: UpEvent.STREAM_PUBLISH,
      type: 'stream',
      args: [user]
    });
  }
  unpublish(user) {
    return client.exec({
      event: UpEvent.STREAM_UNPUBLISH,
      type: 'stream',
      args: [user]
    });
  }
  open(user) {
    return client.exec({
      event: UpEvent.STREAM_OPEN,
      type: 'stream',
      args: [user]
    });
  }
  close(user) {
    return client.exec({
      event: UpEvent.STREAM_CLOSE,
      type: 'stream',
      args: [user]
    });
  }
  resize(user) {
    return client.exec({
      event: UpEvent.STREAM_RESIZE,
      type: 'stream',
      args: [user]
    });
  }
  get(user) {
    return client.exec({
      event: UpEvent.STREAM_GET,
      type: 'stream',
      args: [user]
    });
  }
}