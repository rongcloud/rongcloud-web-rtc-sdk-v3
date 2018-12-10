// 分发事件
import EventEmitter from '../../../../event-emitter';
import utils, { Logger } from '../../../../utils';
import Socket from './socket';
import { SignalEvent, DownEventFlag } from '../events';
import { EventName } from '../../../../enum';
export default class Client extends EventEmitter {
  constructor(option) {
    super();
    let context = this;
    let socket;
    
    let DwonEvents = {
      // 成员加入
      joined: (data) => {
        context.emit(SignalEvent.PushJoin, data);
      },
      // 成员离开
      left: (data) => {
        context.emit(SignalEvent.PushLeave, data);
      },
      offerRequest: (data) => {
        context.emit(SignalEvent.PushOfferRequest, data);
      },
      update_resource_notify: (data) => {
        context.emit(SignalEvent.PushResource, data);
      },
      update_subscribe_notify: (data) => {
        context.emit(SignalEvent.PushSubscribe, data);
      },
      // 当前用加入成功
      logonAndJoin_result: (data) => {
        context.emit(SignalEvent.ConnectAck, data);
      },
      channelPing_result: (data) => {
        context.emit(SignalEvent.Pong, data);
      },
      // 当前用户离开成功
      leave_result: (data) => {
        context.emit(SignalEvent.LeaveAck, data);
      },
      exchange_result: (data) => {
        context.emit(SignalEvent.ExchangeAck, data);
      },
      ewb_query_result: (data) => {
        context.emit(SignalEvent.QueryWhiteBoardAck, data);
      },
      ewb_create_multi_result: (data) => {
        context.emit(SignalEvent.CreateWhiteBoardAck, data);
      },
      delete_result: (data) => {
        context.emit(SignalEvent.DeleteWhiteBoardAck, data);
      },
      update_resource_result: (data) => {
        context.emit(SignalEvent.UpdateResourceAck, data);
      },
      update_subscribe_result: (data) => {
        context.emit(SignalEvent.UpdateSubscribeAck, data);
      }
    };
    let UpEvents = {
      connect: () => {
        let url = option.url;
        socket = new Socket(url);
      },
      logonAndJoin: (data) => {
        socket.send(data);
      },
      channelPing: (data) => {
        socket.send(data);
      },
      leave: (data) => {
        socket.send(data);
      },
      exchange: (data) => {
        socket.send(data);
      },
      ewb_query: (data) => {
        socket.send(data);
      },
      ewb_create_multi: (data) => {
        socket.send(data);
      },
      ewb_delete: (data) => {
        socket.send(data);
      },
      flowSubscribe: (data) => {
        socket.send(data);
      },
      update_resource: (data) => {
        socket.send(data);
      },
      update_subscribe: (data) => {
        socket.send(data);
      }
    };
    utils.forEach(SignalEvent, name => {
      let isUpEvent = !utils.isContain(name, DownEventFlag);
      if (isUpEvent) {
        context.on(name, data => {
          let event = UpEvents[name] || Logger.warn
          event(data);
        });
      }
    });
    let events = {
      onclose: function (event) {
        context.emit(EventName.RTC_SERVER_COLSE, event.data);
      },
      onerror: function (event) {
        context.emit(EventName.RTC_ERROR, event.data);
      },
      onmessage: function (event) {
        let data = JSON.parse(event.data);
        let { signal: name } = data;
        event = DwonEvents[name] || Logger.warn;
        event(data);
      },
      onopen: function (event) {
        context.emit(SignalEvent.ConnectAck, event.data);
      }
    };
    utils.forEach(events, (event, name) => {
      socket[name] = event;
    });
  }
}