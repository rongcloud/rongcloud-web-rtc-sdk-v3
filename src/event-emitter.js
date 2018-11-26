import utils from './utils';

export default class EventEmitter{
  constructor(){
    this.events = {};
    this.onceEvents = {};
  }
  on(name, event){
    this.events[name] = event;
  }
  off(name){
    delete this.events[name];
  }
  emit(name, data, error){
    let event = this.events[name] || utils.noop;
    event(error, data);

    let onceEvent = this.onceEvents[name] || utils.noop;
    onceEvent(error, data);
    delete this.onceEvents[name];
  }
  once(name, event){
    this.onceEvents[name] = event;
  }
}