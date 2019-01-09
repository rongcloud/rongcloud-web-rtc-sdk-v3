import { client } from '../providers/engine/client';
import { UpEvent } from '../event-name';

export default class Device {
  check() {
    return client.exec({
      event: UpEvent.DEVICE_CHECK
    });
  }
  getList() {
    return client.exec({
      event: UpEvent.DEVICE_GET_LIST
    });
  }
}