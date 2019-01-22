import { UpEvent, DownEvent } from '../../event-name';
import utils from '../../utils';
import { request } from './request';
import PeerConnection from './peerconnection';
import { Path } from './path';
import Message from './im';
import { CommonEvent, CommandEvent, PeerConnectionEvent } from './events';
import EventEmitter from '../../event-emitter';
import { StreamType } from '../../enum';
import { ErrorType } from '../../error';

const TrackState = {
  ENABLE: 1,
  DISBALE: 2
};
function StreamHandler(im) {
  let DataCache = utils.Cache();
  let DataCacheName = {
    USERS: 'room_users',
    // 全部通知后一次性交换 SDP
    IS_NOTIFY_READY: 'is_notify_ready'
  };
  let SubPromiseCache = utils.Cache();
  let PubResourceCache = utils.Cache();
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
  let getSubPromiseUId = (user) => {
    let { id, stream: { tag, type } } = user;
    let tpl = '{id}_{tag}_{type}';
    return utils.tplEngine(tpl, {
      id,
      tag,
      type
    });
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
  let getUris = (publishList) => {
    return utils.map(publishList, (stream) => {
      let { msid } = stream;
      let [, tag] = msid.split('_');
      utils.extend(stream, {
        tag,
        state: TrackState.ENABLE
      });
      return stream;
    });
  };
  let exchangeHandler = (result, user, type) => {
    let { publishList, sdp } = result;
    let uris = getUris(publishList);
    PubResourceCache.set(user.id, uris);
    pc.setAnwser(sdp);
    switch (type) {
      case Message.PUBLISH:
      case Message.UNPUBLISH:
        im.sendMessage({
          type,
          content: {
            uris
          }
        });
        break;
    }
    return utils.Defer.resolve();
  };
  eventEmitter.on(CommandEvent.EXCHANGE, () => {
    let isNotifyReady = DataCache.get(DataCacheName.IS_NOTIFY_READY);
    if (isNotifyReady) {
      pc.getOffer(offer => {
        pc.setOffer(offer);
        let subs = getSubs();
        let token = im.getToken();
        let roomId = im.getRoomId();
        let url = utils.tplEngine(Path.SUBSCRIBE, {
          roomId
        });
        request.post({
          path: url,
          body: {
            token,
            sdp: offer,
            subcribeList: subs
          }
        }).then(result => {
          let user = im.getUser();
          exchangeHandler(result, user);
        });
      });
    }
  });
  let getStreamUser = (stream) => {
    let { id } = stream, type = StreamType.NODE;
    let [userId, tag] = id.split('_');
    let videoTracks = stream.getVideoTracks();
    let audioTrakcks = stream.getAudioTracks();
    let isEmtpyVideo = utils.isEmpty(videoTracks);
    let isEmptyAudio = utils.isEmpty(audioTrakcks)
    if (isEmtpyVideo) {
      type = StreamType.AUDIO;
    }
    if (isEmptyAudio) {
      type = StreamType.VIDEO;
    }
    if (!isEmptyAudio && !isEmtpyVideo) {
      type = StreamType.AUDIO_AND_VIDEO;
    }
    return {
      id: userId,
      stream: {
        tag,
        type,
        mediaStream: stream
      }
    }
  };
  pc.on(PeerConnectionEvent.ADDED, (error, stream) => {
    if (error) {
      throw error;
    }
    let { id } = stream;
    StreamCache.set(id, stream);
    let user = getStreamUser(stream);
    let uid = getSubPromiseUId(user);
    let promise = SubPromiseCache.get(uid);
    promise.resolve(user);
  });
  pc.on(PeerConnectionEvent.REMOVED, (error, stream) => {
    if (error) {
      throw error;
    }
    let { id } = stream;
    StreamCache.remove(id);
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
  let dispatchStreamEvent = (user, callback) => {
    let { id, stream: { uris } } = user;
    utils.forEach(uris, (item) => {
      let { tag, mediaType: type, uri } = item;
      let key = getUId({ id, stream: { tag, type } });
      callback(key, uri);
    });
  };
  /* 已在房间，再有新人发布资源触发此事件 */
  im.on(DownEvent.STREAM_PUBLISHED, (error, user) => {
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
      if (utils.isEmpty(users)) {
        DataCache.set(DataCacheName.IS_NOTIFY_READY, true);
      }
      utils.forEach(users, (data, id) => {
        let { uris } = data;
        uris = JSON.parse(uris);
        utils.forEach(uris, (item) => {
          let { mediaType: type, tag, uri } = item;
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
          im.emit(DownEvent.STREAM_PUBLISHED, {
            id,
            stream: {
              tag,
              uris
            }
          });
        });
        DataCache.set(DataCacheName.IS_NOTIFY_READY, true);
        // Stream Ready 派发完毕后，检查是否可进行 SDP 交换
        eventEmitter.emit(CommandEvent.EXCHANGE);
      });
    });
  });
  let getBody = () => {
    return utils.deferred(resolve => {
      pc.getOffer((offer) => {
        let token = im.getToken();
        let subs = getSubs();
        resolve({
          token,
          sdp: offer,
          subscribeList: subs
        });
      });
    });
  };
  let isCurrentUser = (user) => {
    let { id } = im.getUser();
    return utils.isEqual(user.id, id);
  };
  let User = {
    set: (key, data) => {
      let { publishList } = data;
      let uris = getUris(publishList);
      return im.setUserInfo(key, uris).then(() => {
        return data;
      });
    },
    SET_USERINFO: 'uris'
  };
  let publish = (user) => {
    return pc.addStream(user).then(desc => {
      pc.setOffer(desc);
      return getBody().then(body => {
        let roomId = im.getRoomId();
        let url = utils.tplEngine(Path.SUBSCRIBE, {
          roomId
        });
        return request.post({
          path: url,
          body
        }).then(result => {
          return User.set(User.SET_USERINFO, result);
        }).then(result => {
          return exchangeHandler(result, user, Message.PUBLISH);
        });
      });
    });
  };
  let unpublish = (user) => {
    return pc.removeStream(user).then(desc => {
      pc.setOffer(desc);
      return getBody().then(body => {
        let roomId = im.getRoomId();
        let url = utils.tplEngine(Path.UNPUBLISH, {
          roomId
        });
        return request.post({
          path: url,
          body
        }).then((result) => {
          return User.set(User.SET_USERINFO, result);
        }).then(result => {
          return exchangeHandler(result, user, Message.UNPUBLISH);
        });
      });
    });
  };
  let subscribe = (user) => {
    let { id: userId, stream: { tag, type } } = user;
    let subs = SubscribeCache.get(userId) || [];
    let types = [StreamType.VIDEO, StreamType.AUDIO];
    if (!utils.isEqual(type, StreamType.AUDIO_AND_VIDEO)) {
      types = [type];
    }
    utils.forEach(types, (type) => {
      let tUser = {
        id: userId,
        stream: {
          tag,
          type
        }
      };
      let key = getUId(tUser);
      let uri = DataCache.get(key);
      let isAdd = true;
      utils.forEach(subs, (sub) => {
        let {uri: existUri, type: existType, tag: existTag} = sub;
        let isExist = utils.isEqual(uri, existUri) && utils.isEqual(type, existType) && utils.isEqual(tag, existTag);
        if(isExist){
          isAdd = false;
        }
      });
      if (isAdd) {
        subs.push({
          uri,
          type,
          tag
        });
      }
    });
    SubscribeCache.set(userId, subs);
    return utils.deferred((resolve, reject) => {
      let isNotifyReady = DataCache.get(DataCacheName.IS_NOTIFY_READY);
      // 首次加入分发未完成，只添加缓存，最后，一次性处理
      if (isNotifyReady) {
        getBody().then(body => {
          pc.setOffer(body.sdp);
          let roomId = im.getRoomId();
          let url = utils.tplEngine(Path.SUBSCRIBE, {
            roomId
          });
          request.post({
            path: url,
            body
          }).then(result => {
            let { sdp } = result;
            pc.setAnwser(sdp);
          });
        });
      }
      let uid = getSubPromiseUId(user);
      SubPromiseCache.set(uid, {
        resolve,
        reject
      });
    });
  };
  let unsubscribe = (user) => {
    let key = getUId(user);
    SubscribeCache.remove(key);
    return getBody().then(body => {
      let roomId = im.getRoomId();
      let url = utils.tplEngine(Path.UNSUBSCRIBE, {
        roomId
      });
      return request.post({
        path: url,
        body
      });
    });
  };
  let resize = (user) => {
    let { stream: { size }, id } = user;
    return getBody().then(body => {
      let streams = SubscribeCache.get(id);
      let streamId = pc.getStreamId(user);
      let stream = utils.filter(streams, (stream) => {
        let isVideo = utils.isEqual(stream.type, StreamType.VIDEO);
        return utils.isEqual(streamId, stream.streamId) && isVideo;
      })[0];
      if (!stream) {
        return utils.Defer.reject(ErrorType.Inner.STREAM_NOT_EXIST);
      }
      let { uri } = stream;
      utils.forEach(body.subscribeList, (stream) => {
        if (utils.isEqual(stream.uri, uri)) {
          utils.extend(stream, {
            simulcast: size
          })
        }
      });
      let roomId = im.getRoomId();
      let url = utils.tplEngine(Path.RESIZE, {
        roomId
      });
      return request.post({
        path: url,
        body
      });
    });
  };
  let get = (user) => {
    return utils.deferred(resolve => {
      let streamId = pc.getStreamId(user);
      resolve(StreamCache.get(streamId));
    });
  };
  let trackHandler = (user, type, isEnable) => {
    let streamId = pc.getStreamId(user);
    let stream = StreamCache.get(streamId);
    if (stream) {
      type = utils.isEqual(type, StreamType.AUDIO) ? 'Audio' : 'Video';
      let tpl = 'get{type}Tracks';
      type = utils.tplEngine(tpl, {
        type
      });
      let tracks = stream[type]();
      utils.forEach(tracks, (track) => {
        track.enable = isEnable;
      });
    }
  };

  let getFitUris = (user, type, state) => {
    let streamId = pc.getStreamId(user);
    let uris = PubResourceCache.get(streamId) || [];
    let { id, stream: { tag } } = user;
    let targetId = [id, tag].join('_');
    uris = utils.filter(uris, (stream) => {
      let { streamId, mediaType } = stream;
      let isSameStream = utils.isEqual(targetId, streamId),
        isSameType = utils.isEqual(mediaType, type);
      let isFit = !isSameStream && !isSameType;
      // state 默认为 TrackState.ENABLE，为 DISABLE 未发布资源
      if (isFit) {
        utils.extend(stream, {
          state
        });
      }
      return isFit;
    });
    return uris;
  };
  let sendModify = (user, type, state) => {
    let uris = getFitUris(user, type, state);
    // uris 为空表示没有发布资源，不需要修改
    if (!utils.isEmpty(uris)) {
      im.sendMessage({
        type: Message.MODIFY,
        content: {
          uris
        }
      });
    }
    return utils.Defer.resolve();
  };
  let modifyTrack = (user, type, state) => {
    let isEnable = utils.isEqual(state, TrackState.ENABLE);
    trackHandler(user, type, isEnable);
    if (isCurrentUser(user)) {
      sendModify(user, type, state);
    }
    return utils.Defer.resolve();
  };
  let mute = (user) => {
    return modifyTrack(user, StreamType.AUDIO, TrackState.DISBALE);
  }
  let unmute = (user) => {
    return modifyTrack(user, StreamType.AUDIO, TrackState.ENABLE);
  };
  let disable = (user) => {
    return modifyTrack(user, StreamType.VIDEO, TrackState.DISBALE);
  };
  let enable = (user) => {
    return modifyTrack(user, StreamType.VIDEO, TrackState.ENABLE);
  };
  let dispatch = (event, args) => {
    switch (event) {
      case UpEvent.STREAM_PUBLISH:
        return publish(...args);
      case UpEvent.STREAM_UNPUBLISH:
        return unpublish(...args);
      case UpEvent.STREAM_SUBSCRIBE:
        return subscribe(...args);
      case UpEvent.STREAM_UNSUBSCRIBE:
        return unsubscribe(...args);
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