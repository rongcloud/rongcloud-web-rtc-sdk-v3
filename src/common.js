import utils from './utils';
import { ErrorType } from './error';
import { StreamType, StreamState } from './enum';
import { DownEvent } from './event-name';
/* 
  data： 任意对象
  rules: 校验规则，数组
  let user = {
    id: '',
    stream: {
      type: 1,
      tag: 2
    }
  };
  // 校验必传入参数, 暂时支持 2 级
  check(user, ['id', 'stream.type', 'stream.tag', 'stream.mediaStream']);
*/
export const check = (data, rules) => {
  let isIllegal = false, name = '';
  let getBody = () => {
    return {
      isIllegal,
      name
    };
  };
  if (!utils.isArray(rules)) {
    rules = [rules];
  }
  if (!utils.isObject(data)) {
    throw new Error('check(data, rules): data must be an object');
  }
  utils.forEach(rules, (rule) => {
    let isTier = rule.indexOf('.') > -1;
    if (!isTier) {
      isIllegal = utils.isUndefined(data[rule]);
      if (isIllegal) {
        return name = rule;
      }
    }
    if (isTier) {
      let props = rule.split('.');
      let [parent, child] = props;
      let parentData = data[parent];
      isIllegal = utils.isUndefined(parentData);
      if (isIllegal) {
        return name = parent;
      }
      if (!utils.isArray(parentData)) {
        parentData = [parentData];
      }
      utils.forEach(parentData, (parent) => {
        let childData = parent[child];
        isIllegal = utils.isUndefined(childData);
        if (isIllegal) {
          return name = child;
        }
      });
    }
  });
  return getBody();
};

export const getError = (name) => {
  let { Inner: { PARAMTER_ILLEGAL: error } } = ErrorType;
  let { msg } = error;
  msg = utils.tplEngine(msg, {
    name
  });
  return utils.extend(error, {
    msg
  });
};

export const getHeaders = (im) => {
  let roomId = im.getRoomId();
  let token = im.getRTCToken();
  let { appKey } = im.getAppInfo();
  let browser = utils.getBrowser();
  let tpl = 'web|{name}|{version}';
  let type = utils.tplEngine(tpl, browser);
  return {
    'App-Key': appKey,
    RoomId: roomId,
    Token: token,
    ClientType: type,
    ClientVersion: 1
  }
};

export const dispatchStreamEvent = (user, callback) => {
  let { id, uris } = user;
  if (utils.isString(uris)) {
    uris = utils.parse(uris);
  }
  let streams = [user];
  if (uris) {
    streams = utils.uniq(uris, (target) => {
      let { streamId, tag, mediaType, state } = target;
      return {
        key: [streamId, tag].join('_'),
        value: {
          tag,
          uris,
          mediaType,
          state
        }
      }
    });
  }
  utils.forEach(streams, (stream) => {
    callback({
      id,
      stream
    });
  });
};

export const dispatchOperationEvent = (user, callback) => {
  let getModifyEvents = () => {
    let events = {}, tpl = '{type}_{state}';
    // 禁用视频
    let name = utils.tplEngine(tpl, {
      type: StreamType.VIDEO,
      state: StreamState.DISBALE
    });
    events[name] = DownEvent.STREAM_DISABLED;
    // 启用视频
    name = utils.tplEngine(tpl, {
      type: StreamType.VIDEO,
      state: StreamState.ENABLE
    });
    events[name] = DownEvent.STREAM_ENABLED;
    // 音频静音
    name = utils.tplEngine(tpl, {
      type: StreamType.AUDIO,
      state: StreamState.DISBALE
    });
    events[name] = DownEvent.STREAM_MUTED;
    // 音频取消静音
    name = utils.tplEngine(tpl, {
      type: StreamType.AUDIO,
      state: StreamState.ENABLE
    });
    events[name] = DownEvent.STREAM_UNMUTED;
    return events;
  };
  let { stream: { mediaType: type, state } } = user;
  let tpl = '{type}_{state}';
  let name = utils.tplEngine(tpl, {
    type,
    state
  });
  let events = getModifyEvents();
  let event = events[name];
  return callback(event, user);
};

export const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

export const isV2Tag = (tag) => {
  return utils.isUndefined(tag) || utils.isEmpty(tag);
};