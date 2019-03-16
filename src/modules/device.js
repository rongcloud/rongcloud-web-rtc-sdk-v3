import { UpEvent } from '../event-name';
import utils from '../utils';

export default class Device {
  constructor() {
    let context = this;
    let client = context.getClient();
    utils.extend(context, {
      client
    });
  }
  get() {
    let { client } = this;
    return client.exec({
      event: UpEvent.DEVICE_GET,
      type: 'device',
      args: []
    });
  }
}