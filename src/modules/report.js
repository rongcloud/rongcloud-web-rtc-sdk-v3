import { UpEvent } from '../event-name';
import { ReportEvents } from './events';
import utils from '../utils';

export default class Report {
  constructor(_option) {
    let context = this;
    let client = context.getClient();
    let option = {
      received: () => { }
    };
    utils.extend(option, _option);
    utils.extend(context, {
      client,
      option
    });
    utils.forEach(ReportEvents, (event) => {
      let { name, type } = event;
      client.on(name, (error, report) => {
        event = option[type] || utils.noop;
        event(report, error);
      });
    });
  }
  start(option) {
    let { client } = this;
    return client.exec({
      event: UpEvent.REPORT_START,
      type: 'report',
      args: [option]
    });
  }
  stop() {
    let { client } = this;
    return client.exec({
      event: UpEvent.REPORT_STOP,
      type: 'report',
      args: []
    });
  }
}