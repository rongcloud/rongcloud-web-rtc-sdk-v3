export default class utils {
  static extend(destination, sources) {
    for (let key in sources) {
      let value = sources[key];
      destination[key] = value;
    }
    return destination;
  }

  static noop() { }

  static deferred(callback){
    return new Promise(callback);
  }
}