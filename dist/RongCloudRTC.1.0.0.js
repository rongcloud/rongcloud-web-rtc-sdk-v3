/*
* RongCloudRTC.js v1.0.0
* Copyright 2018 RongCloud
* Released under the MIT License.
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.RongCloudRTC = factory());
}(this, (function () { 'use strict';

  //TODO 封装音视频 SDK
  var init = function init() {};

  var index = {
    init: init
  };

  return index;

})));
