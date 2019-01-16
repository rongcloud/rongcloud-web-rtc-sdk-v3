import utils from '../../utils';
import EventEmitter from '../../event-emitter';
import { PeerConnectionEvent } from './events';

export default class PeerConnection extends EventEmitter {
  constructor() {
    super();
    let context = this;
    let pc = new RTCPeerConnection();
    let events = {
      onaddstream: function (event) {
        let { stream } = event;
        context.emit(PeerConnectionEvent.ADDED, stream);
      },
      onremovestream: function () {
        let { stream } = event;
        context.emit(PeerConnectionEvent.REMOVED, stream);
      },
      ondatachannel: function (event) {
        //TODO: 具体返回参数
        context.emit(PeerConnectionEvent.RECEIVED, event);
      }
    };
    utils.forEach(events, (event, name) => {
      pc[name] = event;
    });
    utils.extend(context, {
      pc
    });
  }

  addStream(user) {
    let context = this;
    let { pc } = context;
    let { stream: { mediaStream } } = user;
    pc.addStream(mediaStream);
    return context.createOffer(user);
  }

  removeStream(user) {
    let context = this;
    let { pc } = context;
    let { stream: { mediaStream } } = user;
    pc.removeStream(mediaStream);
    return context.createOffer(user);
  }

  setOffer(desc) {
    let context = this;
    let { pc } = context;
    return pc.setLocalDescription(desc);
  }

  setAnwser(sdp) {
    let context = this;
    let { pc } = context;
    return pc.setRemoteDescription(new RTCSessionDescription(sdp));
  }

  close() {
    let context = this;
    let { pc } = context;
    pc.close();
  }

  createOffer(user) {
    let context = this;
    let { pc } = context;
    let { stream: { mediaStream } } = user;
    return pc.createOffer().then(desc => {
      if(mediaStream){
        let newStreamId = context.getStreamId(user);
        let { id: streamId } = mediaStream;
        let { sdp } = desc;
        sdp = context.renameStream(sdp, {
          name: streamId, 
          newName: newStreamId
        });
        utils.extend(desc, {
          sdp
        });
      }
      utils.extend(context, {
        desc
      });
      return desc;
    });
  }

  getOffer(callback){
    let { desc, pc } = this;
    if(desc){
      return callback(desc);
    }
    pc.createOffer().then(desc => {
      callback(desc);
    });
  }

  renameStream(sdp, data) {
    let { name, newName } = data;
    return sdp.replace(new RegExp(name, 'g'), newName);
  }

  getStreamId(user) {
    let tpl = '{userId}_{tag}';
    let { id: userId, stream: { tag } } = user;
    return utils.tplEngine(tpl, {
      userId,
      tag
    });
  }
}