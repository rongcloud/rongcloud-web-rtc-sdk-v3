import { UpEvent, DownEvent } from '../../event-name';
import utils from '../../utils';
import { request } from './request';
import PeerConnection from './peerconnection';
import { Path } from './path';
import Message, { im } from './im';
import { CommonEvent } from './events';

let DataCache = utils.Cache();
let DataCacheName = {
  USERS: 'room_users'
};
/* 
  缓存已订阅 MediaStream
  userId_type: mediaStream
*/
let StreamCache = utils.Cache();
/* 
  缓存订阅关系，每次修改需同步全量数据
  userId: [{ streamId: '', uri: '', type: 1}]
*/
let SubscribeCache = utils.Cache();
let pc = new PeerConnection();
function StreamHandler() {
  let getUId = (user) => {
    let tpl = '{userId}_{tag}_{type}';
    let { id: userId, stream: { tag, type } } = user
    return utils.tplEngine(tpl, {
      userId,
      tag,
      type
    });
  };
  let dispatchStreamEvent = (user, callback) => {
    let { id, uris } = user;
    utils.forEach(uris, (item) => {
      let { tag, type, uri } = item;
      let key = getUId({ id, stream: { tag, type } });
      callback(key, uri);
    });
  };
  /* 已在房间，再有新人发布资源触发此事件 */
  im.on(DownEvent.STREAM_READIY, (user) => {
    dispatchStreamEvent(user, (key, uri) => {
      DataCache.set(key, uri);
    });
  });
  im.on(DownEvent.STREAM_UNPUBLISH, (user) => {
    dispatchStreamEvent(user, (key) => {
      DataCache.remove(key);
    });
  });
  im.on(DownEvent.STREAM_CHANGED, (user) => {
    dispatchStreamEvent(user, (key, uri) => {
      DataCache.set(key, uri);
    });
  });
  im.on(CommonEvent.JOINED, (error, room) => {
    if (error) {
      throw error;
    }
    im.getUsers(room).then((users) => {
      DataCache.set(DataCacheName.USERS, users);
      utils.forEach(users, (data, id) => {
        let { uris } = data;
        uris = JSON.parse(uris);
        utils.forEach(uris, (item) => {
          let { type, tag, uri } = item;
          let key = getUId({
            id,
            stream: {
              type,
              tag
            }
          });
          DataCache.set(key, uri);
        });
        let streams = utils.uniq(uris, (target) => {
          let { streamId, tag } = target;
          return {
            key: [streamId, tag].join('_'),
            value: {
              tag
            }
          }
        });
        utils.forEach(streams, (stream) => {
          let { tag } = stream;
          im.emit(DownEvent.STREAM_READIY, {
            id,
            tag
          });
        });
      });
    });
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
    }).then(() => {
      let { id: userId, stream: { tag, type } } = user;
      let subs = SubscribeCache.get(userId) || [];
      let key = getUId(user);
      let uri = DataCache.get(key);
      subs.push({
        streamId,
        uri,
        type,
        tag
      });
      SubscribeCache.set(key, subs);
    });
  };
  let close = (user) => {
    let streamId = pc.getStreamId(user);
    return request.post({
      path: Path.OPEN,
      body: {
        streamId
      }
    }).then(() => {
      let key = getUId(user);
      SubscribeCache.remove(key);
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

  let mute = () => {

  }
  let unmute = () => {

  };
  let disable = () => {

  };
  let enable = () => {

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
      case UpEvent.AUDIO_MUTE:
        return mute(...args);
      case UpEvent.AUDIO_UNMUTE:
        return unmute(...args);
      case UpEvent.VIDEO_DISABLE:
        return disable(...args);
      case UpEvent.VIDEO_ENABLE:
        return enable(...args);
      default:
        utils.Logger.log(`StreamHandler: unkown upevent ${event}`);
    }
  };
  return {
    dispatch
  };
}
export default StreamHandler();  