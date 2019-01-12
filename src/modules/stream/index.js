import utils from '../../utils';
import { StreamEvents } from '../events';
import Video from './video';
import Audio from './audio';
import { UpEvent } from '../../event-name';

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
    let { client } = this;
    return client.exec({
      event: UpEvent.STREAM_PUBLISH,
      type: 'stream',
      args: [user]
    });
  }
  unpublish(user) {
    let { client } = this;
    return client.exec({
      event: UpEvent.STREAM_UNPUBLISH,
      type: 'stream',
      args: [user]
    });
  }
  open(user) {
    let { client } = this;
    return client.exec({
      event: UpEvent.STREAM_OPEN,
      type: 'stream',
      args: [user]
    });
  }
  close(user) {
    let { client } = this;
    return client.exec({
      event: UpEvent.STREAM_CLOSE,
      type: 'stream',
      args: [user]
    });
  }
  resize(user) {
    let { client } = this;
    return client.exec({
      event: UpEvent.STREAM_RESIZE,
      type: 'stream',
      args: [user]
    });
  }
  get(user) {
    let { client } = this;
    return client.exec({
      event: UpEvent.STREAM_GET,
      type: 'stream',
      args: [user]
    });
  }
}