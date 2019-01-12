import utils from './utils';

export default class EventEmitter {
  constructor() {
    this.events = {};
    this.onceEvents = {};
  }
  on(name, event) {
    let events = this.events[name] || [];
    events.push(event);
    this.events[name] = events;
  }
  off(name) {
    delete this.events[name];
  }
  emit(name, data, error) {
    let events = this.events[name];
    utils.forEach(events, (event) => {
      event(error, data);
    });

    let onceEvent = this.onceEvents[name] || utils.noop;
    onceEvent(error, data);
    delete this.onceEvents[name];
  }
  once(name, event) {
    this.onceEvents[name] = event;
  }
  teardown() {
    for (let name in this.events) {
      this.off(name);
    }
    for (let name in this.onceEvents) {
      delete this.onceEvents[name];
    }
  }
}