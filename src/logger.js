import utils from './utils';

function Logger() {
  let observer = new utils.Observer();
  let write = (level, content) => {
    let { tag, meta } = content;
    let time = new Date().getTime();
    let log = {
      level,
      tag,
      meta,
      time
    };
    observer.emit(log);
  };
  let warn = (content) => {
    return write('W', content);
  };
  let error = (content) => {
    return write('E', content);
  };
  let info = (content) => {
    return write('I', content);
  };
  let log = (content) => {
    return write('V', content);
  };
  let watch = (watcher) => {
    observer.add(watcher);
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