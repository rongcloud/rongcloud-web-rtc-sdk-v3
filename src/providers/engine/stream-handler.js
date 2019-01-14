import { UpEvent, DownEvent } from '../../event-name';
import utils from '../../utils';
import { request } from './request';
import PeerConnection from './peerconnection';
import { Path } from './path';
import Message from './im';
import { CommonEvent, CommandEvent } from './events';
import EventEmitter from '../../event-emitter';
import { StreamType } from '../../enum';
import { ErrorType } from '../../error';
function StreamHandler(im) {
  let DataCache = utils.Cache();
  let DataCacheName = {
    USERS: 'room_users',
    // 全部通知后一次性交换 SDP
    IS_NOTIFY_READY: 'is_notify_ready',
    // 已发布资源列表
    PUBLISH_MAP: 'publish_map',
  };
  /* 
    缓存已订阅 MediaStream
    userId_type: mediaStream
  */
  let StreamCache = utils.Cache();
  /* 
    缓存订阅关系，每次修改需同步全量数据
    userId: [{ streamId: '', uri: '', type: 1, tag: ''}]
  */
  let SubscribeCache = utils.Cache();
  let pc = new PeerConnection();
  let eventEmitter = new EventEmitter();
  let isPublished = () => {
    let publishList = DataCache.get(DataCacheName.PUBLISH_MAP) || {};
    return !utils.isEmpty(publishList);
  };
  let getSubs = () => {
    let subs = [];
    let userIds = SubscribeCache.getKeys();
    utils.forEach(userIds, (userId) => {
      let streams = SubscribeCache.get(userId);
      utils.forEach(streams, (stream) => {
        subs.push(stream);
      });
    });
    return subs;
  };
  eventEmitter.on(CommandEvent.EXCHANGE, () => {
    let isNotifyReady = DataCache.get(DataCacheName.IS_NOTIFY_READY);
    if (isPublished() && isNotifyReady) {
      let subs = getSubs();
      let offer = pc.getOffer();
      let token = im.getToken();
      request.post({
        path: Path.SUBSCRIBE,
        body: {
          token,
          sdp: offer,
          subcribeList: subs
        }
      });
    }
  });
  let getUId = (user, tpl) => {
    tpl = tpl || '{userId}_{tag}_{type}';
    let { id: userId, stream: { tag, type } } = user
    return utils.tplEngine(tpl, {
      userId,
      tag,
      type
    });
  };
  let setPublish = (user) => {
    /* 
      publishMap = {
        userId_tag: {
          type,
          mediaStream
        }
      }
    */
    let publishMap = DataCache.get(DataCacheName.PUBLISH_MAP) || {};
    let { stream: { type, mediaStream } } = user;
    let key = getUId(user, '{userId}_{tag}');
    publishMap[key] = {
      type,
      mediaStream
    };
    DataCache.set(DataCacheName.PUBLISH_MAP, publishMap);
    eventEmitter.emit(CommandEvent.EXCHANGE, user);
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
  im.on(DownEvent.STREAM_READIY, (error, user) => {
    if (error) {
      throw error;
    }
    dispatchStreamEvent(user, (key, uri) => {
      DataCache.set(key, uri);
    });
  });
  im.on(DownEvent.STREAM_UNPUBLISH, (error, user) => {
    if (error) {
      throw error;
    }
    dispatchStreamEvent(user, (key) => {
      DataCache.remove(key);
    });
  });
  im.on(DownEvent.STREAM_CHANGED, (error, user) => {
    if (error) {
      throw error;
    }
    dispatchStreamEvent(user, (key, uri) => {
      DataCache.set(key, uri);
    });
  });
  /* 加入房间成功后，主动获取已发布资源的人员列表，通知应用层 */
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
        DataCache.set(DataCacheName.IS_NOTIFY_READY, true);
        // Stream Ready 派发完毕后，检查是否可进行 SDP 交换
        eventEmitter.emit(CommandEvent.EXCHANGE);
      });
    });
  });
  let getBody = () => {
    let token = im.getToken();
    let offer = pc.getOffer();
    let subs = getSubs();
    return {
      token,
      sdp: offer,
      subscribeList: subs
    };
  };
  let publish = (user) => {
    let { stream: { type, mediaStream, tag } } = user;
    let desc = pc.addStream(user);
    pc.setOffer(desc);
    let body = getBody();
    utils.extend(body, {
      subscribeList: []
    });
    return request.post({
      path: Path.PUBLISH,
      body
    }).then(result => {
      setPublish(user);
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
    let body = getBody();
    return request.post({
      path: Path.UNPUBLISH,
      body
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
    let { id: userId, stream: { tag, type } } = user;
    let subs = SubscribeCache.get(userId) || [];
    let key = getUId(user);
    let uri = DataCache.get(key);
    subs.push({
      uri,
      type,
      tag
    });
    SubscribeCache.set(key, subs);
    let isNotifyReady = DataCache.get(DataCacheName.IS_NOTIFY_READY);
    // 没有发布资源或者已存在成员未分发完毕，只添加缓存，最后一次性处理
    if (!isPublished() || !isNotifyReady) {
      return utils.Defer.resolve();
    }
    let body = getBody();
    return request.post({
      path: Path.OPEN,
      body
    });
  };
  let close = (user) => {
    let key = getUId(user);
    SubscribeCache.remove(key);
    let body = getBody();
    return request.post({
      path: Path.OPEN,
      body
    });
  };
  let resize = (user) => {
    let { stream: { size }, id } = user;
    let body = getBody();
    let streams = SubscribeCache.get(id);
    let streamId = pc.getStreamId(user);
    let stream = utils.filter(streams, (stream) => {
      let isVideo = stream.type === StreamType.VIDEO;
      return streamId === stream.streamId && isVideo;
    })[0];
    if (!stream) {
      return utils.Defer.reject(ErrorType.Inner.STREAM_NOT_EXIST);
    }
    let { uri } = stream;
    utils.forEach(body.subscribeList, (stream) => {
      if (stream.uri === uri) {
        utils.extend(stream, {
          simulcast: size
        })
      }
    });
    return request.post({
      path: Path.RESIZE,
      body
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
export default StreamHandler;  