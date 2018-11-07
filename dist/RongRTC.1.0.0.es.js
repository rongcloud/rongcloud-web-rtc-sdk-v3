/*
* RongRTC.js v1.0.0
* Copyright 2018 RongCloud
* Released under the MIT License.
*/
var join = function join(room) {};

var leave = function leave(room) {};
var Room = {
  join: join,
  leave: leave
};

var disable = function disable(user) {};

var enable = function enable(user) {};

var Video = {
  disable: disable,
  enable: enable
};

var mute = function mute(user) {};

var unmute = function unmute(user) {};

var Audio = {
  mute: mute,
  unmute: unmute
};

var get = function get(user) {};

var Stream = {
  get: get,
  Video: Video,
  Audio: Audio
};

var create = function create() {};

var getList = function getList() {};

var WhiteBoard = {
  create: create,
  getList: getList
};

var start = function start() {};

var stop = function stop(user) {};

var ScreenShare = {
  start: start,
  stop: stop
};

var extend = function extend(destination, sources) {
  for (var key in sources) {
    var value = sources[key];
    destination[key] = value;
  }
  return destination;
};

var utils = {
  extend: extend
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var RongRTC = function RongRTC(option) {
  classCallCheck(this, RongRTC);

  utils.extend(this, {
    Room: Room,
    Stream: Stream,
    WhiteBoard: WhiteBoard,
    ScreenShare: ScreenShare
  });
};

export default RongRTC;
