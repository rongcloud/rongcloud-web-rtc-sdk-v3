import EventEmitter from './event-emitter';
import { NetworkEvent } from './event-name';

export default class Network extends EventEmitter {
  constructor() {
    super();
    let context = this;
    window.addEventListener(NetworkEvent.ONLINE, () => { 
      context.emit(NetworkEvent.ONLINE);
    });
  }
}