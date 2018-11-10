import utils from "./utils";

let $events = {};
export default class EventEmitter{
  on(name, event){
    $events[name] = event;
  }
  emit(name, data){
    utils.extend(data, {
      type: name
    });
    let event = $events[name] || utils.noop;
    event(data);
  }
}