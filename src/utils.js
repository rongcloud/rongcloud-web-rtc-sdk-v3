const noop = () => { };
const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};
const isArray = (arr) => {
  return Object.prototype.toString.call(arr) === '[object Array]';
};
const isFunction = (arr) => {
  return Object.prototype.toString.call(arr) === '[object Function]';
};
const isString = (str) => {
  return Object.prototype.toString.call(str) === '[object String]';
};
const isBoolean = (str) => {
  return Object.prototype.toString.call(str) === '[object Boolean]';
};
const isUndefined = (str) => {
  return Object.prototype.toString.call(str) === '[object Undefined]';
};
const stringify = (obj) => {
  return JSON.stringify(obj);
};
const parse = (str) => {
  return JSON.parse(str);
};
const forEach = (obj, callback) => {
  callback = callback || noop;
  var loopObj = () => {
    for (var key in obj) {
      callback(obj[key], key, obj);
    }
  };
  var loopArr = () => {
    for (var i = 0, len = obj.length; i < len; i++) {
      callback(obj[i], i);
    }
  };
  if (isObject(obj)) {
    loopObj();
  }
  if (isArray(obj)) {
    loopArr();
  }
};
const rename = (origin, newNames) => {
  var isObj = isObject(origin);
  if (isObj) {
    origin = [origin];
  }
  origin = parse(stringify(origin));
  var updateProperty = function (val, key, obj) {
    delete obj[key];
    key = newNames[key];
    obj[key] = val;
  };
  forEach(origin, (item) => {
    forEach(item, (val, key, obj) => {
      var isRename = (key in newNames);
      (isRename ? updateProperty : noop)(val, key, obj);
    });
  });
  return isObject ? origin[0] : origin;
};
const extend = (destination, sources) => {
  for (let key in sources) {
    let value = sources[key];
    destination[key] = value;
  }
  return destination;
};
const Defer = Promise;
const deferred = (callback) => {
  return new Defer(callback);
};
const tplEngine = (tpl, data, regexp) => {
  if (!(isArray(data))) {
    data = [data];
  }
  let ret = [];
  let replaceAction = (object) => {
    return tpl.replace(regexp || (/\\?\{([^}]+)\}/g), (match, name) => {
      if (match.charAt(0) === '\\') return match.slice(1);
      return (object[name] !== undefined) ? object[name] : '{' + name + '}';
    });
  };
  for (let i = 0, j = data.length; i < j; i++) {
    ret.push(replaceAction(data[i]));
  }
  return ret.join('');
};
// 暂时支持 String
const isContain = (str, keyword) => {
  return str.indexOf(keyword) > -1;
};
const Cache = (cache) => {
  if (!isObject(cache)) {
    cache = {};
  }
  let set = (key, value) => {
    cache[key] = value;
  };
  let get = (key) => {
    return cache[key];
  };
  let remove = (key) => {
    delete cache[key];
  };
  let getKeys = () => {
    let keys = [];
    for (let key in cache) {
      keys.push(key);
    }
    return keys;
  };
  return {
    set,
    get,
    remove,
    getKeys
  };
};
const request = (url, option) => {
  return fetch(url, option);
};
const map = (arrs, callback) => {
  return arrs.map(callback);
};
const filter = (arrs, callback) => {
  return arrs.filter(callback);
};
const uniq = (arrs, callback) => {
  let newData = [], tempData = {};
  arrs.forEach(target => {
    let temp = callback(target);
    tempData[temp.key] = temp.value;
  });
  forEach(tempData, (val) => {
    newData.push(val);
  })
  return newData;
};
const some = (arrs, callback) => {
  return arrs.some(callback);
};
const isEqual = (source, target) => {
  return source === target;
};
const isEmpty = (obj) => {
  let result = true;
  if (isObject(obj)) {
    forEach(obj, () => {
      result = false;
    });
  }
  if (isString(obj) || isArray(obj)) {
    result = obj.length === 0;
  }
  return result;
};
const toJSON = (value) => {
  return JSON.stringify(value);
}
function Timer(_option) {
  _option = _option || {};
  let option = {
    timeout: 0,
    // interval | timeout
    type: 'interval'
  };
  extend(option, _option);
  let timers = [];
  let { timeout, type } = option;
  let timerType = {
    resume: {
      interval: (callback, immediate) => {
        if (immediate) {
          callback();
        }
        return setInterval(callback, timeout);
      },
      timeout: (callback, immediate) => {
        if (immediate) {
          callback();
        }
        return setTimeout(callback, timeout);
      }
    },
    pause: {
      interval: (timer) => {
        return clearInterval(timer);
      },
      timeout: (timer) => {
        return clearTimeout(timer);
      }
    }
  };
  this.resume = function (callback, immediate) {
    callback = callback || noop;
    let { resume } = timerType;
    let timer = resume[type](callback, immediate);
    timers.push(timer);
  };
  this.pause = function () {
    let { pause } = timerType;
    forEach(timers, timer => {
      pause[type](timer);
    });
  }
}
const isInclude = (str, match) => {
  return str.indexOf(match) > -1;
};
function Observer() {
  let observers = [];
  this.add = (observer) => {
    if (isFunction(observer)) {
      observers.push(observer);
    }
  };
  this.remove = (observer) => {
    observers = filter(observers, (_observer) => {
      return _observer !== observer
    });
  };
  this.emit = (data) => {
    forEach(observers, (observer) => {
      observer(data);
    });
  };
}
const Log = console;
export default {
  Log,
  Observer,
  Timer,
  isUndefined,
  isBoolean,
  isString,
  isObject,
  isArray,
  isFunction,
  stringify,
  parse,
  rename,
  extend,
  deferred,
  Defer,
  forEach,
  tplEngine,
  isContain,
  noop,
  Cache,
  request,
  map,
  filter,
  uniq,
  some,
  isEqual,
  isEmpty,
  toJSON,
  isInclude
}