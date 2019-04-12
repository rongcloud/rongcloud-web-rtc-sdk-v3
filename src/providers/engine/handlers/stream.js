import { UpEvent, DownEvent } from '../../../event-name';
import utils from '../../../utils';
import request from '../request';
import PeerConnection from '../peerconnection';
import { Path } from '../path';
import Message from '../im';
import { CommonEvent, PeerConnectionEvent } from '../events';
import EventEmitter from '../../../event-emitter';
import { StreamType, StreamState, LogTag, StreamSize, DEFAULT_MS_PROFILE } from '../../../enum';
import { ErrorType } from '../../../error';
import Logger from '../../../logger';
import Network from '../../../network';
import * as common from '../../../common';

function StreamHandler(im, option) {
  let DataCache = utils.Cache();
  let DataCacheName = {
    USERS: 'room_users',
    // 全部通知后一次性交换 SDP
    IS_NOTIFY_READY: 'is_notify_ready'
  };
  let SubPromiseCache = utils.Cache();
  let PubResourceCache = utils.Cache();
  // 缓存自己发布的视频流
  let PublishStreamCache = utils.Cache();
  /* 
    缓存已订阅 MediaStream
    userId_type: mediaStream
    方便视频流操作
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
    PublishStreamCache.clear();
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
  let getHeaders = () => {
    let roomId = im.getRoomId();
    let token = im.getRTCToken();
    let { appKey } = im.getAppInfo();
    return {
      'App-Key': appKey,
      RoomId: roomId,
      Token: token
    }
  };
  let getBody = (desc) => {
    let subs = getSubs();
    let streams = [];
    let streamIds = PublishStreamCache.getKeys();
    streams = utils.map(streamIds, (id) => {
      let mediaStream = PublishStreamCache.get(id);
      return {
        id,
        mediaStream
      }
    });
    let resolutionInfo = pc.getStreamRatio(streams);
    let body = {
      subscribeList: subs,
      resolutionInfo
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
  };
  /* 
  人员比较:
    1、clone 本地数据
    2、遍历服务端数据，在本地获取，本地没有认为是新增，本地有认为人员无变化
    3、本地有同时删掉 clone 数据，最终剩下的数据认为已离开房间
  资源比较:
    1、本地数据、远端数据转换为 {msid: [uri1, uri2]}
  最后更新本地数据
  */
  let compare = () => {
    let format = (users) => {
      let streams = {};
      utils.forEach(users, ({ uris }) => {
        utils.forEach(uris, (uri) => {
          let { msid } = uri;
          let resources = streams[msid] || [];
          resources.push(uri);
          streams[msid] = resources;
        });
      });
      return streams;
    };
    let dispatch = (event, id, uris, callback) => {
      common.dispatchStreamEvent({ id, uris }, (user) => {
        if (utils.isFunction(callback)) {
          return callback(user)
        }
        im.emit(event, user);
      });
    };
    // 发布、取消发布、视频操作、音频操作
    let compareStreams = (localUsers, remoteUsers) => {
      localUsers = format(localUsers);
      remoteUsers = format(remoteUsers);
      let tempLocalUsers = utils.clone(localUsers);
      utils.forEach(remoteUsers, (remoteUris, remoteMSId) => {
        /** 
         * 包含本地资源说明流没有变化，删除 tempLocalUsers，且需比对 track 变化，state 有差异，以 remoteUsers 为准
         * 未包含说明是新发布资源，触发 published 事件 
         * 遍历后 tempLocalUsers 还有数据认为是取消发布
         */
        let isInclude = remoteMSId in localUsers;
        let [userId] = pc.getStreamSymbolById(remoteMSId);
        let { id: currentUserId } = im.getUser();
        let isCurrent = utils.isEqual(currentUserId, userId);
        if (isInclude) {
          delete tempLocalUsers[remoteMSId];
          let tempRemote = utils.toJSON(remoteUris);
          let localUris = localUsers[remoteMSId];
          let tempLocal = utils.toJSON(localUris);
          if (!utils.isEqual(tempRemote, tempLocal)) {
            dispatch('', userId, remoteUris, (user) => {
              common.dispatchOperationEvent(user, (event, user) => {
                im.emit(event, user);
              });
            });
          }
        } else {
          if (!isCurrent) {
            dispatch(DownEvent.STREAM_PUBLISHED, userId, remoteUris);
          }
        }
      });
      utils.forEach(tempLocalUsers, (localUris, localMSId) => {
        let [userId] = pc.getStreamSymbolById(localMSId);
        dispatch(DownEvent.STREAM_UNPUBLISHED, userId, localUris);
      });
    };
    // 成员加入、退出
    let compareUser = (localUsers, remoteUsers) => {
      let tempLocalUsers = utils.clone(localUsers);
      let tempRemoteUsers = utils.toArray(remoteUsers);
      let { id: currentUserId } = im.getUser();
      utils.forEach(tempRemoteUsers, ([remoteUserId]) => {
        let isInclude = remoteUserId in localUsers;
        let isCurrent = utils.isEqual(currentUserId, remoteUserId);
        if (isInclude) {
          delete tempLocalUsers[remoteUserId];
        } else {
          if (!isCurrent) {
            im.emit(DownEvent.ROOM_USER_JOINED, { id: remoteUserId });
          }
        }
      });
      tempLocalUsers = utils.toArray(tempLocalUsers);
      utils.forEach(tempLocalUsers, ([id]) => {
        im.emit(DownEvent.ROOM_USER_LEFT, { id });
      });
    };
    im.getUsers().then(remoteUsers => {
      utils.forEach(remoteUsers, (user) => {
        let { uris } = user;
        uris = utils.parse(uris);
        utils.extend(user, {
          uris
        });
      });
      let localUsers = DataCache.get(DataCacheName.USERS);
      compareUser(localUsers, remoteUsers);
      compareStreams(localUsers, remoteUsers);
      DataCache.set(DataCacheName.USERS, remoteUsers);
    });
  };
  im.on(CommonEvent.CONNECTED, () => {
    let users = DataCache.get(DataCacheName.USERS);
    if (users) {
      compare();
    }
  });
  let reconnect = () => {
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
      let tag = pc.getTagByStreamId(msid);
      utils.extend(stream, {
        tag,
        state: StreamState.ENABLE
      });
      return stream;
    });
  };
  let { detect } = option;
  let network = new Network(detect);
  let getTrackState = (streams) => {
    if (!utils.isArray(streams)) {
      streams = [streams];
    }
    let result = {};
    utils.forEach(streams, ({ mediaStream }) => {
      let { streamId } = mediaStream;
      let videoTracks = mediaStream.getVideoTracks();
      let audioTracks = mediaStream.getAudioTracks();
      let func = (track) => {
        return utils.isEqual(track.enabled, false)
      }
      let video = StreamState.ENABLE;
      if (utils.some(videoTracks, func)) {
        video = StreamState.DISBALE;
      }
      let audio = StreamState.ENABLE;
      if (utils.some(audioTracks, func)) {
        audio = StreamState.DISBALE;
      }
      result[streamId] = {
        video,
        audio
      };
    });
    return result;
  };
  let updateTrackState = (user, sendUris, uris) => {
    let { stream: streams } = user;
    let states = getTrackState(streams);
    let update = (_uris) => {
      utils.forEach(states, ({ audio, video }, streamId) => {
        utils.map(_uris, (uri) => {
          let isSameStream = utils.isEqual(uri.msid, streamId);
          if (isSameStream && utils.isEqual(uri.mediaType, StreamType.VIDEO)) {
            utils.extend(uri, {
              state: video
            });
          }
          if (isSameStream && utils.isEqual(uri.mediaType, StreamType.AUDIO)) {
            utils.extend(uri, {
              state: audio
            });
          }
          return uri;
        });
      });
    };
    update(sendUris);
    update(uris);
    return {
      sendUris,
      uris
    };
  };
  let appendStreamId = (user) => {
    let { id } = user;
    let { stream: streams } = user;
    if (!utils.isArray(streams)) {
      streams = [streams];
    }
    utils.map(streams, (stream) => {
      let streamId = pc.getStreamId({
        id,
        stream
      });
      let { mediaStream } = stream;
      utils.extend(mediaStream, {
        streamId
      });
    });
  };
  let exchangeHandler = (result, user, type, offer) => {
    let { publishList, sdp } = result;
    pc.setOffer(offer);
    pc.setAnwser(sdp);
    Logger.log(LogTag.STREAM_HANDLER, {
      msg: 'exchangeHandler set sdp'
    });
    let uris = getUris(publishList);
    appendStreamId(user);
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
    updateTrackState(user, sendUris, uris);
    let content = {
      uris: sendUris
    };
    let message = im.getMessage(type, content);
    let isInner = true;
    User.set(User.SET_USERINFO, uris, isInner, message);
    return PubResourceCache.set(user.id, uris);
  };
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
    utils.forEach(uris, (uri) => {
      let { tag, mediaType: type } = uri;
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
  // im.on(DownEvent.STREAM_CHANGED, (error, user) => {
  //   if (error) {
  //     throw error;
  //   }
  //   dispatchStreamEvent(user, (key, uri) => {
  //     DataCache.set(key, uri);
  //   });
  // });
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
  let unpublish = (user) => {
    user = utils.clone(user);
    let streamId = pc.getStreamId(user);
    let mediaStream = StreamCache.get(streamId);
    if (!mediaStream) {
      mediaStream = new MediaStream();
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
      let { id: streamId } = mediaStream;
      PublishStreamCache.remove(streamId);
    });
    return pc.removeStream(user).then(desc => {
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
          exchangeHandler(response, user, Message.UNPUBLISH, desc);
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
  /* 加入房间成功后，主动获取已发布资源的人员列表，通知应用层 */
  im.on(CommonEvent.JOINED, (error, room) => {
    if (error) {
      throw error;
    }
    pc = new PeerConnection(option);
    im.emit(CommonEvent.PEERCONN_CREATED, pc);
    let getStreamUser = (stream) => {
      let { id } = stream, type = StreamType.NODE;
      let [userId, tag] = pc.getStreamSymbolById(id);
      let videoTracks = stream.getVideoTracks();
      let audioTrakcks = stream.getAudioTracks();
      let isEmtpyVideo = utils.isEmpty(videoTracks);
      let isEmptyAudio = utils.isEmpty(audioTrakcks)
      let tpl = '{id}_{type}';
      let videoTrackId = utils.tplEngine(tpl, {
        id,
        type: StreamType.VIDEO
      });
      let audioTrackId = utils.tplEngine(tpl, {
        id,
        type: StreamType.AUDIO
      });

      let videoTrack = DataCache.get(videoTrackId);
      let audioTrack = DataCache.get(audioTrackId);

      if (isEmtpyVideo) {
        type = StreamType.AUDIO;
      }
      if (isEmptyAudio) {
        type = StreamType.VIDEO;
      }
      let enableVideo = true;
      let enableAudio = true;

      if (!isEmptyAudio && !isEmtpyVideo) {
        type = StreamType.AUDIO_AND_VIDEO;
        if (utils.isEqual(videoTrack.state, StreamState.DISBALE)) {
          enableVideo = false;
        } else if (utils.isEqual(audioTrack.state, StreamState.DISBALE)) {
          enableAudio = false;
        }
      }
      Logger.log(LogTag.ROOM, {
        msg: 'join successfully',
        room
      });
      return {
        id: userId,
        stream: {
          tag,
          type,
          mediaStream: stream,
          enable: {
            video: enableVideo,
            audio: enableAudio
          }
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
      im.emit(CommonEvent.PUBLISHED_STREAM, {
        mediaStream: stream,
        user
      });
      let uid = getSubPromiseUId(user);
      let promise = SubPromiseCache.get(uid);
      if (utils.isUndefined(promise)) {
        return Logger.log(LogTag.STREAM, {
          msg: 'stream added-part',
          user,
          tracks: stream.getTracks()
        });
      }
      Logger.log(LogTag.STREAM, {
        msg: 'stream added',
        user,
        tracks: stream.getTracks()
      });
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
            reconnect();
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
      let { id: currentUserId } = im.getUser();
      utils.forEach(users, (data, id) => {
        let { uris } = data;
        if (utils.isUndefined(uris)) {
          Logger.log(LogTag.STREAM_HANDLER, {
            msg: 'user exist, uris is empty',
            user: {
              id
            }
          });
          return;
        }
        if (utils.isEqual(currentUserId, id)) {
          let [stream] = uris;
          if (utils.isUndefined(stream)) {
            return;
          }
          let { mediaType: type, tag } = stream;
          type = utils.isEqual(uris.length, 1) ? type : StreamType.AUDIO_AND_VIDEO;
          return unpublish({
            id,
            stream: {
              tag,
              type
            }
          });
        }
        utils.forEach(uris, (uri) => {
          let { mediaType: type, tag } = uri;
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
          let msUris = utils.filter(uris, ({ msid }) => {
            return utils.isInclude(msid, tag)
          });
          setTimeout(() => {
            im.emit(DownEvent.STREAM_PUBLISHED, {
              id,
              stream: {
                tag,
                uris: msUris
              }
            });
          });
        });
      });
    };
    usersHandler();
  });
  let isCurrentUser = (user) => {
    let { id } = im.getUser();
    return utils.isEqual(user.id, id);
  };
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
      PublishStreamCache.set(streamId, mediaStream);
      if (!utils.isUndefined(mediaStream)) {
        im.emit(CommonEvent.PUBLISHED_STREAM, {
          mediaStream,
          user
        });
      }
    });
    pc.addStream(user);
    let roomId = im.getRoomId();
    return utils.deferred((resolve, reject) => {
      pc.createOffer(user).then(desc => {
        return getBody(desc).then(body => {
          let url = utils.tplEngine(Path.PUBLISH, {
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
            exchangeHandler(response, user, Message.PUBLISH, desc);
            resolve();
          }, error => {
            Logger.log(LogTag.STREAM_HANDLER, {
              msg: 'publish:response:error',
              roomId,
              user,
              error
            });
            reject(error);
          });
        });
      });
    });
  };

  let isTrackExist = (user, types) => {
    let { id: userId, stream: { tag } } = user;
    var isError = false;
    utils.forEach(types, (type) => {
      let tUser = {
        id: userId,
        stream: {
          tag,
          type
        }
      };
      let key = getUId(tUser);
      let { uri } = DataCache.get(key) || {};
      if (utils.isUndefined(uri)) {
        isError = true;
      }
    });
    return isError;
  };
  let subscribe = (user) => {
    let { id: userId, stream: { tag, type } } = user;
    let subs = SubscribeCache.get(userId) || [];
    let types = [StreamType.VIDEO, StreamType.AUDIO];
    if (!utils.isEqual(type, StreamType.AUDIO_AND_VIDEO)) {
      types = [type];
    }
    if (isTrackExist(user, types)) {
      let { Inner } = ErrorType;
      return utils.Defer.reject(Inner.STREAM_TRACK_NOT_EXIST);
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
      let { uri } = DataCache.get(key);
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
    return utils.deferred((resolve, reject) => {
      let uid = getSubPromiseUId(user);
      SubPromiseCache.set(uid, {
        resolve,
        reject,
        type
      });
      getBody().then(body => {
        let { sdp: offer } = body;
        let url = utils.tplEngine(Path.SUBSCRIBE, {
          roomId
        });
        let headers = getHeaders();
        let option = {
          path: url,
          body,
          headers
        };
        Logger.log(LogTag.STREAM_HANDLER, {
          msg: 'subscribe:request',
          roomId,
          option
        });
        request.post(option).then(response => {
          pc.setOffer(offer);
          let { sdp: answer } = response;
          pc.setAnwser(answer);
          Logger.log(LogTag.STREAM_HANDLER, {
            msg: 'subscribe:response',
            roomId,
            user,
            response
          });
        }, (error) => {
          Logger.log(LogTag.STREAM_HANDLER, {
            msg: 'subscribe:response:error',
            roomId,
            user,
            error
          });
          let uid = getSubPromiseUId(user);
          let promise = SubPromiseCache.get(uid);
          if (!utils.isUndefined(promise)) {
            promise.reject(error);
          }
        });
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
  let getUserMedia = (constraints) => {
    return navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
      return { mediaStream };
    });
  };
  let getScreen = (constraints) => {
    let { desktopStreamId } = constraints;
    if (!desktopStreamId) {
      let { Inner } = ErrorType;
      return utils.Defer.reject(Inner.STREAM_DESKTOPID_ILLEGAL);
    }
    constraints = {
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: desktopStreamId
        }
      }
    };
    return getUserMedia(constraints);
  };
  let getMS = (constraints) => {
    if (utils.isEmpty(constraints)) {
      constraints = {
        video: true,
        audio: true
      };
    }
    let { video } = constraints;
    if (utils.isObject(video)) {
      video = utils.extend(DEFAULT_MS_PROFILE, video);
    }
    if (utils.isBoolean(video) && video) {
      video = DEFAULT_MS_PROFILE;
    }
    utils.extend(constraints, {
      video
    });
    return getUserMedia(constraints);
  };
  let get = (constraints) => {
    constraints = constraints || {};
    let { screen } = constraints;
    return screen ? getScreen(constraints) : getMS(constraints);
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
  eventEmitter.on(CommonEvent.CONSUME, () => {
    prosumer.consume(({ event, args, resolve, reject }, next) => {
      switch (event) {
        case UpEvent.STREAM_PUBLISH:
          return publish(...args).then((result) => {
            next();
            resolve(result);
          }).catch((error) => {
            next();
            reject(error);
          });
        case UpEvent.STREAM_UNPUBLISH:
          return unpublish(...args).then((result) => {
            next();
            resolve(result);
          }).catch((error) => {
            next();
            reject(error);
          });
        case UpEvent.STREAM_SUBSCRIBE:
          return subscribe(...args).then((result) => {
            next();
            resolve(result);
          }).catch((error) => {
            next();
            reject(error);
          });
        case UpEvent.STREAM_UNSUBSCRIBE:
          return unsubscribe(...args).then((result) => {
            next();
            resolve(result);
          }).catch((error) => {
            next();
            reject(error);
          });
        case UpEvent.STREAM_RESIZE:
          return resize(...args).then((result) => {
            next();
            resolve(result);
          }).catch((error) => {
            next();
            reject(error);
          });
        case UpEvent.STREAM_GET:
          return get(...args).then((result) => {
            next();
            resolve(result);
          }).catch((error) => {
            next();
            reject(error);
          });
        case UpEvent.AUDIO_MUTE:
          return mute(...args).then((result) => {
            next();
            resolve(result);
          }).catch((error) => {
            next();
            reject(error);
          });
        case UpEvent.AUDIO_UNMUTE:
          return unmute(...args).then((result) => {
            next();
            resolve(result);
          }).catch((error) => {
            next();
            reject(error);
          });
        case UpEvent.VIDEO_DISABLE:
          return disable(...args).then((result) => {
            next();
            resolve(result);
          }).catch((error) => {
            next();
            reject(error);
          });
        case UpEvent.VIDEO_ENABLE:
          return enable(...args).then((result) => {
            next();
            resolve(result);
          }).catch((error) => {
            next();
            reject(error);
          });
        default:
          Logger.warn(LogTag.STREAM_HANDLER, {
            event,
            msg: 'unkown event'
          });
      }
    });
  });
  let dispatch = (event, args) => {
    return utils.deferred((resolve, reject) => {
      prosumer.produce({ event, args, resolve, reject });
      eventEmitter.emit(CommonEvent.CONSUME);
    });
  };
  return {
    dispatch
  };
}
export default StreamHandler;  