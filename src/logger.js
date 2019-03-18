import utils from './utils';
import { LogLevel } from './enum';

function Logger() {
  let observer = new utils.Observer();
  let write = (level, tag, meta) => {
    let time = new Date().getTime();
    let log = {
      level,
      tag,
      meta,
      time,
      platform: 'web'
    };
    observer.emit(log);
  };
  let warn = (tag, meta) => {
    return write(LogLevel.WARN, tag, meta);
  };
  let error = (tag, meta) => {
    return write(LogLevel.ERROR, tag, meta);
  };
  let info = (tag, meta) => {
    return write(LogLevel.INFO, tag, meta);
  };
  let log = (tag, meta) => {
    return write(LogLevel.VERBOSE, tag, meta);
  };
  let watch = (watcher, force) => {
    observer.add(watcher, force);
  };
  return {
    warn,
    error,
    info,
    log,
    watch
  };
}
export default Logger();