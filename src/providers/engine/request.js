import utils from '../../utils';
class Request {
  setOption(option) {
    utils.extend(this, option);
  }
  post(option) {
    let { url: domain } = this;
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
  }
}
export const request = new Request();