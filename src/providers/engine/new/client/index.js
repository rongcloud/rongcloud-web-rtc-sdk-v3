// 分发事件
import EventEmitter from '../../../../event-emitter';
import utils from '../../../../utils';
import Socket from './socket';
import { SignalEvent, DownEventFlag } from '../events';
import { EventName } from '../../../../enum';
import RongPeerConnection from './peerconnection';
export default class Client extends EventEmitter {
  constructor(option) {
    super();
    let context = this;
    let socket;

    let sendCommand = (type, headers, data) => {
      if(!utils.isArray(data)){
        data = [data];
      }
      socket.send({
        signal: type,
        parameters: headers,
        bodys: data
      });
    };

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
        RongPeerConnection.createAnswer().then(offer => {
          sendCommand(SignalEvent.Exchange, {
            type: '',
          }, offer);
        });
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
    let upEventHandler = (name, data) => {
      switch(name){
      case SignalEvent.Connect:
        {
          let { url } = option;
          socket = new Socket(url);
          utils.forEach(events, (event, name) => {
            socket[name] = event;
          });
        }
        break;
      case SignalEvent.Join:
      case SignalEvent.Ping:
      case SignalEvent.Leave:
      case SignalEvent.Exchange:
      case SignalEvent.GetWhiteBoardList:
      case SignalEvent.CreateWhiteBoard:
      case SignalEvent.DeleteWhiteBoard:
      case SignalEvent.FlowStreamSize:
      case SignalEvent.UpdateResource:
      case SignalEvent.UpdateSubscribe:
        sendCommand(data);
        break;
      // TODO: 本地事件待处理
      default:
        utils.Logger.warn('The signal is not support: ', name);
      }
    };
    utils.forEach(SignalEvent, name => {
      let isUpEvent = !utils.isContain(name, DownEventFlag);
      if (isUpEvent) {
        context.on(name, data => {
          upEventHandler(name, data);
        });
      }
    });
  }
}