import { UpEvent, DownEvent } from '../../event-name';
import utils from '../../utils';
import { request } from './request';
import PeerConnection from './peerconnection';
import { Path } from './path';
import Message from './im';
import { CommonEvent, PeerConnectionEvent } from './events';
import EventEmitter from '../../event-emitter';
import { StreamType, StreamState, LogTag } from '../../enum';
import { ErrorType } from '../../error';
import Logger from '../../logger';
import Network from '../../network';

function StreamHandler(im, option) {
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
  let subCache = utils.Cache();
  let prosumer = new utils.Prosumer();
  let SubscribeCache = {
    get: (userId) => {
      return subCache.get(userId);
    },
    set: (userId, subs) => {
      return subCache.set(userId, subs);
    },
    getKeys: () => {
      return subCache.getKeys();
    },
    remove: (userId, tag, type) => {
      let subs = subCache.get(userId);
      type = type || StreamType.AUDIO_AND_VIDEO;
      subs = utils.filter(subs, ({ tag: mediaTag, mediaType }) => {
        return !utils.isEqual(mediaTag, tag) && utils.isEqual(mediaType, type)
      });
      subCache.set(userId, subs);
    }
  };
  let pc = null;
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
  let negotiate = (response) => {
    pc.getOffer(offer => {
      pc.setOffer(offer);
      let { sdp } = response;
      pc.setAnwser(sdp);
    });
  }
  let republish = () => {
    let roomId = im.getRoomId();
    getBody().then(body => {
      let url = utils.tplEngine(Path.SUBSCRIBE, {
        roomId
      });
      Logger.log(LogTag.STREAM_HANDLER, {
        msg: 'publish:reconnect:request',
        roomId,
        body
      });
      return request.post({
        path: url,
        body
      }).then(response => {
        Logger.log(LogTag.STREAM_HANDLER, {
          msg: 'publish:reconnect:response',
          roomId,
          response
        });
        //TODO: 重新设置数据
        negotiate(response);
      }, error => {
        Logger.log(LogTag.STREAM_HANDLER, {
          msg: 'publish:reconnect:response',
          roomId,
          error
        });
        return error;
      })
    });
  };
  let getUris = (publishList) => {
    return utils.map(publishList, (stream) => {
      let { msid } = stream;
      let [, tag] = msid.split('_');
      utils.extend(stream, {
        tag,
        state: StreamState.ENABLE
      });
      return stream;
    });
  };
  let { detect } = option;
  let network = new Network(detect);
  let exchangeHandler = (result, user, type) => {
    let { publishList, sdp } = result;
    pc.setAnwser(sdp);
    let uris = getUris(publishList);
    switch (type) {
      case Message.PUBLISH:
        im.sendMessage({
          type,
          content: {
            uris
          }
        });
        break;
      case Message.UNPUBLISH:
        {
          let { id: userId } = user;
          let publishUris = PubResourceCache.get(userId);
          let streamId = pc.getStreamId(user);
          let unpublishUris = utils.filter(publishUris, (stream) => {
            let { msid } = stream;
            return utils.isEqual(msid, streamId);
          });
          im.sendMessage({
            type,
            content: {
              uris: unpublishUris
            }
          });
        }
        break;
    }
    PubResourceCache.set(user.id, uris);
    return utils.Defer.resolve();
  };
  eventEmitter.on(CommonEvent.CONSUME, () => {
    let user = im.getUser();
    let roomId = im.getRoomId();
    prosumer.consume(({ sdp, body }, next) => {
      Logger.log(LogTag.STREAM_HANDLER, {
        msg: 'subscribe:request',
        roomId,
        body
      });
      pc.setOffer(sdp);
      request.post(body).then(response => {
        let { sdp } = response;
        pc.setAnwser(sdp);
        Logger.log(LogTag.STREAM_HANDLER, {
          msg: 'subscribe:response',
          roomId,
          user,
          response
        });
        next();
      });
    });
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
  im.on(DownEvent.STREAM_UNPUBLISHED, (error, user) => {
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
  im.on(CommonEvent.LEFT, (error) => {
    if (error) {
      throw error;
    }
    let streamIds = StreamCache.getKeys();
    utils.forEach(streamIds, (streamId) => {
      let stream = StreamCache.get(streamId);
      let tracks = stream.getTracks();
      utils.forEach(tracks, (track) => {
        track.stop();
      });
    });
    pc.close();
  });
  /* 加入房间成功后，主动获取已发布资源的人员列表，通知应用层 */
  im.on(CommonEvent.JOINED, (error, room) => {
    if (error) {
      throw error;
    }
    pc = new PeerConnection();
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
    pc.on(PeerConnectionEvent.CHANGED, () => {
      if (error) {
        throw error;
      }
      if (pc.isNegotiate()) {
        network.detect((isOnline) => {
          if (isOnline) {
            republish();
          }
        });
      }
    });
    im.getUsers(room).then((users) => {
      DataCache.set(DataCacheName.USERS, users);
      if (utils.isEmpty(users)) {
        DataCache.set(DataCacheName.IS_NOTIFY_READY, true);
      }
      let { id: currentUserId } = im.getUser();
      utils.forEach(users, (data, id) => {
        if (utils.isEqual(currentUserId, id)) {
          return;
        }
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
          setTimeout(() => {
            im.emit(DownEvent.STREAM_PUBLISHED, {
              id,
              stream: {
                tag,
                uris
              }
            });
          });
        });
      });
      DataCache.set(DataCacheName.IS_NOTIFY_READY, true);
    });
  });
  im.on(CommonEvent.LEFT, () => {
    if (pc) {
      pc.close();
    }
  });
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
    let { stream: streams } = user;
    if (!utils.isArray(streams)) {
      streams = [streams];
    }
    utils.forEach(streams, ({ mediaStream }) => {
      let streamId = pc.getStreamId(user);
      StreamCache.set(streamId, mediaStream);
    });
    let roomId = im.getRoomId();
    Logger.log(LogTag.STREAM_HANDLER, {
      msg: 'publish:start',
      roomId,
      user
    });
    return pc.addStream(user).then(desc => {
      pc.setOffer(desc);
      return getBody().then(body => {
        let url = utils.tplEngine(Path.SUBSCRIBE, {
          roomId
        });
        Logger.log(LogTag.STREAM_HANDLER, {
          msg: 'publish:request',
          roomId,
          user,
          body
        });
        return request.post({
          path: url,
          body
        }).then(response => {
          Logger.log(LogTag.STREAM_HANDLER, {
            msg: 'publish:response',
            roomId,
            user,
            response
          });
          return User.set(User.SET_USERINFO, response);
        }, error => {
          Logger.log(LogTag.STREAM_HANDLER, {
            msg: 'publish:response',
            roomId,
            user,
            error
          });
          return error;
        }).then(result => {
          return exchangeHandler(result, user, Message.PUBLISH);
        });
      });
    });
  };
  let unpublish = (user) => {
    let streamId = pc.getStreamId(user);
    let mediaStream = StreamCache.get(streamId);
    if (!mediaStream) {
      return utils.Defer.reject(ErrorType.Inner.STREAM_NOT_EXIST);
    }
    utils.extend(user.stream, {
      mediaStream
    });
    let roomId = im.getRoomId();
    Logger.log(LogTag.STREAM_HANDLER, {
      msg: 'unpublish:start',
      roomId,
      user
    });
    let tracks = mediaStream.getTracks();
    utils.forEach(tracks, (track) => {
      track.stop();
    });
    return pc.removeStream(user).then(desc => {
      pc.setOffer(desc);
      return getBody().then(body => {
        let url = utils.tplEngine(Path.UNPUBLISH, {
          roomId
        });
        Logger.log(LogTag.STREAM_HANDLER, {
          msg: 'unpublish:request',
          roomId,
          user,
          body
        });
        return request.post({
          path: url,
          body
        }).then((response) => {
          Logger.log(LogTag.STREAM_HANDLER, {
            msg: 'unpublish:response',
            roomId,
            user,
            response
          });
          StreamCache.remove(streamId);
          return User.set(User.SET_USERINFO, response);
        }, error => {
          Logger.log(LogTag.STREAM_HANDLER, {
            msg: 'unpublish:response',
            roomId,
            user,
            error
          });
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
        let { type: existType, tag: existTag } = sub;
        let isExist = utils.isEqual(type, existType) && utils.isEqual(tag, existTag);
        if (isExist) {
          isAdd = false;
        }
      });
      let msid = pc.getStreamId(user);
      if (isAdd && !utils.isUndefined(uri)) {
        subs.push({
          msid,
          uri,
          type,
          tag
        });
      }
    });
    SubscribeCache.set(userId, subs);
    let roomId = im.getRoomId();
    Logger.log(LogTag.STREAM_HANDLER, {
      msg: 'subscribe:start',
      roomId,
      user
    });
    return utils.deferred((resolve, reject) => {
      let isNotifyReady = DataCache.get(DataCacheName.IS_NOTIFY_READY);
      // 首次加入分发未完成，只添加缓存，最后，一次性处理
      if (isNotifyReady) {
        getBody().then(body => {
          let { sdp } = body;
          let url = utils.tplEngine(Path.SUBSCRIBE, {
            roomId
          });
          body = {
            path: url,
            body
          };
          prosumer.produce({
            sdp,
            body
          });
          eventEmitter.emit(CommonEvent.CONSUME);
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
    let { id, stream: { type, tag } } = user;
    SubscribeCache.remove(id, tag, type);
    let roomId = im.getRoomId();
    Logger.log(LogTag.STREAM_HANDLER, {
      msg: 'unsubscribe:start',
      roomId,
      user
    });
    return getBody().then(body => {
      let url = utils.tplEngine(Path.UNSUBSCRIBE, {
        roomId
      });
      Logger.log(LogTag.STREAM_HANDLER, {
        msg: 'unsubscribe:request',
        roomId,
        user,
        body
      });
      return request.post({
        path: url,
        body
      }).then(response => {
        Logger.log(LogTag.STREAM_HANDLER, {
          msg: 'unsubscribe:response',
          roomId,
          user,
          response
        });
        negotiate(response);
      }, error => {
        Logger.log(LogTag.STREAM_HANDLER, {
          msg: 'unsubscribe:response',
          roomId,
          user,
          error
        });
      });
    });
  };
  let resize = (user) => {
    let { stream: { size }, id } = user;
    let streams = SubscribeCache.get(id);
    if (utils.isUndefined(streams)) {
      return utils.Defer.reject(ErrorType.Inner.STREAM_NOT_EXIST);
    }
    let roomId = im.getRoomId();
    Logger.log(LogTag.STREAM_HANDLER, {
      msg: 'resize:start',
      roomId,
      user
    });
    return getBody().then(body => {
      let streamId = pc.getStreamId(user);
      let stream = utils.filter(streams, (stream) => {
        let { msid } = stream;
        return utils.isEqual(streamId, msid);
      })[0];
      if (!stream) {
        let error = ErrorType.Inner.STREAM_NOT_EXIST;
        Logger.log(LogTag.STREAM_HANDLER, {
          msg: 'resize:response',
          roomId,
          user,
          error
        });
        return utils.Defer.reject(error);
      }
      let { uri } = stream;
      utils.forEach(body.subscribeList, (stream) => {
        if (utils.isEqual(stream.uri, uri)) {
          utils.extend(stream, {
            simulcast: size
          })
        }
      });
      let url = utils.tplEngine(Path.RESIZE, {
        roomId
      });
      Logger.log(LogTag.STREAM_HANDLER, {
        msg: 'resize:request',
        roomId,
        user,
        body
      });
      return request.post({
        path: url,
        body
      }).then(response => {
        Logger.log(LogTag.STREAM_HANDLER, {
          msg: 'resize:response',
          roomId,
          user,
          response
        });
      }, error => {
        Logger.log(LogTag.STREAM_HANDLER, {
          msg: 'resize:response',
          roomId,
          user,
          error
        });
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
      let isAudio = utils.isEqual(type, StreamType.AUDIO);
      type = isAudio ? 'Audio' : 'Video';
      let tpl = 'get{type}Tracks';
      type = utils.tplEngine(tpl, {
        type
      });
      let tracks = stream[type]();
      utils.forEach(tracks, (track) => {
        track.enabled = isEnable;
      });
    }
  };

  let getFitUris = (user, type, state) => {
    let { id } = user;
    let uris = PubResourceCache.get(id) || [];
    let targetId = pc.getStreamId(user);
    uris = utils.filter(uris, (stream) => {
      let { msid, mediaType } = stream;
      let isSameStream = utils.isEqual(targetId, msid),
        isSameType = utils.isEqual(mediaType, type);
      let isFit = isSameStream && isSameType;
      // state 默认为 StreamState.ENABLE，为 DISABLE 未发布资源
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
  let modifyTrack = (user, type, state, isEnabled) => {
    trackHandler(user, type, isEnabled);
    if (isCurrentUser(user)) {
      sendModify(user, type, state);
    }
    return utils.Defer.resolve();
  };
  let mute = (user) => {
    let isEnabled = false;
    return modifyTrack(user, StreamType.AUDIO, StreamState.DISBALE, isEnabled);
  }
  let unmute = (user) => {
    let isEnabled = true;
    return modifyTrack(user, StreamType.AUDIO, StreamState.ENABLE, isEnabled);
  };
  let disable = (user) => {
    let isEnabled = false;
    return modifyTrack(user, StreamType.VIDEO, StreamState.DISBALE, isEnabled);
  };
  let enable = (user) => {
    let isEnabled = true;
    return modifyTrack(user, StreamType.VIDEO, StreamState.ENABLE, isEnabled);
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
        Logger.warn(LogTag.STREAM_HANDLER, {
          event,
          msg: 'unkown event'
        });
    }
  };
  return {
    dispatch
  };
}
export default StreamHandler;  