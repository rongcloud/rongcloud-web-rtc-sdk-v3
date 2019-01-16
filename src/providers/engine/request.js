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
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
  }
}
export const request = new Request();