import EventEmitter from '../../../../event-emitter';
import utils from '../../../../utils';
import { PeerConnectionEvent } from '../events';

function RongPeerConnection() {
  let peerConnection = null;
  let eventEmitter = new EventEmitter();
  let getPeer = () => {
    if (!peerConnection) {
      peerConnection = new RTCPeerConnection();
    }
    let events = {
      onaddstream: (event) => {
        eventEmitter.emit(PeerConnectionEvent.ADDED, event);
      },
      onremovestream: (event) => {
        eventEmitter.emit(PeerConnectionEvent.REMOVED, event);
      },
      oniceconnectionstatechange: (event) => {
        eventEmitter.emit(PeerConnectionEvent.ICE_STATE_CHANGE, event);
      }
    };
    utils.forEach(events, (event, name) => {
      peerConnection[name] = event;
    });
    return peerConnection;
  };
  let createOffer = () => {
    return getPeer().createOffer().then(offer => {
      getPeer().setLocalDescription(offer);
      return offer;
    })
  };
  let createAnswer = (offer) => {
    return getPeer().setRemoteDescription(offer).then(() => {
      return getPeer().createAnwser().then(anwser => {
        getPeer().setLocalDescription(offer);
        return anwser;
      });
    });
  };
  let close = () => {
    if (peerConnection) {
      peerConnection.close();
    }
  };
  let on = (name, event) => {
    eventEmitter.on(name, event);
  };
  return {
    createOffer,
    createAnswer,
    close,
    on
  };
}
export default RongPeerConnection();
