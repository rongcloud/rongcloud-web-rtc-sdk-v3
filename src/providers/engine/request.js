import utils from '../../utils';
import EventEmitter from '../../event-emitter';
import { CommonEvent } from './events';

function request() {
  let config = {};
  let prosumer = new utils.Prosumer();
  let eventEmitter = new EventEmitter();
  let setOption = (_config) => {
    utils.extend(config, _config);
  };
  let postProcess = (option) => {
    let { url: domain } = config;
    let { path, body } = option;
    let tpl = '{domain}{path}';
    let url = utils.tplEngine(tpl, {
      domain,
      path
    });
    let headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    };
    let { headers: _headers } = option;
    if (utils.isObject(_headers)) {
      utils.extend(headers, _headers);
    }
    return utils.request(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers
    });
  };
  eventEmitter.on(CommonEvent.REQUEST_CONSUME, () => {
    prosumer.consume(({ option, resolve, reject }, next) => {
      postProcess(option).then((result) => {
        resolve(result);
        next();
      }, (error) => {
        reject(error);
        next();
      });
    });
  });
  let post = (option) => {
    return utils.deferred((resolve, reject) => {
      prosumer.produce({ option, resolve, reject });
      eventEmitter.emit(CommonEvent.REQUEST_CONSUME);
    });
  };
  return {
    setOption,
    post
  }
}
export default request();