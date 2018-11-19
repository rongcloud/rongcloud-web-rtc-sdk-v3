const isObject = (obj) => {
  return (Object.prototype.toString.call(obj) == '[object Object]');
}
const isArray = (arr) => {
  return (Object.prototype.toString.call(arr) == '[object Array]');
}
const isFunction = (arr) => {
  return (Object.prototype.toString.call(arr) == '[object Function]');
}
const stringify = (obj) => {
  return JSON.stringify(obj);
}
const parse = (str) => {
  return JSON.parse(str);
}
const rename = (origin, newNames) => {
  var isObject = isObject(origin);
  if (isObject) {
    origin = [origin];
  }
  origin = parse(stringify(origin));
  var updateProperty = function (val, key, obj) {
    delete obj[key];
    key = newNames[key];
    obj[key] = val;
  };
  forEach(origin,  (item) => {
    forEach(item, (val, key, obj) => {
      var isRename = (key in newNames);
      (isRename ? updateProperty : noop)(val, key, obj);
    });
  });
  return isObject ? origin[0] : origin;
}
const extend = (destination, sources) => {
  for (let key in sources) {
    let value = sources[key];
    destination[key] = value;
  }
  return destination;
}
const deferred = (callback) => {
  return new Promise(callback);
}
const forEach = (obj, callback) => {
  callback = callback || RongUtil.noop;
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
}
const tplEngine = (tpl, data, regexp) => {
  if (!(isArray(data))) {
    data = [data];
  };
  let ret = [];
  for (let i = 0, j = data.length; i < j; i++) {
    ret.push(replaceAction(data[i]));
  }
  function replaceAction(object) {
    return tpl.replace(regexp || (/\\?\{([^}]+)\}/g), (match, name) => {
      if (match.charAt(0) == '\\') return match.slice(1);
      return (object[name] != undefined) ? object[name] : '{' + name + '}';
    });
  }
  return ret.join('');
}

export default {
  isObject,
  isArray,
  isFunction,
  stringify,
  parse,
  rename,
  extend,
  deferred,
  forEach,
  tplEngine
}