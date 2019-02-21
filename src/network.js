import utils from './utils';

export default class Network {
  constructor(_option) {
    _option = _option || {};
    let option = {
      url: 'https://cdn.ronghub.com/ping',
      timeout: 2000
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
    let { url, timeout } = option;
    let count = 1, maxCount = 30;
    let getCount = () => {
      if (count > 5) {
        count += 2;
      }
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
        if (utils.isEqual(maxCount, count)) {
          return callback(isOnline);
        }
        setTimeout(() => {
          ajax();
        }, timeout * count);
      });
    };
    ajax();
  }
}