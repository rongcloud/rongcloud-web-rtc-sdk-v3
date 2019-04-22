import utils from '../../utils';
import EventEmitter from '../../event-emitter';
import { CommonEvent } from './events';
import { REQUEST_TIMEOUT, MEDIASERVER_SUCCESS } from '../../enum';
import { ErrorType } from '../../error';
function request() {
  let config = {
    urls: []
  };
  // 正在使用的 URL 下标，每次请求在 urls 中取对应的地址发送请求
  let indexTools = new utils.Index();

  let prosumer = new utils.Prosumer();
  let eventEmitter = new EventEmitter();
  let setOption = (_config) => {
    utils.extend(config, _config);
  };
  let postProcess = (option) => {
    let { urls } = config;
    let { path, body } = option;
    let tpl = '{domain}{path}';

    return utils.deferred((resolve, reject) => {
      let doRequest = (error) => {
        let index = indexTools.get();
        let isRange = index >= urls.length;
        if (isRange) {
          let { Inner } = ErrorType;
          indexTools.reset();
          error = utils.isEqual(error.status, 0) ? Inner.MEDIA_SERVER_ERROR : error;
          return reject(error);
        }
        let domain = urls[index];
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
        utils.request(url, {
          method: 'POST',
          timeout: REQUEST_TIMEOUT,
          body: JSON.stringify(body),
          headers
        }).then(result => {
          let { resultCode: code } = result;
          if (utils.isEqual(code, MEDIASERVER_SUCCESS)) {
            resolve(result);
          } else {
            reject(result);
          }
        }, error => {
          let { status } = error;
          if (utils.isInclude([403], status)) {
            return reject(error);
          }
          indexTools.add();
          doRequest(error);
        });
      };
      doRequest();
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