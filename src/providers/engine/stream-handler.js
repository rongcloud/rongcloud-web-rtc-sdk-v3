import { UpEvent, DownEvent } from '../../event-name';
import utils from '../../utils';
import { request } from './request';
import PeerConnection from './peerconnection';
import { Path } from './path';
import { im } from './im';
import Message from './im';

let StreamCache = utils.Cache();
let pc = new PeerConnection();
function StreamHandler() {
  im.on(DownEvent.STREAM_READIY, () => {
  });
  im.on(DownEvent.STREAM_UNPUBLISH, () => {
    // TODO: 清理本地缓存
  });
  im.on(DownEvent.STREAM_CHANGED, () => {
    // TODO: 清理本地缓存
  });
  let publish = (user) => {
    let { stream: { type, mediaStream, tag } } = user;
    let desc = pc.addStream(user);
    pc.setOffer(desc);
    return request.post({
      path: Path.PUBLISH,
      body: {
        desc
      }
    }).then(result => {
      let { url } = result;
      tag = tag || '';
      let { id: streamId } = mediaStream;
      return im.sendMessage({
        type: Message.PUBLISH,
        content: {
          url,
          type,
          tag,
          streamId
        }
      });
    });
  };
  let unpublish = (user) => {
    let { stream: { type, mediaStream, tag } } = user;
    let desc = pc.removeStream(user);
    pc.setOffer(desc);
    return request.post({
      path: Path.UNPUBLISH,
      body: {
        desc
      }
    }).then(() => {
      tag = tag || '';
      let { id: streamId } = mediaStream;
      return im.sendMessage({
        type: Message.UNPUBLISH,
        content: {
          type,
          tag,
          streamId
        }
      });
    });
  };
  let open = (user) => {
    let streamId = pc.getStreamId(user);
    return request.post({
      path: Path.OPEN,
      body: {
        streamId
      }
    }).then(stream => {
      StreamCache.set(streamId, stream);
      return stream;
    });
  };
  let close = (user) => {
    let streamId = pc.getStreamId(user);
    return request.post({
      path: Path.OPEN,
      body: {
        streamId
      }
    });
  };
  let resize = (user) => {
    let { stream: { size } } = user;
    let streamId = pc.getStreamId(user);
    return request.post({
      path: Path.RESIZE,
      body: {
        streamId,
        size
      }
    });
  };
  let get = (user) => {
    return utils.deferred((resolve) => {
      let streamId = pc.getStreamId(user);
      resolve(StreamCache.get(streamId));
    });
  };
  let dispatch = (event, args) => {
    switch (event) {
      case UpEvent.STREAM_PUBLISH:
        return publish(...args);
      case UpEvent.STREAM_UNPUBLISH:
        return unpublish(...args);
      case UpEvent.STREAM_OPEN:
        return open(...args);
      case UpEvent.STREAM_CLOSE:
        return close(...args);
      case UpEvent.STREAM_RESIZE:
        return resize(...args);
      case UpEvent.STREAM_GET:
        return get(...args);
      default:
        utils.Logger.log(`StreamHandler: unkown upevent ${event}`);
    }
  };
  return {
    dispatch
  };
}
export default StreamHandler();  