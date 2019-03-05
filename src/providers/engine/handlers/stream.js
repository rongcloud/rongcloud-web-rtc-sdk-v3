import { UpEvent, DownEvent } from '../../../event-name';
import utils from '../../../utils';
import { request } from '../request';
import PeerConnection from '../peerconnection';
import { Path } from '../path';
import Message from '../im';
import { CommonEvent, PeerConnectionEvent } from '../events';
import EventEmitter from '../../../event-emitter';
import { StreamType, StreamState, LogTag, StreamSize } from '../../../enum';
import { ErrorType } from '../../../error';
import Logger from '../../../logger';
import Network from '../../../network';

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
  let pc = null;
  let User = {
    set: (key, data, isInner, message) => {
      return im.setUserData(key, data, isInner, message);
    },
    SET_USERINFO: 'uris'
  };
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
    remove: (user) => {
      let { id: userId } = user;
      let subs = subCache.get(userId) || [];
      let streamId = pc.getStreamId(user);
      subs = utils.filter(subs, ({ msid }) => {
        return !utils.isEqual(streamId, msid)
      });
      subCache.set(userId, subs);
    },
    clear: () => {
      subCache.clear();
    }
  };
  let clear = () => {
    DataCache.clear();
    SubPromiseCache.clear();
    PubResourceCache.clear();
    StreamCache.clear();
    SubscribeCache.clear();
  };
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
  let { appkey } = option;
  let getHeaders = () => {
    return {
      'App-Key': appkey
    }
  };
  let getBody = (desc) => {
    let token = im.getToken();
    let subs = getSubs();
    let body = {
      token,
      subscribeList: subs
    };
    if (desc) {
      utils.extend(body, {
        sdp: desc
      });
      return utils.Defer.resolve(body);
    }
    return pc.getOffer().then((offer) => {
      utils.extend(body, {
        sdp: offer
      })
      return body;
    });
  };
  let negotiate = (response) => {
    pc.getOffer().then(offer => {
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
      let headers = getHeaders();
      return request.post({
        path: url,
        body,
        headers
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

    let getTempUris = (type) => {
      let { id: userId } = user;
      let cacheUris = PubResourceCache.get(userId) || [];
      let isPublish = utils.isEqual(type, Message.PUBLISH);
      if (isPublish) {
        cacheUris = uris;
      }
      let streamId = pc.getStreamId(user);
      let getCondition = (stream) => {
        let { msid } = stream;
        return utils.isEqual(msid, streamId);
      };
      let tempUris = utils.filter(cacheUris, (stream) => {
        return getCondition(stream);
      });
      // 第一次 publish 过滤后 tempUris 为空，使用默认值
      return utils.isEmpty(tempUris) ? uris : tempUris;
    };
    let sendUris = getTempUris(type);
    let content = {
      uris: sendUris
    };
    let message = im.getMessage(type, content);
    let isInner = true;
    User.set(User.SET_USERINFO, uris, isInner, message);
    return PubResourceCache.set(user.id, uris);
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
    }, () => {
      eventEmitter.emit(CommonEvent.CONSUME_FINISHED);
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

  im.on(DownEvent.STREAM_CHANGED, (error, user) => {
    if (error) {
      throw error;
    }
    dispatchStreamEvent(user, (key, uri) => {
      DataCache.set(key, uri);
    });
  });
  im.on(CommonEvent.LEFT, () => {
    let streamIds = StreamCache.getKeys();
    utils.forEach(streamIds, (streamId) => {
      let stream = StreamCache.get(streamId);
      let tracks = stream.getTracks();
      utils.forEach(tracks, (track) => {
        track.stop();
      });
    });
    clear();
    if (pc) {
      pc.close();
    }
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
          } else {
            let { Inner } = ErrorType;
            im.emit(CommonEvent.ERROR, Inner.NETWORK_UNAVAILABLE)
          }
        });
      }
    });
    let { users } = room;
    let usersHandler = () => {
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
    };
    usersHandler();
  });
  let isCurrentUser = (user) => {
    let { id } = im.getUser();
    return utils.isEqual(user.id, id);
  };
  let publishTempStreams = [];
  let publishInvoke = (users) => {
    if (!utils.isArray(users)) {
      users = [users];
    }
    utils.forEach(users, (user) => {
      pc.addStream(user);
    });
    let [user] = users
    let roomId = im.getRoomId();
    Logger.log(LogTag.STREAM_HANDLER, {
      msg: 'publish:start',
      roomId,
      user
    });
    return pc.createOffer(user).then(desc => {
      pc.setOffer(desc);
      return getBody(desc).then(body => {
        let url = utils.tplEngine(Path.SUBSCRIBE, {
          roomId
        });
        Logger.log(LogTag.STREAM_HANDLER, {
          msg: 'publish:request',
          roomId,
          user,
          body
        });
        let headers = getHeaders();
        return request.post({
          path: url,
          body,
          headers
        }).then(response => {
          Logger.log(LogTag.STREAM_HANDLER, {
            msg: 'publish:response',
            roomId,
            user,
            response
          });
          publishTempStreams.length = 0;
          exchangeHandler(response, user, Message.PUBLISH);
        }, error => {
          Logger.log(LogTag.STREAM_HANDLER, {
            msg: 'publish:response',
            roomId,
            user,
            error
          });
          return error;
        });
      });
    });
  };
  eventEmitter.on(CommonEvent.CONSUME_FINISHED, () => {
    if (!utils.isEmpty(publishTempStreams)) {
      publishInvoke(publishTempStreams)
    }
  });
  let publish = (user) => {
    let { stream: streams } = user;
    if (!utils.isArray(streams)) {
      streams = [streams];
    }
    let { id } = user;
    utils.forEach(streams, (stream) => {
      let { mediaStream, size } = stream;
      let streamId = pc.getStreamId({
        id,
        stream
      }, size);
      StreamCache.set(streamId, mediaStream);
    });

    if (prosumer.isExeuting()) {
      publishTempStreams.push(user);
      return utils.Defer.resolve();
    }
    return publishInvoke(user);
  };
  let unpublish = (user) => {
    user = utils.clone(user);
    let streamId = pc.getStreamId(user);
    let mediaStream = StreamCache.get(streamId);
    if (!mediaStream) {
      return utils.Defer.reject(ErrorType.Inner.STREAM_NOT_EXIST);
    }
    let streams = [];
    let { stream } = user;
    let tinyStream = utils.clone(stream);
    let { id } = user;
    stream = utils.extend(stream, {
      mediaStream
    });
    streams.push(stream);

    let tinyStreamId = pc.getStreamId({
      id,
      stream: tinyStream
    }, StreamSize.MIN);
    let tinyMeidaStream = StreamCache.get(tinyStreamId);
    if (tinyMeidaStream) {
      tinyStream = utils.extend(tinyStream, {
        mediaStream: tinyMeidaStream
      });
      streams.push(tinyStream);
    }
    utils.extend(user, {
      stream: streams
    });
    let roomId = im.getRoomId();
    Logger.log(LogTag.STREAM_HANDLER, {
      msg: 'unpublish:start',
      roomId,
      user
    });
    utils.forEach(streams, ({ mediaStream }) => {
      let tracks = mediaStream.getTracks();
      utils.forEach(tracks, (track) => {
        track.stop();
      });
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
        let headers = getHeaders();
        return request.post({
          path: url,
          body,
          headers
        }).then((response) => {
          Logger.log(LogTag.STREAM_HANDLER, {
            msg: 'unpublish:response',
            roomId,
            user,
            response
          });
          StreamCache.remove(streamId);
          exchangeHandler(response, user, Message.UNPUBLISH);
        }, error => {
          Logger.log(LogTag.STREAM_HANDLER, {
            msg: 'unpublish:response',
            roomId,
            user,
            error
          });
        })
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
          let headers = getHeaders();
          prosumer.produce({
            sdp,
            body,
            headers
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
    SubscribeCache.remove(user);
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
      let headers = getHeaders();
      return request.post({
        path: url,
        body,
        headers
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
      let headers = getHeaders();
      return request.post({
        path: url,
        body,
        headers
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
  let saveModify = (user, type, state) => {
    let uris = getFitUris(user, type, state);
    // uris 为空表示没有发布资源，不需要修改
    if (!utils.isEmpty(uris)) {
      let { id } = user;
      let fullUris = PubResourceCache.get(id);
      let content = {
        uris
      };
      let message = im.getMessage(Message.MODIFY, content);
      let isInner = true;
      User.set(User.SET_USERINFO, fullUris, isInner, message);
    }
    return utils.Defer.resolve();
  };
  let modifyTrack = (user, type, state, isEnabled) => {
    trackHandler(user, type, isEnabled);
    if (isCurrentUser(user)) {
      saveModify(user, type, state);
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
  let getUsersById = (user) => {
    let { id } = user;
    let subs = SubscribeCache.get(id);
    let streams = {}, msTypes = {};
    utils.forEach(subs, ({ msid, tag, type }) => {
      streams[msid] = tag;
      let types = msTypes[msid] || [];
      types.push(type);
      msTypes[msid] = types;
    });
    let users = [];
    utils.forEach(streams, (tag, msid) => {
      let types = msTypes[msid] || [];
      let type = msTypes[0];
      type = utils.isEqual(types.length, 2) ? StreamType.AUDIO_AND_VIDEO : type;
      users.push({
        id,
        stream: {
          tag,
          type
        }
      });
    });
    return users;
  };
  im.on(DownEvent.ROOM_USER_LEFT, (error, user) => {
    if (error) {
      throw error;
    }
    let users = getUsersById(user);
    utils.forEach(users, (user) => {
      unsubscribe(user);
    });
  });
  im.on(DownEvent.STREAM_UNPUBLISHED, (error, user) => {
    if (error) {
      throw error;
    }
    dispatchStreamEvent(user, (key) => {
      DataCache.remove(key);
    });
    unsubscribe(user);
  });
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