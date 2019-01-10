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
    return utils.request(url, {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
export const request = new Request();