import utils from "../../../utils";
import EventEmitter from "../../../event-emitter";
import { CommonEvent, PeerConnectionEvent } from "../events";
import { UpEvent } from "../../../event-name";
import Logger from "../../../logger";
import { LogTag } from "../../../enum";
import PeerConnection from "../peerconnection";
import Network from "../../../network";
import { ErrorType } from "../../../error";
import { Path } from "../path";
import * as common from '../../../common';
import request from '../request';

function BroadcastHandler(im, option) {
  const { detect } = option;

  const prosumer = new utils.Prosumer(),
    eventEmitter = new EventEmitter(),
    network = new Network(detect);

  let pc = null,
    userId = null;

  let SubPromiseCache = utils.Cache(),
    SubStreamCache = utils.Cache();

  if (im.isIMReady()) {
    let user = im.getUser();
    userId = user.id;
  } else {
    userId = utils.getUUID();
  }

  const getSubPromiseUId = (room) => {
    let { liveUrl } = room;
    return liveUrl;
  };

  const createPC = () => {
    pc = new PeerConnection(option);
    im.emit(CommonEvent.PEERCONN_CREATED, pc);
    pc.on(PeerConnectionEvent.ADDED, (error, stream) => {
      if (error) {
        throw error;
      }
      // TODO 抛出、缓存
    });
    pc.on(PeerConnectionEvent.REMOVED, (error, stream) => {
      if (error) {
        throw error;
      }
      // 删除缓存
    });
    pc.on(PeerConnectionEvent.CHANGED, () => {
      if (error) {
        throw error;
      }
      if (pc.isNegotiate()) {
        network.detect((isOnline) => {
          if (isOnline) {
            // TODO 重连
          } else {
            let { Inner } = ErrorType;
            im.emit(CommonEvent.ERROR, Inner.NETWORK_UNAVAILABLE);
          }
        });
      }
    });
  };

  const closePC = () => {
    if (pc) {
      pc.close();
    }
  };

  const subscribe = (room, callback) => {
    let { liveUrl } = room;
    
    if (!pc) {
      createPC();
    }

    return utils.deferred((resolve, reject) => {
      let uid = getSubPromiseUId(room);
      SubPromiseCache.set(uid, {
        resolve,
        reject
      });
      pc.getOffer().then((offer) => {
        let url = Path.BROADCAST_SUBSCRIBE;
        let headers = common.getBroadcastHeaders(userId);
        let body = {
          sdp: {
            type: 'offer',
            sdp: offer
          },
          liveUrl: liveUrl
        };
        let option = {
          path: url,
          body,
          headers
        };
        Logger.log(LogTag.BROADCAST_HANDLER, {
          msg: 'subscribe:request',
          room,
          option
        });
        request.post(option).then(response => {
          let { sdp: answer } = response;
          pc.setOffer(offer);
          pc.setAnwser(answer);
          Logger.log(LogTag.BROADCAST_HANDLER, {
            msg: 'subscribe:response:stream:not:arrive',
            room,
            response
          });
          callback();
        }, (error) => {
          Logger.log(LogTag.BROADCAST_HANDLER, {
            msg: 'subscribe:response:error',
            room,
            error
          });
          let uid = getSubPromiseUId(room);
          let promise = SubPromiseCache.get(uid);
          !utils.isUndefined(promise) && promise.reject(error);
        });
      });
    });
  };

  const unsubscribe = (room) => {

  };

  eventEmitter.on(CommonEvent.CONSUME, () => {
    prosumer.consume(({ event, args, resolve, reject }, next) => {
      switch (event) {
        case UpEvent.BROADCAST_SUBSCRIBE:
          return subscribe(...args, () => {
            next();
          }).then((result) => {
            resolve(result);
          }).catch((error) => {
            next();
            reject(error);
          });
        case UpEvent.BROADCAST_UNSUBSCRIBE:
          return;
        default:
          Logger.warn(LogTag.BROADCAST_HANDLER, {
            event,
            msg: 'unkown event'
          });
          break;
      }
    });
  });

  const dispatch = (event, args) => {
    return utils.deferred((resolve, reject) => {
      prosumer.produce({ event, args, resolve, reject });
      eventEmitter.emit(CommonEvent.CONSUME);
    });
  };
}

export default BroadcastHandler;