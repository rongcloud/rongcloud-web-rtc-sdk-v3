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

    let downEventHandler = (data) => {
      let { signal } = data;
      switch (signal) {
      case SignalEvent.PushJoin:
        context.emit(SignalEvent.PushJoin, data);
        break;
      case SignalEvent.PushLeave:
        context.emit(SignalEvent.PushLeave, data);
        break;
      case SignalEvent.PushOfferRequest:
        context.emit(SignalEvent.PushOfferRequest, data);
        break;
      case SignalEvent.PushResource:
        context.emit(SignalEvent.PushResource, data);
        break;
      case SignalEvent.PushSubscribe:
        context.emit(SignalEvent.PushSubscribe, data);
        break;
      case SignalEvent.ConnectAck:
        context.emit(SignalEvent.ConnectAck, data);
        break;
      case SignalEvent.Pong:
        context.emit(SignalEvent.Pong, data);
        break;
      case SignalEvent.LeaveAck:
        context.emit(SignalEvent.LeaveAck, data);
        break;
      case SignalEvent.ExchangeAck:
        context.emit(SignalEvent.ExchangeAck, data);
        break;
      case SignalEvent.QueryWhiteBoardAck:
        context.emit(SignalEvent.QueryWhiteBoardAck, data);
        break;
      case SignalEvent.CreateWhiteBoardAck:
        context.emit(SignalEvent.CreateWhiteBoardAck, data);
        break;
      case SignalEvent.DeleteWhiteBoardAck:
        context.emit(SignalEvent.DeleteWhiteBoardAck, data);
        break;
      case SignalEvent.UpdateResourceAck:
        context.emit(SignalEvent.UpdateResourceAck, data);
        break;
      case SignalEvent.UpdateSubscribeAck:
        context.emit(SignalEvent.UpdateSubscribeAck, data);
        break;
      default:
        utils.Logger.warn('为解析信令', data);
      }
    };

    let UpEvents = {
      connect: () => {
        context.emit(SignalEvent.Connect);
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
      onclose: function () {
      },
      onerror: function (event) {
        let data = null;
        context.emit(EventName.ConnectAck, data, event.data);
      },
      onmessage: function (event) {
        let data = JSON.parse(event.data);
        downEventHandler(data);
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