import utils from './utils';

export default class Network {
  constructor(_option) {
    _option = _option || {};
    let option = {
      url: 'https://cdn.ronghub.com/detecting',
      timeout: 1500,
      max: 30
    };
    utils.extend(option, _option);
    utils.extend(this, {
      option
    });
  }
  detect(callback) {
    let context = this;
    let { detecting, option } = context;
    if (detecting) {
      return;
    }
    utils.extend(context, {
      detecting: true
    });
    let { url, timeout, max } = option;
    let count = 1;
    let getCount = () => {
      count += 1;
      return count;
    };
    let isOnline = false;
    let ajax = () => {
      count = getCount();
      utils.request(url).then(() => {
        utils.extend(context, {
          detecting: false
        });
        isOnline = true;
        callback(isOnline);
      }, () => {
        if (utils.isEqual(max, count)) {
          return callback(isOnline);
        }
        setTimeout(() => {
          ajax();
        }, timeout);
      });
    };
    ajax();
  }
}