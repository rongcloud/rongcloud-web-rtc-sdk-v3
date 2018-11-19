import utils from "./utils";

let $events = {};
export default class EventEmitter{
  on(name, event){
    $events[name] = event;
  }
  emit(name, data, error){
    utils.extend(data, {
      type: name
    });
    let event = $events[name] || utils.noop;
    event(error, data);
  }
}