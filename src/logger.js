import utils from './utils';

function Logger() {
  let observer = new utils.Observer();
  let write = (type, content) => {
    let log = {
      type,
      content
    };
    observer.emit(log);
  };
  let warn = (content) => {
    return write('warn', content);
  };
  let error = (content) => {
    return write('error', content);
  };
  let info = (content) => {
    return write('info', content);
  };
  let log = (content) => {
    return write('log', content);
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