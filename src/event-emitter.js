import utils from './utils';

let events = {};
let onceEvents = {};
export default class EventEmitter{
  on(name, event){
    events[name] = event;
  }
  off(name){
    delete events[name];
  }
  emit(name, data, error){
    utils.extend(data, {
      type: name
    });
    let event = events[name] || utils.noop;
    event(error, data);

    let onceEvent = onceEvents[name] || utils.noop;
    onceEvent(error, data);
    delete onceEvents[name];
  }
  once(name, event){
    onceEvents[name] = event;
  }
}