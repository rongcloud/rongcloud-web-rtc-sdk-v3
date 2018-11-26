/** This library require adapter.js */

/** ----- 参数定义 ----- */
var BlinkGlobal = {
  /** 带宽设置计数器 */
  bandWidthCount: 0
}
/** ----- 参数定义 ----- */

/** ----- 常量定义 ----- */
var BlinkConstant = {
  /** Blink SDK版本号 */
  SDK_VERSION_NAME: '1.0.0',
/** client type */
  CLIENT_TYPE: 3,
  /** keepAlive时间间隔 */
  KEEPALIVE_INTERVAL: 5 * 1000,
  /** keepAlive最大连续失败次数 */
  KEEPALIVE_FAILEDTIMES_MAX: 4,
  /** keepAliveTimer时间间隔 */
  KEEPALIVE_TIMER_INTERVAL: 1 * 1000,
  /** keepAlive未收到result最大超时时间 */
  KEEPALIVE_TIMER_TIMEOUT_MAX: 20,
  /** keepAlive未收到result最大超时时间 */
  KEEPALIVE_TIMER_TIMEOUT_RECONNECT: 12,
  /** reconnect最大连续次数 */
  RECONNECT_MAXTIMES: 10,
  /** reconnect连续重连时间间隔 */
  RECONNECT_TIMEOUT: 1 * 1000,
  /** getStatsReport时间间隔 */
  GETSTATSREPORT_INTERVAL: 1 * 1000
}
/** 连接类型 */
BlinkConstant.ConnectionType = {
  /** P2P模式 */
  P2P: 0,
  /** MediaServer模式 */
  MEDIASERVER: 1
}
/** logon version */
BlinkConstant.LogonVersion = {
/** 初始版本 */
INIT: 1,
/** 订阅分发版本 */
SUBSCRIBE: 3
}
/** 用户模式类型 */
BlinkConstant.UserType = {
  /** 普通模式 */
  NORMAL: 1,
  /** 观察者模式 */
  OBSERVER: 2,
  /** 主持人模式 */
  HOST: 3
}
/** 用户音视频类型 */
BlinkConstant.TalkType = {
/** 仅音频 */
OnlyAudio: 0,
/** 音频+视频 */
All: 1,
/** 视频 */
OnlyVideo: 2,
/** 无 */
None: 3
}
/** 设备类型 */
BlinkConstant.DeviceType = {
/** 摄像头 */
Camera: 1,
/** 麦克风 */
Microphone: 2,
/** 摄像头+麦克风 */
CameraAndMicrophone: 3,
/** 屏幕共享 */
ScreenShare: 4
}
/** 操作类型 */
BlinkConstant.OperationType = {
/** 打开 */
OPEN: 1,
/** 关闭 */
CLOSE: 2
}
/** EnablType */
BlinkConstant.EnableType = {
/** disable */
Disable: 0,
/** enable */
Enable: 1
}
/** 与服务器的连接状态 */
BlinkConstant.ConnectionState = {
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  ROOM_ERROR: 'ROOM_ERROR'
}
/** websocket的连接状态 */
BlinkConstant.wsConnectionState = {
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  CONNECTING: 'CONNECTING'
}
/** 交换类型 */
BlinkConstant.ExchangeType = {
  /** offer */
  OFFER: 1,
  /** answer */
  ANSWER: 2,
  /** candidate */
  CANDIDATE: 3
}
/** logonAndJoin status */
BlinkConstant.LogonAndJoinStatus = {
  CONNECT: 0,
  RECONNECT: 1
}
/** offer status */
BlinkConstant.OfferStatus = {
  SENDING: 'SENDING',
  DONE: 'DONE'
}
/**
* 会控操作类型
* 
*/
BlinkConstant.MeetingActionType = {
/** 与会人员能力管理 */
RoleChange: {
  /** 将与会人降级为观察者 */
    DegradeToObserver: 1,
    /** 邀请观察者发言,将观察升级为正常用户 */
    UpgradeToNormal: 2,
    /** 移除与会人员 */
    RemoveUser: 3
},
/** 申请管理 */
Apply: {
  /** 观察者请求变更为正常用户发言 */
    RequestUpgradeToNormal: 1,
    /** 正常用户成为主持人 */
    GetHostAuthority: 2,
    /** 获取邀请连接 */
    GetInviteUrl: 3
},
/** 与会人员设备管理 */
ManageAction: {
  
},
/** 会控应答 */
ChannelAnswer: {
  /** 邀请观察者发言 */
    UpgradeToNormal: 1,
    /** 观察者主动要求发言 */
    RequestUpgradeToNormal: 2,
    /** 邀请打开设备 */
    InviteToOpen: 3,
    /** 把正常用户降级为观察者 */
    DegradeToObserver: 4,
    /** 邀请关闭设备 */
    InviteToClose: 5
}
}
/**
* 会控应答类型
* 
*/
BlinkConstant.MeetingAnswerType = {
  /** 接受 */
  Accept: 1,
  /** 拒绝 */
  Deny: 2,
  /** 忙碌 */
  Busy: 4
}
/** 视频分辨率 */
BlinkConstant.VideoProfile_default = {
  width: 640,
  height: 480,
  frameRate: 15
}
/** 小视频分辨率 */
BlinkConstant.VideoProfile_min = {
  width: 176,
  height: 144,
  frameRate: 15
}
/** 共享屏幕分辨率 */
BlinkConstant.ShareProfile_default = {
  width: 1280,
  height: 720,
  frameRate: 15
}
/** 带宽 */
BlinkConstant.BandWidth_default = {
  min: 100,
  max: 500
}
/** 带宽全部 */
BlinkConstant.BandWidth_320_240 = {
  min: 100,
  max: 320
}
BlinkConstant.BandWidth_640_480 = {
  min: 100,
  max: 500
}
BlinkConstant.BandWidth_1280_720 = {
  min: 100,
  max: 1500
}
BlinkConstant.BandWidth_ScreenShare_1280_720 = {
min: 1000,
max: 1500
}
/**
* 屏幕共享状态码
* 
*/
BlinkConstant.ScreenShareSupportCode = {
/** 支持 */
Support: 0,
/** 浏览器不支持 */
BrowserNotSupport: 1,
/** 未安装插件 */
NoPlugin: 2
}
/**
* 视频类型
* 
*/
BlinkConstant.VideoType = {
/** 普通音视频 */
NORMAL: 1,
/** 屏幕共享 */
SCREEN: 2
}
/**
* 流后缀
* 
*/
BlinkConstant.StreamSuffix = {
TINY: '_tiny',
SCREEN: '_screen'
}
/**
* Track后缀
* 
*/
BlinkConstant.TrackSuffix = {
VIDEO: '_video',
AUDIO: '_audio'
}
/** 用户关心的通知类型 */
BlinkConstant.CareType = {
/** 错误，不符合标准的值 */
  Error: -1,
  /** 不关心任何通知 */
  None: 0,
  /** 关心人员进出变更通知 */
  MemberChange: 1,
  /** 关心阅资源发布类型变更通知 */
  ResourceChange: 2,
  /** 关心人员进出和资源发布类型变更通知 */
  MemberAndResourceChange: 3,
  /** 关心订阅列表信息变更通知 */
  SubscribeChange: 4,
  /** 关心人员进出和订阅列表信息变更通知 */
  MemberAndSubscribeChange: 5,
  /** 关心资源发布类型和订阅列表信息变更通知 */
  ResourceAndSubscribeChange: 6,
  /** 关心所有类型通知 */
  All: 7
}
/** 资源发布的类型 */
BlinkConstant.ResourceType = {
/** 错误，不符合标准的值 */
  Error: -1,
  /** 不发布任何资源 */
  None: 0,
  /** 只发布音频 */
  AudioOnly: 1,
  /** 只发布视频 */
  VideoOnly: 2,
  /** 发布音频和视频 */
  AudioAndVideo: 3,
  /** 发布屏幕共享 */
  ScreenSharing: 4,
  /** 发布音频和屏幕共享 */
  AudioAndScreenSharing: 5,
  /** 发布视频和屏幕共享 */
  VideoAndScreenSharing: 6,
  /** 发布音视频和屏幕共享 */
  AudioAndVideoAndScreenSharing: 7
}
/** 资源订阅的类型 */
BlinkConstant.SubscribeType = {
/** 错误，不符合标准的值 */
  Error: -1,
  /** 不订阅任何资源 */
  None: 0,
  /** 只订阅音频 */
  AudioOnly: 1,
  /** 只订阅视频 */
  VideoOnly: 2,
  /** 订阅音频和视频 */
  AudioAndVideo: 3,
  /** 订阅屏幕共享 */
  ScreenSharing: 4,
  /** 订阅音频和屏幕共享 */
  AudioAndScreenSharing: 5,
  /** 订阅视频和屏幕共享 */
  VideoAndScreenSharing: 6,
  /** 订阅音视频和屏幕共享 */
  AudioAndVideoAndScreenSharing: 7
}
/**
* 管理类型
* 
*/
BlinkConstant.ManageType = {
Manage: 1,
Apply: 2
}
/** 信令 */
BlinkConstant.SignalType = {
  /** 请求信令 */
  // LOGON : 'logon',
  // JOIN : 'join',
  // PING : 'ping',
  LOGONANDJOIN: 'logonAndJoin',
  CHANNEL_PING: 'channelPing',
  LEAVE: 'leave',
  UPDATETALKTYPE: 'updateTalkType',
  TURNTALKTYPE: 'turntalktype',
  SCREENSHARING: 'screensharing',
  /** 应答信令 */
  LOGONANDJOIN_RESULT: 'logonAndJoin_result',
  CHANNEL_PING_RESULT: 'channelPing_result',
  LEAVE_RESULT: 'leave_result',
  UPDATETALKTYPE_RESULT: 'updateTalkType_result',
  TURNTALKTYPE_RESULT: 'turntalktype_result',
  SCREENSHARING_RESULT: 'screensharing_result',
  /** 通知信令 */
  JOINED: 'joined',
  LEFT: 'left',
  OFFER_REQUEST: 'offerRequest',
  UPDATETALKTYPE_NOTIFY: 'update_talktype',
  TURNTALKTYPE_NOTIFY: 'turntalktype',
  SCREENSHARING_NOTIFY: 'screensharing',
  /** exchange信令 */
  EXCHANGE: 'exchange',
  EXCHANGE_RESULT: 'exchange_result',
  /** 白板信令 */
  EWBCREATE: 'ewb_create',
  EWBQUERY: 'ewb_query',
  EWBCREATE_RESULT: 'ewb_create_result',
  EWBQUERY_RESULT: 'ewb_query_result',
  EWBCREATE_NOTIFY: 'ewb_create_notify',
  /** 会控信令 */
  // rolechange
  ROLECHANGE: 'rolechange',
  ROLECHANGE_RESULT: 'rolechange_result',
  ROLECHANGE_NOTIFY: 'rolechange',
  // apply
  APPLY: 'apply',
  APPLY_RESULT: 'apply_result',
  APPLY_NOTIFY: 'apply',
  // manageaction
  MANAGEACTION: 'manageaction',
  MANAGEACTION_RESULT: 'manageaction_result',
  MANAGEACTION_NOTIFY: 'manageaction',
  // channelanswer
  CHANNELANSWER: 'channelanswer',
  CHANNELANSWER_RESULT: 'channelanswer_result',
  CHANNELANSWER_NOTIFY: 'channelanswer',
  /** 大小流 */
  FLOWSUBSCRIBE: 'flowSubscribe',
  /** 订阅分发信令 */
  // update_resource
  UPDATE_RESOURCE: 'update_resource',
  UPDATE_RESOURCE_RESULT: 'update_resource_result',
  UPDATE_RESOURCE_NOTIFY: 'update_resource_notify',
  // update_subscribe
  UPDATE_SUBSCRIBE: 'update_subscribe',
  UPDATE_SUBSCRIBE_RESULT: 'update_subscribe_result',
  UPDATE_SUBSCRIBE_NOTIFY: 'update_subscribe_notify',
  // manage_update_resource_subscribe
  MANAGE_UPDATE_RESOURCE_SUBSCRIBE: 'manage_update_resource_subscribe',
  MANAGE_UPDATE_RESOURCE_SUBSCRIBE_RESULT: 'manage_update_resource_subscribe_result',
  MANAGE_UPDATE_RESOURCE_NOTIFY: 'manage_update_resource_notify',
  MANAGE_UPDATE_SUBSCRIBE_NOTIFY: 'manage_update_subscribe_notify',
  // manage_answer_update_resource
  MANAGE_ANSWER_UPDATE_RESOURCE: 'manage_answer_update_resource',
  MANAGE_ANSWER_UPDATE_RESOURCE_RESULT: 'manage_answer_update_resource_result',
  MANAGE_ANSWER_UPDATE_RESOURCE_NOTIFY: 'manage_answer_update_resource',
  // manage_answer_update_subscribe
  MANAGE_ANSWER_UPDATE_SUBSCRIBE: 'manage_answer_update_subscribe',
  MANAGE_ANSWER_UPDATE_SUBSCRIBE_RESULT: 'manage_answer_update_subscribe_result',
  MANAGE_ANSWER_UPDATE_SUBSCRIBE_NOTIFY: 'manage_answer_update_subscribe'
}
/** ----- 常量定义 ----- */

/** ----- BlinkEngine ----- */
//var BlinkEngine = (function() {
/**
* 构造函数
*
*/
var BlinkEngine = function (wsNavUrl) {
  this.init(wsNavUrl);
  // 初始化屏幕共享
  this.initScreenShare();
  return this;
}
/**
* 初始化
*
*/
BlinkEngine.prototype.init = function (wsNavUrl) {
/** logon version */
this.logonVersion = BlinkConstant.LogonVersion.SUBSCRIBE;

  /** ----- Stream信息 ----- */
  /** 本地视频流 */
  this.localStream = null;
  /** 本地屏幕共享流 */
  this.localScreenStream = null;
  /** 本地视频小流 */
  this.localMinStream = null;
  /** 远端视频流集合 */
  this.remoteStreams = new BlinkMap();
  /** 远端屏幕共享流集合 */
  this.remoteScreenStreams = new BlinkMap();
  /** ----- Stream信息 ----- */

  /** ----- Track信息 ----- */
  /** 本地音频Track */
  this.localAudioTrack = null;
  /** 本地视频Track */
  this.localVideoTrack = null;
  /** 本地屏幕共享视频Track */
  this.localScreenVideoTrack = null;
  /** 本地Track的操作方式, true表示start/stop, false表示enable, 订阅分发版本开始支持start/stop */
  this.isStartStopLocalTrack = true;
  /** ----- Track信息 ----- */

  /** 连接集合 */
  this.peerConnections = {};
  /** 连接的用户集合 */
  this.joinedUsers = new BlinkMap();
  /** remote cname Map */
  this.remoteCnameMap = new BlinkMap();
  /** remote Sdp Map */
  this.remoteSdpMap = new BlinkMap();
  /** remote trackId Map */
  this.remoteTrackIdMap = new BlinkMap();

  /** ----- 连接信息 ----- */
  /** keepAlive连续失败次数计数器 */
  this.keepAliveFailedTimes = 0;
  /** keepAlive间隔 */
  this.keepAliveInterval = null;
  /** keepAlive未收到result计时 */
  this.keepAliveTimerCount = 0;
  /** keepAlive未收到result计时器 */
  this.keepAliveTimer = null;
  /** reconnect连续次数计数器 */
  this.reconnectTimes = 0;
  /** csequence */
  this.csequence = 0;
  /** websocket对象 */
  this.signaling = null;
  /** websocket消息队列 */
  this.wsQueue = [];
  /** websocket连接状态, true:已连接, false:未连接 */
  this.wsConnectionState = null;
  /** websocket是否强制关闭：true:是, false不是 */
  this.wsForcedClose = false;
  /** websocket是否需要重连：true:是, false不是 */
  this.wsNeedConnect = true;
  /** websocket地址列表 */
  this.wsUrlList = [];
  /** websocket地址索引 */
  this.wsUrlIndex = 0;
  // 设置websocket nav url
  this.wsNavUrl = wsNavUrl;
  /** ----- 连接信息 ----- */

  /** ----- 房间信息 ----- */
  /** 会议ID */
  this.channelId = null;
  /** token */
  this.token = null;
  /** 纯音频 */
  this.isAudioOnly = false;
  /** 本地音频开关 */
  this.localAudioEnable = true;
  /** 本地视频开关 */
  this.localVideoEnable = true;
  /** 远端音频开关 */
  this.remoteAudioEnable = true;
  /** logonAndJoin status 登录类型，第一次登录加入房间传0，断线重连传1 */
  this.logonAndJoinStatus = null;
  /** offer status */
  this.offerStatus = null;
  /** 白板url */
  this.ewbUrl = '';
  /** ----- 房间信息 ----- */

  /** ----- 用户信息 ----- */
  this.userId;
  this.userType = BlinkConstant.UserType.NORMAL;
  this.talkType = BlinkConstant.TalkType.All;
  this.userName;
  /** 订阅分发 */
  this.care = BlinkConstant.CareType.All;
  this.resource = BlinkConstant.ResourceType.AudioAndVideo;
  this.defaultSub = BlinkConstant.SubscribeType.AudioAndVideo;
  this.specialSubs = [];
  /** ----- 用户信息 ----- */

  /** ----- 视频参数 ----- */
  /** media config */
  this.mediaConfig = {
      video: BlinkConstant.VideoProfile_default,
      audio: true
  }
  /** bandwidth */
  this.videoMaxRate = BlinkConstant.BandWidth_default.max;
  this.videoMinRate = BlinkConstant.BandWidth_default.min;
  this.bandWidth = {
      min: this.videoMinRate,
      max: this.videoMaxRate
  };
  /** ----- 视频参数 ----- */

  /** ----- StatsReport ----- */
  /** 是否上报丢包率信息 */
  this.isSendLostReport = false;
  /** BlinkConnectionStatsReport */
  this.blinkConnectionStatsReport = null;
  /** getStatsReport间隔 */
  this.getStatsReportInterval = null;
  /** ----- StatsReport ----- */

  /** ----- 屏幕共享 ----- */
  /** 屏幕共享状态 */
  this.screenSharingStatus = false;
  /** 屏幕共享流是否分离 */
  this.isScreenStreamSeparate = false;
  if (this.isScreenStreamSeparate) { // 屏幕共享流分离
    this.defaultSub = BlinkConstant.SubscribeType.AudioAndVideoAndScreenSharing;
  }
  /** ----- 屏幕共享 ----- */
  
  /** ----- 大小流 ----- */
  /** 是否开启小流 */
  this.isEnableMinStream = false; 
  /** ----- 大小流 ----- */
};
/**
* 初始化屏幕共享
* 
*/
BlinkEngine.prototype.initScreenShare = function () {
  // 绑定插件监听事件
  this.addEventListener();
  // 检测插件
  setTimeout(function () {
      window.postMessage('test', '*');
  }, 1000);
}
/**
* reset
*
*/
BlinkEngine.prototype.reset = function () {

}
/**
* clear
*
*/
BlinkEngine.prototype.clear = function () {
  this.exitScheduleKeepAlive();
  this.exitScheduleKeepAliveTimer();
  this.disconnect(false);
  this.closePeerConnection(this.userId);
}
/** ----- 提供能力 ----- */
/**
* 获取Blink SDK版本号
*
* @return sdkversion
*/
BlinkEngine.prototype.getSDKVersion = function () {
  return BlinkConstant.SDK_VERSION_NAME;
}
/**
* 设置BlinkEngineEventHandle监听
*
*/
BlinkEngine.prototype.setBlinkEngineEventHandle = function (blinkEngineEventHandle) {
  this.blinkEngineEventHandle = blinkEngineEventHandle;
}
/**
* 设置视频参数
*
*/
BlinkEngine.prototype.setVideoParameters = function (config) {
  if (config.USER_TYPE != null && config.USER_TYPE == BlinkConstant.UserType.OBSERVER) {
      this.userType = BlinkConstant.UserType.OBSERVER;
  }
  if (config.IS_AUDIO_ONLY != null) {
      this.isAudioOnly = config.IS_AUDIO_ONLY;
  }
  if (config.IS_CLOSE_VIDEO != null) {
      this.localVideoEnable = !config.IS_CLOSE_VIDEO;
  }
  if (config.VIDEO_PROFILE != null) {
      /** media config */
      this.mediaConfig.video = config.VIDEO_PROFILE;
  }
  /** bandwidth */
  if (config.VIDEO_MAX_RATE != null) {
      this.videoMaxRate = config.VIDEO_MAX_RATE;
      this.bandWidth.max = this.videoMaxRate;
  } else if (config.VIDEO_PROFILE.width != null && config.VIDEO_PROFILE.height != null) {
      var bandWidth_resulotion = BlinkConstant["BandWidth_" + config.VIDEO_PROFILE.width + "_" + config.VIDEO_PROFILE.height]
      if (bandWidth_resulotion != null) {
          this.videoMaxRate = bandWidth_resulotion.max;
          this.bandWidth.max = this.videoMaxRate;
      }
  }
  if (config.VIDEO_MIN_RATE != null) {
      this.videoMinRate = config.VIDEO_MIN_RATE;
      this.bandWidth.min = this.videoMinRate;
  } else if (config.VIDEO_PROFILE.width != null && config.VIDEO_PROFILE.height != null) {
      var bandWidth_resulotion = BlinkConstant["BandWidth_" + config.VIDEO_PROFILE.width + "_" + config.VIDEO_PROFILE.height]
      if (bandWidth_resulotion != null) {
          this.videoMinRate = bandWidth_resulotion.min;
          this.bandWidth.min = this.videoMinRate;
      }
  }

  if (this.userType == BlinkConstant.UserType.OBSERVER) { // 观察者
    this.talkType = BlinkConstant.TalkType.None;
    this.resource = BlinkConstant.ResourceType.None;
  } else {
    this.talkType = this.localVideoEnable ? BlinkConstant.TalkType.All : BlinkConstant.TalkType.OnlyAudio;
    this.resource = this.localVideoEnable ? BlinkConstant.ResourceType.AudioAndVideo : BlinkConstant.ResourceType.AudioOnly;
  }
}
/**
* 列举 麦克风  摄像头
* @return audioState ：0 没有麦克风 1 有 ；videoState 0 没有摄像头 1 有
*/
// BlinkEngine.prototype.audioVideoState = async function () {
//   // 列举设备 audioState  videoState
//   let audioState = 0;
//   let videoState = 0;
//   let audioAuthorized = 0;
//   let videoAuthorized = 0;
//   await navigator.mediaDevices.enumerateDevices().then(function (deviceInfos) {
//       let deviceArr = deviceInfos.map(function(deviceInfo, index) {
//           return deviceInfo.kind;
//       })
//       deviceArr.forEach(function(kind) {
//           if (kind.indexOf('video') > -1)
//               videoState = 1;
//           if (kind.indexOf('audio') > -1)
//               audioState = 1;
//       })
//   });
//   if (videoState) {
//       await  navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(function(data)  {
//           videoAuthorized = 1;
//       }).catch(function(error)  {
//           if (error.name == 'PermissionDeniedError')
//               videoAuthorized = 0;
//       })

//   }
//   if (audioState) {
//       await  navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(function(data)  {
//           audioAuthorized = 1;
//       }).catch(function(error)  {
//           if (error.name == 'PermissionDeniedError')
//               audioAuthorized = 0;
//       })
//   }
//   return {
//       audioState: audioState,
//       audioAuthorized: audioAuthorized,
//       videoState: videoState,
//       videoAuthorized: videoAuthorized
//   }
// }
/**
* 加入会议
*
*/
BlinkEngine.prototype.joinChannel = function (channelId, userId, token, userName) {
  this.channelId = BlinkConstant.ConnectionType.MEDIASERVER + channelId;
  this.userId = userId;
  this.token = token;
  this.userName = userName;
  // 创建本地视频
  if (this.userType == BlinkConstant.UserType.OBSERVER) { // 观察者模式
    this.localStream = new MediaStream();
    // 创建websocket连接
    this.createSignaling();
    this.logonAndJoin(BlinkConstant.LogonAndJoinStatus.CONNECT);
      return;
  }
  var blinkEngine = this;
  var mediaConfig;
  if (this.isSubscribeVersion()) { // 订阅分发版本
    mediaConfig = this.getMediaConfig(this.localVideoEnable, this.localAudioEnable);
  } else {
    mediaConfig = this.getMediaConfig(true, true);
  }
  BlinkUtil.getMedia(mediaConfig).then(function (stream) {
    console.info(new Date(), "joinChannel navigator.getUserMedia success");
    blinkEngine.setLocalStream(stream);
      // 创建websocket连接
      blinkEngine.createSignaling();
      blinkEngine.logonAndJoin(BlinkConstant.LogonAndJoinStatus.CONNECT);
  }).catch(function (error) {
    console.error(new Date(), "joinChannel navigator.getUserMedia error: ", error);
  });
  if (this.isEnableMinStream) { // 开启了小流
    var minMediaConfig = this.getMinMediaConfig();
    BlinkUtil.getMedia(minMediaConfig, function (stream) {
          console.info(new Date(), "joinChannel navigator.getMinUserMedia success");
          blinkEngine.localMinStream = stream;
    }).catch(function (error) {
        console.error(new Date(), "joinChannel navigator.getMinUserMedia error: ", error);
      });
  }
};
/**
* 离开会议
*
*/
BlinkEngine.prototype.leaveChannel = function () {
  this.leave();
}
/**
* 获取本地视频视图
* @Deprecated
*
*/
BlinkEngine.prototype.getLocalVideoView = function () {
  return this.getLocalStream();
};
/**
* 获取远端视频视图
* @Deprecated
*
*/
BlinkEngine.prototype.getRemoteVideoView = function (userId) {
  return this.getRemoteStream(userId);
};
/**
* 获取本地视频流/屏幕共享流
*
*/
BlinkEngine.prototype.getLocalStream = function (videoType) {
if (videoType == BlinkConstant.VideoType.SCREEN) { // 屏幕共享流
  return this.getLocalScreenStream();
}
  return this.localStream;
};
/**
* 获取本地屏幕共享流
* 
*/
BlinkEngine.prototype.getLocalScreenStream = function () {
  return this.localScreenStream;
};
/**
* 获取远端视频流/屏幕共享流
*
*/
BlinkEngine.prototype.getRemoteStream = function (userId, videoType) {
if (videoType == BlinkConstant.VideoType.SCREEN) { // 屏幕共享流
  return this.remoteScreenStreams.get(userId);
}
return this.remoteStreams.get(userId);
};
/**
* 创建本地视频视图
*
*/
BlinkEngine.prototype.createLocalVideoView = function (videoType) {
  var localVideoView = this.createVideoView();
  // ID
  if (videoType == BlinkConstant.VideoType.SCREEN) { // 屏幕共享流
    localVideoView.id = this.userId + BlinkConstant.StreamSuffix.SCREEN;
  } else {
    localVideoView.id = this.userId;
  }
  // 本地视频静音
  localVideoView.muted = true;
  // 附加视频流
  localVideoView.srcObject = this.getLocalStream(videoType);
  return localVideoView;
};
/**
* 创建远端视频视图
* 
*/
BlinkEngine.prototype.createRemoteVideoView = function (userId, videoType) {
  var remoteVideoView = this.createVideoView();
  // ID
  if (videoType == BlinkConstant.VideoType.SCREEN) { // 屏幕共享流
    remoteVideoView.id = userId + BlinkConstant.StreamSuffix.SCREEN;
  } else {
    remoteVideoView.id = userId;
  }
  // 附加视频流
  remoteVideoView.srcObject = this.getRemoteStream(userId, videoType);;
  return remoteVideoView;
};
/**
* 关闭/打开麦克风, true:关闭, false:打开
* @Deprecated
*/
BlinkEngine.prototype.muteMicrophone = function (isMute) {
console.info(new Date(), "Microphone mute=" + isMute);
this.controlAudioVideoDevice(BlinkConstant.DeviceType.Microphone, !isMute);
}
/**
* 关闭/打开本地摄像头, true:关闭, false:打开
* @Deprecated
*/
BlinkEngine.prototype.closeLocalVideo = function (isCameraClose) {
console.info(new Date(), "Local video close=" + isCameraClose);
this.controlAudioVideoDevice(BlinkConstant.DeviceType.Camera, !isCameraClose);
}
/**
* 打开/关闭本地音频/视频
*
*/
BlinkEngine.prototype.controlAudioVideoDevice = function (deviceType, isOpen) {
if (this.isSubscribeVersion()) { // 订阅分发版本
  var operationType = isOpen ? BlinkConstant.OperationType.OPEN : BlinkConstant.OperationType.CLOSE;
  var resource = this.convertResource(this.resource, deviceType, operationType);
  this.updateResource(resource);
} else {
  // 变更talkType
  this.changeTalkType(this.userId, deviceType, isOpen);
  // 发送信令
  var index = isOpen ? BlinkConstant.OperationType.OPEN : BlinkConstant.OperationType.CLOSE;
  this.turnTalkType(deviceType, index);
}
}
/**
* 关闭本地媒体流（视频流和音频流）
*
*/
BlinkEngine.prototype.closeLocalStream = function () {
// 本地视频流
if (this.localAudioTrack) {
  this.localAudioTrack.stop();
}
if (this.localVideoTrack) {
  this.localVideoTrack.stop();
}
  if (this.localStream && this.localStream.getTracks()) {
      this.localStream.getTracks().forEach(function(track) {
        track.stop();
      });
  }
  // 屏幕共享流
  if (this.localScreenVideoTrack) {
    this.localScreenVideoTrack.stop();
  }
  if (this.localScreenStream && this.localScreenStream.getTracks()) {
      this.localScreenStream.getTracks().forEach(function(track) {
        track.stop();
      });
  }
  // 小流
  if (this.isEnableMinStream && this.localMinStream) {
    if (this.localMinStream && this.localMinStream.getTracks()) {
        this.localMinStream.getTracks().forEach(function(track) {
          track.stop();
        });
    }
  }
}
/**
* 关闭/打开远端声音, true:关闭, false:打开
*
*/
BlinkEngine.prototype.closeRemoteAudio = function (isAudioClose) {
console.info(new Date(), "Remote audio close=" + isAudioClose);
this.remoteAudioEnable = !isAudioClose;
  if (this.remoteStreams && this.remoteStreams.getEntrys()) {
    this.remoteStreams.getEntrys().forEach(function(remoteStreamEntry) {
      if (remoteStreamEntry) {
        var remoteStream = remoteStreamEntry.value;
        if (remoteStream && remoteStream.getAudioTracks()) {
          remoteStream.getAudioTracks().forEach(function(track) {
            track.enabled = !isAudioClose
          });
        }
      }
    });
  }
}
/** ----- 白板能力 ----- */
/**
* 请求白板页面 HTTP URL
*
*/
BlinkEngine.prototype.requestWhiteBoardURL = function () {
  this.ewbCreate();
}
/**
* 查询白板
*
*/
BlinkEngine.prototype.queryWhiteBoard = function () {
if (this.ewbUrl != null && this.ewbUrl != '') {
  this.blinkEngineEventHandle.call('onWhiteBoardQuery', {
        'isSuccess': true,
        'url': this.ewbUrl
    });
} else {
  this.ewbQuery();
}
}
/** ----- 白板能力 ----- */
/**
* 设置是否上报丢包率信息
*
*/
BlinkEngine.prototype.enableSendLostReport = function (enable) {
  this.isSendLostReport = enable
}
/** ----- 屏幕共享能力 ----- */
/**
* 设置屏幕共享流是否分离
* 
*/
BlinkEngine.prototype.setScreenStreamSeparate = function (isScreenStreamSeparate) {
this.isScreenStreamSeparate = isScreenStreamSeparate;
if (this.isScreenStreamSeparate) { // 屏幕共享流分离
    this.defaultSub = BlinkConstant.SubscribeType.AudioAndVideoAndScreenSharing;
  } else {
    this.defaultSub = BlinkConstant.SubscribeType.AudioAndVideo;
  }
}
/**
* 开启屏幕共享
*
*/
BlinkEngine.prototype.startScreenShare = function (stream) {
  if (stream) { // rce electron 直接可以获取屏幕流 不安装插件
      this.screenShareWithStream(stream);
  } else {
    // 检查是否支持
    var screenShareSupportStatus = this.checkScreenShareSupport();
    if (screenShareSupportStatus != 0) { // 不支持
      this.blinkEngineEventHandle.call('onStartScreenShareComplete', {
              'isSuccess': false,
              'code': screenShareSupportStatus
          });
          return;
    }
      // 发起屏幕共享
      this.requestScreenShare();
  }
}
/**
* 关闭屏幕共享
*
*/
BlinkEngine.prototype.stopScreenShare = function () {
//	if (this.isScreenStreamSeparate) { // 屏幕共享流分离
//		// stop后会关闭弹出的屏幕共享工具条
//		this.localScreenStream.getVideoTracks()[0].stop();
//		this._stopScreenShare();
//	} else {
//	    var blinkEngine = this;
//		var mediaConfig = this.getMediaConfig(true, false);
//		BlinkUtil.getMedia(mediaConfig).then(function (stream) {
//			// 移除原屏幕共享流videoTrack
//			var oldVideoTrack = blinkEngine.localStream.getVideoTracks()[0];
//		    oldVideoTrack.stop();
//			blinkEngine.localStream.removeTrack(oldVideoTrack);
//		    // 将视频流videoTrack加入到流中
//			blinkEngine.localStream.addTrack(stream.getVideoTracks()[0]);
//			// // 刷新本地视频窗口的流
//			// BlinkUtil.setMediaStream(blinkEngine.userId, blinkEngine.localStream);
//			
//			blinkEngine._stopScreenShare();
//	    }).catch(function (error) {
//	        console.error(new Date(), "stopScreenShare getMedia error: " + error);
//	        blinkEngine.blinkEngineEventHandle.call('onStopScreenShareComplete', {
//	            'isSuccess': false
//	        });
//	    });
//	}
if (this.localScreenVideoTrack) {
  // 移除screenVideoTrack
  if (this.isScreenStreamSeparate) { // 屏幕共享流分离
    this.localScreenStream.removeTrack(this.localScreenVideoTrack);
  } else {
    this.localStream.removeTrack(this.localScreenVideoTrack);
  }
  // stop后会关闭弹出的屏幕共享工具条
  this.localScreenVideoTrack.stop();
  this.localScreenVideoTrack = null;
}
if (this.isScreenStreamSeparate) { // 屏幕共享流分离
  
} else {
  if (this.isSubscribeVersion() && this.isStartStopLocalTrack) { // 订阅分发版本且是start/stop track
    if (this.localVideoEnable) { // 原视频是enable的
      var blinkEngine = this;
      var callback = function(blinkEngine) {
        blinkEngine._stopScreenShare();
      }
      this.startLocalTrack(BlinkConstant.DeviceType.Camera, callback);
      return;
    }
    } else {
      // 将视频流videoTrack加入到流中
      if (this.localVideoTrack) {
        this.localStream.addTrack(this.localVideoTrack);
      }
      // // 刷新本地视频窗口的流
      // BlinkUtil.setMediaStream(this.userId, this.localStream);
    }
}
this._stopScreenShare();
}
/** ----- 屏幕共享能力 ----- */
/** ----- 会控能力 ----- */
/**
* 主持人调用发起, 将正常用户降级为观察者
* 
*/
BlinkEngine.prototype.degradeNormalUserToObserver = function (userId) {
if (this.isSubscribeVersion()) { // 订阅分发版本
  var subscribeInfo = {
    'userId': userId,
    'userType': BlinkConstant.UserType.OBSERVER
  }
  var subscribeInfos = new Array();
  subscribeInfos.push(subscribeInfo);
  this.manageResourceSubscribe(false, subscribeInfos);
} else {
  this.roleChange(userId, BlinkConstant.MeetingActionType.RoleChange.DegradeToObserver);
}
}
/**
* 主持人调用发起, 将观察者升级为正常用户(需要被操作的观察者应答)
* 
*/
BlinkEngine.prototype.upgradeObserverToNormalUser = function (userId) {
if (this.isSubscribeVersion()) { // 订阅分发版本
  var subscribeInfo = {
    'userId': userId,
    'userType': BlinkConstant.UserType.NORMAL
  }
  var subscribeInfos = new Array();
  subscribeInfos.push(subscribeInfo);
  this.manageResourceSubscribe(false, subscribeInfos);
} else {
  this.roleChange(userId, BlinkConstant.MeetingActionType.RoleChange.UpgradeToNormal);
}
}
/**
* 主持人调用, 移除与会人员
* 
*/
BlinkEngine.prototype.removeUser = function (userId) {
  this.roleChange(userId, BlinkConstant.MeetingActionType.RoleChange.RemoveUser);
}
/**
* 观察者调用, 请求发言(需要主持人应答)
* 
*/
BlinkEngine.prototype.observerRequestBecomeNormalUser = function () {
if (this.isSubscribeVersion()) { // 订阅分发版本
  var subscribeInfo = {
    'userId': this.userId,
    'userType': BlinkConstant.UserType.NORMAL
  }
  var subscribeInfos = new Array();
  subscribeInfos.push(subscribeInfo);
  this.manageResourceSubscribe(true, subscribeInfos);
} else {
  this.apply(BlinkConstant.MeetingActionType.Apply.RequestUpgradeToNormal);
}
}
/**
* 与会正常用户调用, 请求获取主持人权限
* 
*/
BlinkEngine.prototype.normalUserRequestHostAuthority = function () {
this.apply(BlinkConstant.MeetingActionType.Apply.GetHostAuthority);
}
/**
* 任何与会人员调用, 已在房间里的用户获取邀请链接
* 
*/
BlinkEngine.prototype.getInviteURL = function () {
this.apply(BlinkConstant.MeetingActionType.Apply.GetInviteUrl);
}
/**
* 主持人调用, 操作与会人员麦克风/摄像头的打开/关闭(当打开设备时, 需要被操作人应答; 关闭设备时不需要应答直接关闭)
*
*/
BlinkEngine.prototype.hostControlUserDevice = function (userId, deviceType, isOpen) {
if (this.isSubscribeVersion()) { // 订阅分发版本
  var operationType = isOpen ? BlinkConstant.OperationType.OPEN : BlinkConstant.OperationType.CLOSE;
  var user = this.joinedUsers.get(userId);
  var oldResource = user.resource;
  var resource = this.convertResource(oldResource, deviceType, operationType);
  var subscribeInfo = {
    'userId': userId,
    'resource': resource
  }
  var subscribeInfos = new Array();
  subscribeInfos.push(subscribeInfo);
  this.manageResourceSubscribe(false, subscribeInfos);
} else {
  this.manageAction(userId, deviceType, isOpen ? BlinkConstant.OperationType.OPEN : BlinkConstant.OperationType.CLOSE);
}
}
/**
* 主持人邀请观察者升级成正常用户时, 观察者的应答调用
*
*/
BlinkEngine.prototype.answerUpgradeObserverToNormalUser = function (hostId, isAccept, subscribeInfo) {
var status = isAccept ? BlinkConstant.MeetingAnswerType.Accept : BlinkConstant.MeetingAnswerType.Deny;
if (this.isSubscribeVersion()) { // 订阅分发版本
  this.answerManageResource(false, hostId, status, subscribeInfo);
} else {
  this.channelAnswer(hostId, BlinkConstant.MeetingActionType.ChannelAnswer.UpgradeToNormal, null, status);
}
//	if (isAccept) {
//		// 变更为普通与会人员
//		this.change2Normal(this.userId);
//	}
}
/**
* 观察者向主持人申请升级成正常用户时, 主持人的应答调用
*
*/
BlinkEngine.prototype.answerObserverRequestBecomeNormalUser = function (userId, isAccept, subscribeInfo) {
var status = isAccept ? BlinkConstant.MeetingAnswerType.Accept : BlinkConstant.MeetingAnswerType.Deny;
if (this.isSubscribeVersion()) { // 订阅分发版本
  this.answerManageResource(true, userId, status, subscribeInfo);
} else {
  this.channelAnswer(userId, BlinkConstant.MeetingActionType.ChannelAnswer.RequestUpgradeToNormal, null, status);
}
//	if (isAccept) {
//		// 变更为普通与会人员
//		this.change2Normal(userId);
//	}
}
/**
* 主持人把正常用户降级为观察者时, 用户的应答调用
*
*/
BlinkEngine.prototype.answerDegradeNormalUserToObserver = function (hostId, isAccept, subscribeInfo) {
var status = isAccept ? BlinkConstant.MeetingAnswerType.Accept : BlinkConstant.MeetingAnswerType.Deny;
if (this.isSubscribeVersion()) { // 订阅分发版本
  this.answerManageResource(false, hostId, status, subscribeInfo);
} else {
  this.channelAnswer(hostId, BlinkConstant.MeetingActionType.ChannelAnswer.DegradeToObserver, null, status);
}
//	if (isAccept) {
//		// 变更为观察者
//		this.change2Observer(this.userId);
//	}
}
/**
* 麦克风/摄像头被主持人打开时, 被打开人的应答调用
*
*/
BlinkEngine.prototype.answerHostControlUserDevice = function (hostId, deviceType, isOpen, isAccept, subscribeInfo) {
  var status = isAccept ? BlinkConstant.MeetingAnswerType.Accept : BlinkConstant.MeetingAnswerType.Deny;
  if (this.isSubscribeVersion()) { // 订阅分发版本
    this.answerManageResource(false, hostId, status, subscribeInfo);
//    	
//    	var resource = subscribeInfo.resource;
//    	var oldResource = this.resource;
//		var operation = this.convertOperation(oldResource, resource);
//		var deviceType = operation.deviceType;
//		var operationType = operation.operationType;
//		var isOpen = operationType == BlinkConstant.OperationType.OPEN ? true : false;
//      if (isAccept) {
//        	// 变更资源
//        	this._updateResource(resource);
//      }
  } else {
    var index = isOpen ? BlinkConstant.MeetingActionType.ChannelAnswer.InviteToOpen : BlinkConstant.MeetingActionType.ChannelAnswer.InviteToClose;
    this.channelAnswer(hostId, index, deviceType, status);
//    	if (isAccept) {
//			// 变更talkType
//			this.changeTalkType(this.userId, deviceType, isOpen);
//    	}
  }
}
/** ----- 会控能力 ----- */
/** ----- 大小流能力 ----- */
/**
* 大小流订阅
* 
*/
BlinkEngine.prototype.subscribeStream = function(flowSubscribes) {
this.flowSubscribe(JSON.stringify(flowSubscribes));
}
/** ----- 大小流能力 ----- */
/** ----- 订阅分发能力 ----- */
/**
* 变更资源
*
*/
BlinkEngine.prototype.updateResource = function(resource) {
// 发信令
this.update_resource(resource);
// 变更资源
this._updateResource(resource);
}
/**
* 变更订阅
* 
*/
BlinkEngine.prototype.updateSubscribe = function(defaultSub, specialSubs) {
this.defaultSub = defaultSub;
this.specialSubs = specialSubs;
  this.update_subscribe(defaultSub, specialSubs);
}
/**
* 自己申请修改自己的资源订阅或主持人修改其他人的资源订阅
* 
*/
BlinkEngine.prototype.manageResourceSubscribe = function(isApply, subscribeInfos) {
var index = isApply ? BlinkConstant.ManageType.Apply : BlinkConstant.ManageType.Manage;
this.manage_update_resource_subscribe(index, subscribeInfos);
}
/**
* 管理资源发布状态信令的应答
* 
*/
BlinkEngine.prototype.answerManageResource = function(isApply, userId, status, subscribeInfo) {
var index = isApply ? BlinkConstant.ManageType.Apply : BlinkConstant.ManageType.Manage;
this.manage_answer_update_resource(index, userId, status, subscribeInfo);
}
/**
* 管理资源订阅状态信令的应答
* 
*/
BlinkEngine.prototype.answerManageSubscribe = function(isApply, userId, status, subscribeInfo) {
var index = isApply ? BlinkConstant.ManageType.Apply : BlinkConstant.ManageType.Manage;
this.manage_answer_update_subscribe(index, userId, status, subscribeInfo);
}
/** ----- 订阅分发能力 ----- */
/** ----- 提供能力 ----- */
/** ----- websocket ----- */
/**
* 创建WebSocket对象
*
*/
BlinkEngine.prototype.createSignaling = function () {
  // ws正在连接
  this.wsConnectionState = BlinkConstant.wsConnectionState.CONNECTING;
  if (this.wsUrlList.length > 0) { // 已取得websocket连接地址
      this.wsUrlIndex++;
      if (this.wsUrlIndex > this.wsUrlList.length - 1) {
          this.wsUrlIndex = 0;
      }
      var url = this.wsUrlList[this.wsUrlIndex];
      this.createSignalingWithUrl(url);
  } else { // 还没有取得websocket连接地址
      var blinkEngine = this;
      BlinkUtil.getWsUrlList(this.wsNavUrl, function (data) {
          var wsUrlList = data;
          if (wsUrlList.length < 1) {
              throw new Error("websocket连接失败!");
          }
          blinkEngine.wsUrlList = BlinkUtil.shuffle(wsUrlList);
          var url = blinkEngine.wsUrlList[0];
          blinkEngine.createSignalingWithUrl(url);
      });
  }
};
/**
* 创建WebScoket对象
*
*/
BlinkEngine.prototype.createSignalingWithUrl = function (url) {
  var blinkEngine = this;
  blinkEngine.signaling = new WebSocket('wss://' + url + '/signaling');
  blinkEngine.signaling.onopen = function () {
      blinkEngine.onOpen();
  };
  blinkEngine.signaling.onmessage = function (ev) {
      blinkEngine.onMessage(ev);
  };
  blinkEngine.signaling.onerror = function (ev) {
      blinkEngine.onError(ev);
  };
  blinkEngine.signaling.onclose = function (ev) {
      blinkEngine.onClose(ev);
  };
};
/**
* BlinkMessage实体
*
* @param signal
* @param content
* @param parameters
* @returns
*/
var BlinkMessage = function (signal, content, parameters, bodys) {
  this.signal = signal;
  this.content = content;
  this.parameters = parameters;
  if (bodys != null && bodys.length > 0) {
    this.bodys = bodys;
  }
};
/**
* 发送消息
*
*/
BlinkEngine.prototype.sendMsg = function (signal, msgBody, parameters, bodys) {
  this.csequence++;
  parameters.csequence = this.csequence;
  var message = new BlinkMessage(signal, msgBody, parameters, bodys);
  this.send(message);
};
/**
* 发送消息
*
*/
BlinkEngine.prototype.send = function (message) {
var signal = message.signal;
  if (this.wsConnectionState == BlinkConstant.wsConnectionState.CONNECTED) { // ws连接可用
      if (signal == BlinkConstant.SignalType.CHANNEL_PING) { // channelPing记录debug日志
          console.debug(new Date(), "req: ", message);
      } else {
          console.info(new Date(), "req: ", message);
      }
      message = JSON.stringify(message);
      this.signaling.send(message);
  } else { // websocket不可用
      console.warn(new Date(), "websocket not connected!");
      if (this.wsQueue.length == 0 // 消息队列只保留一条logonAndJoin
          && signal == BlinkConstant.SignalType.LOGONANDJOIN) { // logonAndJoin
          // 加入消息队列
          this.wsQueue.push(message);
      }
  }
};
/**
* 发送队列中的消息
* 
*/
BlinkEngine.prototype.doWsQueue = function () {
  if (this.wsQueue.length > 0) {
      // 消息队列只有一条logonAndJoin，取出并删除
      var message = this.wsQueue.shift();
      this.send(message);
  }
};
/**
* onOpen
*
*/
BlinkEngine.prototype.onOpen = function () {
  console.info(new Date(), 'websocket open');
  // ws连接可用
  this.wsConnectionState = BlinkConstant.wsConnectionState.CONNECTED;
  // 重置reconnectTimes
  this.reconnectTimes = 0;
  // websocket可用后，发送队列中的消息
  this.doWsQueue();
}
/**
* onMessage
*
*/
BlinkEngine.prototype.onMessage = function (ev) {
  var data = JSON.parse(ev.data);
  if (data.signal == BlinkConstant.SignalType.CHANNEL_PING_RESULT) { // channelPing_result记录debug日志
      console.debug(new Date(), "res: ", data);
  } else {
      console.info(new Date(), "res: ", data);
  }
  switch (data.signal) {
    /** 应答信令 */
      case BlinkConstant.SignalType.LOGONANDJOIN_RESULT:
          this.logonAndJoin_result(data);
          return;
      case BlinkConstant.SignalType.CHANNEL_PING_RESULT:
          this.channelPing_result(data);
          return;
      case BlinkConstant.SignalType.LEAVE_RESULT:
          this.leave_result(data);
          return;
      case BlinkConstant.SignalType.TURNTALKTYPE_RESULT:
          this.turnTalkType_result(data);
          return;
      /** 通知信令 */
      case BlinkConstant.SignalType.JOINED:
          this.joined(data);
          return;
      case BlinkConstant.SignalType.LEFT:
          this.left(data);
          return;
      case BlinkConstant.SignalType.OFFER_REQUEST:
          this.offerRequest(data);
          return;
      case BlinkConstant.SignalType.UPDATETALKTYPE_NOTIFY:
          this.updateTalktype_notify(data);
          return;
      case BlinkConstant.SignalType.TURNTALKTYPE_NOTIFY:
          this.turnTalktype_notify(data);
          return;
      case BlinkConstant.SignalType.SCREENSHARING_NOTIFY:
        this.screenSharing_notify(data);
          return;
      /** exchange信令 */
      case BlinkConstant.SignalType.EXCHANGE:
          this.exchange(data);
          return;
      /** 白板信令 */
      case BlinkConstant.SignalType.EWBCREATE_RESULT:
          this.ewbCreate_result(data);
          return;
      case BlinkConstant.SignalType.EWBQUERY_RESULT:
          this.ewbQuery_result(data);
          return;
      case BlinkConstant.SignalType.EWBCREATE_NOTIFY:
          this.ewbCreate_notify(data);
          return;
      /** 会控信令 */
      // rolechange
      case BlinkConstant.SignalType.ROLECHANGE_RESULT:
          this.roleChange_result(data);
          return;
      case BlinkConstant.SignalType.ROLECHANGE_NOTIFY:
          this.roleChange_notify(data);
          return;
      // apply
      case BlinkConstant.SignalType.APPLY_RESULT:
          this.apply_result(data);
          return;
      case BlinkConstant.SignalType.APPLY_NOTIFY:
          this.apply_notify(data);
          return;
      // manageaction
      case BlinkConstant.SignalType.MANAGEACTION_RESULT:
          this.manageAction_result(data);
          return;
      case BlinkConstant.SignalType.MANAGEACTION_NOTIFY:
          this.manageAction_notify(data);
          return;
      // channelanswer
      case BlinkConstant.SignalType.CHANNELANSWER_RESULT:
          this.channelAnswer_result(data);
          return;
      case BlinkConstant.SignalType.CHANNELANSWER_NOTIFY:
          this.channelAnswer_notify(data);
          return;
      /** 订阅分发信令 */
      // update_resource
      case BlinkConstant.SignalType.UPDATE_RESOURCE_RESULT:
        this.update_resource_result(data);
        return;
      case BlinkConstant.SignalType.UPDATE_RESOURCE_NOTIFY:
        this.update_resource_notify(data);
        return;
      // update_subscribe
      case BlinkConstant.SignalType.UPDATE_SUBSCRIBE_RESULT:
        this.update_subscribe_result(data);
        return;
      case BlinkConstant.SignalType.UPDATE_SUBSCRIBE_NOTIFY:
        this.update_subscribe_notify(data);
        return;
      // manage_update_resource_subscribe
      case BlinkConstant.SignalType.MANAGE_UPDATE_RESOURCE_SUBSCRIBE_RESULT:
        this.manage_update_resource_subscribe_result(data);
        return;
      case BlinkConstant.SignalType.MANAGE_UPDATE_RESOURCE_NOTIFY:
        this.manage_update_resource_notify(data);
        return;
      case BlinkConstant.SignalType.MANAGE_UPDATE_SUBSCRIBE_NOTIFY:
        this.manage_update_subscribe_notify(data);
        return;
      // manage_answer_update_resource
      case BlinkConstant.SignalType.MANAGE_ANSWER_UPDATE_RESOURCE_RESULT:
        this.manage_answer_update_resource_result(data);
        return;
      case BlinkConstant.SignalType.MANAGE_ANSWER_UPDATE_RESOURCE_NOTIFY:
        this.manage_answer_update_resource_notify(data);
        return;
      // manage_answer_update_subscribe
      case BlinkConstant.SignalType.MANAGE_ANSWER_UPDATE_SUBSCRIBE_RESULT:
        this.manage_answer_update_subscribe_result(data);
        return;
      case BlinkConstant.SignalType.MANAGE_ANSWER_UPDATE_SUBSCRIBE_NOTIFY:
        this.manage_answer_update_subscribe_notify(data);
        return;
      default:
          console.debug(new Date(), data);
  }
};
/**
* onClose
*
*/
BlinkEngine.prototype.onClose = function (ev) {
  var blinkEnv = this;
  console.warn(new Date(), 'websocket close', ev);
  if (ev.code == 1000 && ev.reason == 'wsForcedClose') { // 如果自定义关闭ws连接，避免二次重连
      return;
  }
  // ws连接不可用
  this.wsConnectionState = BlinkConstant.wsConnectionState.DISCONNECTED;
  if (this.wsNeedConnect) { // ws需要重连
      setTimeout(function () {
          blinkEnv.reconnect()
      }, BlinkConstant.RECONNECT_TIMEOUT)
  }
};
/**
* onError
*
*/
BlinkEngine.prototype.onError = function (ev) {
  console.error(new Date(), 'websocket error', ev);
};
/**
* disconnect
*
*/
BlinkEngine.prototype.disconnect = function (wsNeedConnect) {
  console.warn(new Date(), 'websocket disconnect');
  console.warn(new Date(), 'wsNeedConnect=' + wsNeedConnect);

  this.wsForcedClose = true;
  this.wsNeedConnect = wsNeedConnect;
  this.wsConnectionState = BlinkConstant.wsConnectionState.DISCONNECTED;
  // 自定义关闭ws连接
  this.signaling.close(1000, 'wsForcedClose');
  // 网断后，执行close方法后不会立即触发onclose事件，所以需要手动重连
  if (this.wsNeedConnect) { // ws需要重连
      this.reconnect();
  }
};
/**
* reconnect
*
*/
BlinkEngine.prototype.reconnect = function () {
  if (this.wsConnectionState != BlinkConstant.wsConnectionState.DISCONNECTED) { // ws连接可用或正在连接不重连
      return;
  }
  this.reconnectTimes++;
  console.warn(new Date(), 'reconnectTimes=' + this.reconnectTimes);
  if (this.reconnectTimes > BlinkConstant.RECONNECT_MAXTIMES) {
      this.keepAliveDisconnect();
  } else {
      var blinkEngine = this;
      if (blinkEngine.reconnectTimes > 1) { // 连续重连的话间隔一定时间
          setTimeout(function () {
              reconnectFunc(blinkEngine);
          }, BlinkConstant.RECONNECT_TIMEOUT);
      } else {
          reconnectFunc(blinkEngine);
      }

      function reconnectFunc(blinkEngine) {
          if (blinkEngine.wsConnectionState == BlinkConstant.wsConnectionState.DISCONNECTED) { // ws连接不可用
              console.info(new Date(), 'websocket reconnect');
              blinkEngine.createSignaling();
              // 重新logonAndJoin
              blinkEngine.logonAndJoin(BlinkConstant.LogonAndJoinStatus.RECONNECT);
          }
      }
  }
};
/** ----- websocket ----- */
/** ----- keepAlive ----- */
/**
* keepAlive
*
*/
BlinkEngine.prototype.keepAlive = function () {
  if (this.wsConnectionState == BlinkConstant.wsConnectionState.CONNECTED) { // ws连接可用
      // 开始计时
      this.startScheduleKeepAliveTimer();
      this.channelPing();
  } else {
      this.keepAliveFailed();
  }
}
/**
* keepAlive失败
*
*/
BlinkEngine.prototype.keepAliveFailed = function () {
  this.keepAliveFailedTimes++;
  console.warn(new Date(), "keepAliveFailedTimes=" + this.keepAliveFailedTimes);
  if (this.keepAliveFailedTimes > BlinkConstant.KEEPALIVE_FAILEDTIMES_MAX) {
      this.keepAliveDisconnect();
  }
}
/**
* 开始keepAlive
*
*/
BlinkEngine.prototype.startScheduleKeepAlive = function () {
  this.exitScheduleKeepAlive();
  this.exitScheduleKeepAliveTimer();

  var blinkEngine = this;
  blinkEngine.keepAlive(); // 立即执行1次
  blinkEngine.keepAliveInterval = setInterval(function () {
      blinkEngine.keepAlive();
  }, BlinkConstant.KEEPALIVE_INTERVAL);
}
/**
* 停止keepAlive
*
*/
BlinkEngine.prototype.exitScheduleKeepAlive = function () {
  this.keepAliveFailedTimes = 0;
  if (this.keepAliveInterval != null) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
  }
}
/**
* keepAlive未收到result计时器方法
*
*/
BlinkEngine.prototype.keepAliveTimerFunc = function () {
  this.keepAliveTimerCount++;
  if (this.keepAliveTimerCount > BlinkConstant.KEEPALIVE_TIMER_TIMEOUT_MAX / 3) {
      console.warn(new Date(), "keepAliveTimerCount=" + this.keepAliveTimerCount);
  } else {
      console.debug(new Date(), "keepAliveTimerCount=" + this.keepAliveTimerCount);
  }
  if (this.keepAliveTimerCount > BlinkConstant.KEEPALIVE_TIMER_TIMEOUT_MAX) {
      this.keepAliveDisconnect();
      return;
  }
  if (this.keepAliveTimerCount == BlinkConstant.KEEPALIVE_TIMER_TIMEOUT_RECONNECT) {
      // 断开本次连接，进行重连
      this.disconnect(true);
  }
}
/**
* 开始keepAlive未收到result计时器
*
*/
BlinkEngine.prototype.startScheduleKeepAliveTimer = function () {
  if (this.keepAliveTimer == null) {
      var blinkEngine = this;
      // keepAlive5秒间隔，这个时候有可能已经断了5秒
      blinkEngine.keepAliveTimerCount += BlinkConstant.KEEPALIVE_INTERVAL / 1000;
      blinkEngine.keepAliveTimer = setInterval(function () {
          blinkEngine.keepAliveTimerFunc();
      }, BlinkConstant.KEEPALIVE_TIMER_INTERVAL);
  }
}
/**
* 停止keepAlive未收到result计时器
*
*/
BlinkEngine.prototype.exitScheduleKeepAliveTimer = function () {
  this.keepAliveTimerCount = 0;
  if (this.keepAliveTimer != null) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
  }
}
/**
* 与服务器断开
*
*/
BlinkEngine.prototype.keepAliveDisconnect = function () {
  this.clear();
  this.blinkEngineEventHandle.call('onConnectionStateChanged', {
      'connectionState': BlinkConstant.ConnectionState.DISCONNECTED
  });
}
/** ----- keepAlive ----- */
/** ----- 基本功能 ----- */
/**
* 获取mediaConfig
* 
*/
BlinkEngine.prototype.getMediaConfig = function (isVideoEnable, isAudioEnable) {
var mediaConfig = {
  video: this.mediaConfig.video,
  audio: this.mediaConfig.audio
};
if (!isVideoEnable) {
  mediaConfig.video = false;
}
if (!isAudioEnable) {
  mediaConfig.audio = false;
}
return mediaConfig;
}
/**
* 获取screenMediaConfig
* 
*/
BlinkEngine.prototype.getScreenMediaConfig = function (sourceId) {
var screenMediaConfig = {
  video: {
        mandatory: {
            chromeMediaSource: 'desktop',
            maxWidth: BlinkConstant.ShareProfile_default.width,
            maxHeight: BlinkConstant.ShareProfile_default.height,
            chromeMediaSourceId: sourceId
        },
        optional: [
            {googTemporalLayeredScreencast: true}
        ]
    }
};
return screenMediaConfig;
}
/**
* 获取minMediaConfig
* 
*/
BlinkEngine.prototype.getMinMediaConfig = function () {
var minMediaConfig = {
  video: BlinkConstant.VideoProfile_min,
      audio: false // 小流不需要音频
};
return minMediaConfig;
}
/**
* 设置本地视频流
* 
*/
BlinkEngine.prototype.setLocalStream = function (stream) {
if (this.localStream == null || this.localStream.getTracks().length == 0) {
  this.localStream = stream;
}
// 音频Track
var audioTrack = stream.getAudioTracks()[0];
if (audioTrack) {
  this.localAudioTrack = audioTrack;
}
  // 视频Track
var videoTrack = stream.getVideoTracks()[0];
if (videoTrack) {
  this.localVideoTrack = videoTrack;
}
if (!this.localVideoEnable) {
  this.enableLocalTrack(BlinkConstant.DeviceType.Camera, !this.localVideoEnable);
}
  if (this.isSubscribeVersion()) { // 订阅分发版本
  // 绑定LocalTrack
  this.updateLocalTrackBind(this.resource);
}
};
/**
* 获取远端视频流/屏幕共享流数量
*
*/
BlinkEngine.prototype.getRemoteStreamCount = function () {
  return this.remoteStreams.size() + this.remoteScreenStreams.size();
};
/**
* 创建视频视图
*
*/
BlinkEngine.prototype.createVideoView = function () {
  var videoView = document.createElement('video');
  // 视频自动播放
  videoView.autoplay = true;
  videoView.setAttribute("playsinline", true); // isa
  return videoView;
};
/**
* enable本地音频track
* 
*/
BlinkEngine.prototype.enableLocalAudioTrack = function (enable) {
this.localAudioEnable = enable;
if (this.localAudioTrack) {
    this.localAudioTrack.enabled = enable;
  }
if (this.localStream && this.localStream.getAudioTracks()) {
  this.localStream.getAudioTracks().forEach(function (track) {
    track.enabled = enable;
  });
}
}
/**
* enable本地视频track
* 
*/
BlinkEngine.prototype.enableLocalVideoTrack = function (enable) {
this.localVideoEnable = enable;
if (this.localVideoTrack) {
  this.localVideoTrack.enabled = enable;
}
if (this.localStream && this.localStream.getVideoTracks()) {
  this.localStream.getVideoTracks().forEach(function (track) {
    track.enabled = enable;
  });
}
}
/**
* enable本地音频/视频track
* 
*/
BlinkEngine.prototype.enableLocalTrack = function (deviceType, enable) {
if (deviceType == BlinkConstant.DeviceType.Camera) {
  this.enableLocalVideoTrack(enable);
} else if (deviceType == BlinkConstant.DeviceType.Microphone) {
  this.enableLocalAudioTrack(enable);
} else if (deviceType == BlinkConstant.DeviceType.CameraAndMicrophone) {
  this.enableLocalVideoTrack(enable);
  this.enableLocalAudioTrack(enable);
}
}
/**
* stop屏幕共享视频track
* 
*/
BlinkEngine.prototype.stopLocalScreenVideoTrack = function () {
if (this.localScreenVideoTrack) {
  this.localScreenVideoTrack.stop();
}
if (this.isScreenStreamSeparate) { // 屏幕共享流分离
  if (this.localScreenStream && this.localScreenStream.getVideoTracks()) {
    this.localScreenStream.getVideoTracks().forEach(function (track) {
      track.stop();
    });
  }
} else {
  if (this.localStream && this.localStream.getVideoTracks()) {
    this.localStream.getVideoTracks().forEach(function (track) {
      track.stop();
    });
  }
}
}
/** ----- 基本功能 ----- */
/** ----- offer ----- */
/**
* 建立连接
*
*/
BlinkEngine.prototype.preparePeerConnection = function (userId) {
  console.info(new Date(), "preparePeerConnection userId=" + userId);
  var blinkEngine = this;
  if (blinkEngine.peerConnections[userId] == null) {
      var pc = new RTCPeerConnection();
      pc.onaddstream = function (evt) {
          console.debug(new Date(), "onaddstream", evt);

          var streamId = evt.stream.id;
          var userId = streamId;
          var videoType = BlinkConstant.VideoType.NORMAL;
          if (streamId.lastIndexOf(BlinkConstant.StreamSuffix.SCREEN) != -1) { // 屏幕共享流
            userId = streamId.substring(0, streamId.lastIndexOf(BlinkConstant.StreamSuffix.SCREEN));
            videoType = BlinkConstant.VideoType.SCREEN;
            blinkEngine.remoteScreenStreams.put(userId, evt.stream);
          } else {
            blinkEngine.remoteStreams.put(userId, evt.stream);
            var user = blinkEngine.joinedUsers.get(userId);
            var isNoVideo = false;
            if (blinkEngine.isSubscribeVersion()) { // 订阅分发版本
              var resource = user.resource;
              if (resource == BlinkConstant.ResourceType.None 
                  || resource == BlinkConstant.ResourceType.AudioOnly) { // 无视频
                isNoVideo = true;
              }
            } else {
              var talkType = user.talkType;
              if (talkType == BlinkConstant.TalkType.OnlyAudio 
                  || talkType == BlinkConstant.TalkType.None) { // 无视频
                isNoVideo = true;
              }
            }
            if (isNoVideo) { // 无视频
              evt.stream.getVideoTracks().forEach(function (track) {
                track.enabled = false;
              });
            }
          }
          
          // 增加trackId和userId的对应关系
          evt.stream.getTracks().forEach(function (track) {
              blinkEngine.remoteTrackIdMap.put(track.id, evt.stream.id);
          })

          // @Deprecated
          blinkEngine.blinkEngineEventHandle.call('onAddStream', {
              'userId': userId,
              'videoType': videoType
          });
          blinkEngine.blinkEngineEventHandle.call('onNotifyUserVideoCreated', {
              'userId': userId,
              'videoType': videoType
          });
      };

      pc.onremovestream = function (evt) {
          console.debug(new Date(), "onremovestream", evt);
          
          var streamId = evt.stream.id;
          var userId = streamId;
          var videoType = BlinkConstant.VideoType.NORMAL;
          if (streamId.lastIndexOf(BlinkConstant.StreamSuffix.SCREEN) != -1) { // 屏幕共享流
            userId = streamId.substring(0, streamId.lastIndexOf(BlinkConstant.StreamSuffix.SCREEN));
            videoType = BlinkConstant.VideoType.SCREEN;
            blinkEngine.remoteScreenStreams.remove(userId);
          } else {
            blinkEngine.remoteStreams.remove(userId);
          }
          
          // 移除trackId和userId的对应关系
          evt.stream.getTracks().forEach(function (track) {
              blinkEngine.remoteTrackIdMap.remove(track.id);
          })
          
          // @Deprecated
          blinkEngine.blinkEngineEventHandle.call('onRemoveStream', {
              'userId': userId,
              'videoType': videoType
          });
          blinkEngine.blinkEngineEventHandle.call('OnNotifyUserVideoDestroyed', {
              'userId': userId,
              'videoType': videoType
          });
      };

      pc.ontrack = function (evt) {
        console.debug(new Date(), "ontrack", evt);
        
        var track = evt.track;
        var stream = evt.streams[0];
        var userId = stream.id;
//    		if (track.kind == 'video') { // add video track
//    			// 刷新视频窗口的流
//    			BlinkUtil.setMediaStream(userId, stream);
//    		}
      };

      pc.onsignalingstatechange = function (evt) {
          console.debug(new Date(), "onsignalingstatechange", evt);
      };

      pc.oniceconnectionstatechange = function (evt) {
          console.debug(new Date(), "oniceconnectionstatechange", evt);
          console.warn(new Date(), "pc.iceConnectionState=" + pc.iceConnectionState);

          if (pc.iceConnectionState == 'failed') {
              if (blinkEngine.wsConnectionState == BlinkConstant.wsConnectionState.CONNECTED) { // ws连接可用
                  console.warn(new Date(), "oniceconnectionstatechange createOffer");
                  blinkEngine.createOffer(pc, userId, true);
              }
          }
      };

      pc.onnegotiationneeded = function (evt) {
        console.debug(new Date(), "onnegotiationneeded", evt);
      };

      pc.ondatachannel = function (evt) {
        console.debug(new Date(), "ondatachannel", evt);
      };

      pc.onicecandidate = function (evt) {
          console.debug(new Date(), "onicecandidate", evt);

          handle(pc, evt);

          function handle(pc, evt) {
              if ((pc.signalingState || pc.readyState) == 'stable'
                  && blinkEngine.peerConnections[userId]['rem'] == true) {
                  if (evt.candidate) {
                      blinkEngine.candidate(JSON.stringify(evt.candidate),
                          userId);
                  }
                  return;
              }
              setTimeout(function () {
                  handle(pc, evt);
              }, 2 * 1000);
          }
      };
      blinkEngine.peerConnections[userId] = {}
      blinkEngine.peerConnections[userId]['pc'] = pc;
      blinkEngine.peerConnections[userId]['rem'] = false;

      // peerConnection创建成功，开始getStatsReport
      blinkEngine.startScheduleGetStatsReport();
      
      if (this.isEnableMinStream) { // 开启了小流
        var pcMin = new RTCPeerConnection();
        blinkEngine.peerConnections[userId]['pcMin'] = pcMin;
      }
  }
  return blinkEngine.peerConnections[userId];
};
/**
* 关闭连接
*
*/
BlinkEngine.prototype.closePeerConnection = function (userId) {
  if (this.peerConnections[userId] != null) {
      this.peerConnections[userId]['pc'].close();
      this.peerConnections[userId] = null;
  }
  // 重置带宽设置计数器
  BlinkGlobal.bandWidthCount = 0;
  // peerConnection关闭，停止getStatsReport
  this.exitScheduleGetStatsReport();
}
/**
* handle offer
*
*/
BlinkEngine.prototype.handleOffer = function (data) {
  if (this.offerStatus == BlinkConstant.OfferStatus.SENDING) {
      console.warn(new Date(), "handleOffer offerStatus sending");
      return;
  }

  var from = data.parameters['from'];
  var desc = JSON.parse(data.content.replace(new RegExp('\'', 'g'), '"'));
  // set bandwidth
  desc.sdp = BlinkUtil.setBandWidth(desc.sdp, this.getBandWidth());

  var pcClient = this.preparePeerConnection(from);
  var pc = pcClient['pc'];
  if (this.userType != BlinkConstant.UserType.OBSERVER) {
      pc.addStream(this.localStream);
  }
  if (this.isScreenStreamSeparate && this.localScreenStream && this.screenSharingStatus) { // 屏幕共享流分离且开启了屏幕共享
    pc.addStream(this.localScreenStream);
  }
  var blinkEngine = this;
  pc.setRemoteDescription(new RTCSessionDescription(desc), function () {
      console.info(new Date(), "handleOffer setRemoteDescription success");
      blinkEngine.offerStatus = BlinkConstant.OfferStatus.DONE;
      // set remote cname map
      blinkEngine.setRemoteCnameMap(desc.sdp);
      pcClient['rem'] = true;
      pc.createAnswer(function (desc2) {
          console.info(new Date(), "createAnswer success");
          pc.setLocalDescription(desc2, function () {
              console.info(new Date(), "createAnswer setLocalDescription success");
              blinkEngine.answer(JSON.stringify(desc2), from);
          }, function (error) {
              console.error(new Date(), "createAnswer setLocalDescription error: ", error);
          });
      }, function (error) {
          console.error(new Date(), "createAnswer error: ", error);
      }, blinkEngine.getSdpMediaConstraints(false));
  }, function (error) {
      console.error(new Date(), "handleOffer setRemoteDescription error: ", error);
  });
};
/**
* handle answer
*
*/
BlinkEngine.prototype.handleAnswer = function (data) {
  if (this.offerStatus == BlinkConstant.OfferStatus.DONE) { // 已经设置过一次SDP，放弃本次设置
      console.warn(new Date(), "handleAnswer offerStatus done");
      return;
  }

  var from = data.parameters['from'];
  var desc = JSON.parse(data.content.replace(new RegExp('\'', 'g'), '"'));
  var pcClient = this.preparePeerConnection(from);
  var pc = pcClient['pc'];
  if (this.isEnableMinStream && desc.type == "tinyStreamAnswer") { // 小流
    desc.type = "answer";
    pc = pcClient['pcMin'];
  }
  // set bandwidth
  desc.sdp = BlinkUtil.setBandWidth(desc.sdp, this.getBandWidth());

  var blinkEngine = this;
  pc.setRemoteDescription(new RTCSessionDescription(desc), function () {
      console.info(new Date(), "handleAnswer setRemoteDescription success");
      blinkEngine.offerStatus = BlinkConstant.OfferStatus.DONE;
      // set remote cname map
      blinkEngine.setRemoteCnameMap(desc.sdp);
      pcClient['rem'] = true;
  }, function (error) {
      console.error(new Date(), "handleAnswer setRemoteDescription error: ", error);
  });
};
/**
* handle candidate
*
*/
BlinkEngine.prototype.handleCandidate = function (data) {
  var from = data.parameters['from'];
  var desc = JSON.parse(data.content.replace(new RegExp('\'', 'g'), '"'))

  var pcClient = this.preparePeerConnection(from);
  var pc = pcClient['pc'];
  pc.addIceCandidate(new RTCIceCandidate(desc), function () {
      console.info(new Date(), "addIceCandidate success");
  }, function (error) {
      console.error(new Date(), "addIceCandidate error: ", error);
  });
}
/**
* create offer
*
*/
BlinkEngine.prototype.createOffer = function (pc, userId, isIceRestart, subscribeInfo) {
  if (this.offerStatus == BlinkConstant.OfferStatus.SENDING) { // 已经创建过Offer，本次不创建
      console.warn(new Date(), "createOffer offerStatus sending");
      return;
  }
  console.info(new Date(), "createOffer userId=" + userId);
  var blinkEngine = this;
  pc.createOffer(function (desc) {
      console.info(new Date(), "createOffer success");
      // 变更SDP信息
      desc.sdp = blinkEngine.changeSdp(desc.sdp);
      pc.setLocalDescription(desc, function () {
          console.info(new Date(), "createOffer setLocalDescription success");
          blinkEngine.offerStatus = BlinkConstant.OfferStatus.SENDING;
          var bodys = new Array();
          if (subscribeInfo) {
            bodys.push(JSON.stringify(subscribeInfo));
          }
          blinkEngine.offer(JSON.stringify(desc), userId, bodys);
      }, function (error) {
          console.error(new Date(), "createOffer setLocalDescription error: ", error);
      });
  }, function (error) {
      console.error(new Date(), "createOffer error: ", error);
  }, blinkEngine.getSdpMediaConstraints(isIceRestart));
  // 小流
  if (this.isEnableMinStream && this.localMinStream) {
    var pcMin = this.peerConnections[userId]['pcMin'];
      pcMin.addStream(blinkEngine.localMinStream);
      pcMin.createOffer(function (desc) {
          console.info(new Date(), "pcMin createOffer success");
          // 变更SDP信息
          desc.sdp = blinkEngine.changeSdp(desc.sdp);
          pcMin.setLocalDescription(desc, function() {
              console.info(new Date(), "pcMin createOffer setLocalDescription success");
              blinkEngine.offerStatus = BlinkConstant.OfferStatus.SENDING;
              // offer to tinyStreamOffer
              desc.type = "tinyStreamOffer";
              blinkEngine.offer(JSON.stringify(desc), userId);
          }, function(error) {
              console.error(new Date(), "pcMin createOffer setLocalDescription error: ", error);
          });
      }, function(error) {
          console.error(new Date(), "pcMin createOffer error: ", error);
      });
  }
}
/**
* 变更SDP信息
* 
*/
BlinkEngine.prototype.changeSdp = function (sdp) {
if (this.localStream) { // 本地视频流
  // change streamId use userId
    sdp = BlinkUtil.changeStreamId(sdp, this.localStream.id, this.userId);
//	    // change videoTrackId
//	    this.localStream.getVideoTracks().forEach(function (track) {
//	    	sdp = BlinkUtil.changeTrackId(sdp, track.id, this.userId + BlinkConstant.TrackSuffix.VIDEO);
//	    });
//		// change audioTrackId
//	    this.localStream.getAudioTracks().forEach(function (track) {
//	    	sdp = BlinkUtil.changeTrackId(sdp, track.id, this.userId + BlinkConstant.TrackSuffix.AUDIO);
//	    });
}
  if (this.isScreenStreamSeparate && this.localScreenStream && this.screenSharingStatus) { // 屏幕共享流分离且开启了屏幕共享
    // change screenStreamId use userId
    sdp = BlinkUtil.changeStreamId(sdp, this.localScreenStream.id, this.userId + BlinkConstant.StreamSuffix.SCREEN);
//    	// change videoTrackId
//      this.localScreenStream.getVideoTracks().forEach(function (track) {
//        	sdp = BlinkUtil.changeTrackId(sdp, track.id, this.userId + BlinkConstant.StreamSuffix.SCREEN + BlinkConstant.StreamSuffix.SCREEN + BlinkConstant.TrackSuffix.VIDEO);
//      });
  }
  if (this.isEnableMinStream && this.localMinStream && !this.screenSharingStatus) { // 有小流且没有开启屏幕共享
    // change minStreamId use userId
      sdp = BlinkUtil.changeStreamId(sdp, this.localMinStream.id, this.userId + BlinkConstant.StreamSuffix.TINY);
//      // change videoTrackId
//      this.localMinStream.getVideoTracks().forEach(function (track) {
//        	sdp = BlinkUtil.changeTrackId(sdp, track.id, this.userId + BlinkConstant.StreamSuffix.TINY + BlinkConstant.StreamSuffix.TINY + BlinkConstant.TrackSuffix.VIDEO);
//      });
  }

  // 替换video参数
  sdp = BlinkUtil.changeVideoDesc(sdp);
  return sdp;
}
/**
* 设置sdp属性
*
*/
BlinkEngine.prototype.getSdpMediaConstraints = function (isIceRestart) {
  var sdpMediaConstraints = {};
  sdpMediaConstraints.mandatory = {};
  // 统一设置，包含观察者模式和普通模式无摄像头情况
  sdpMediaConstraints.mandatory.OfferToReceiveAudio = true;
  sdpMediaConstraints.mandatory.OfferToReceiveVideo = true;
  // IceRestart
  console.warn(new Date(), "isIceRestart=" + isIceRestart);
  sdpMediaConstraints.mandatory.IceRestart = isIceRestart;
  return sdpMediaConstraints;
}
/**
* 设置remote cname map
*
*/
BlinkEngine.prototype.setRemoteCnameMap = function (sdp) {
  var userArr = this.joinedUsers.getEntrys();
  for (var i in userArr) {
      var userId = userArr[i].key;
      if (userId == this.userId) { // 不是远端
          continue;
      }
      if (!this.remoteCnameMap.contains(userId)) {
          var cname = BlinkUtil.getCname(sdp, userId);
          if (cname != null && cname != "") {
              this.remoteCnameMap.put(userId, cname);
              this.remoteSdpMap.put(userId, sdp);
          }
      } else {
          var cname = this.remoteCnameMap.get(userId);
          if (cname != null && cname != "") {
            if (!BlinkUtil.isHasCname(sdp, cname)) { // userId不变，cname变化，视为客户端杀进程后重连，刷新远端视频流
              var newCname = BlinkUtil.getCname(sdp, userId);
                  if (newCname != null && newCname != "") {
                      this.remoteCnameMap.put(userId, newCname);
                      BlinkUtil.refreshMediaStream(userId);
                  }
            } else { // 屏幕共享cname不变
              var newCname = BlinkUtil.getCname(sdp, userId);
                  if (cname == newCname) {
                      var oldSdp = this.remoteSdpMap.get(userId);
                      var ts = BlinkUtil.getSsrc(oldSdp, userId, cname);
                      var newTs = BlinkUtil.getSsrc(sdp, userId, cname);
                      if (ts != newTs) {
                        BlinkUtil.refreshMediaStream(userId);
                      }
                  }
            }
          }
      }
  }
}
/**
* 获取带宽
* 
*/
BlinkEngine.prototype.getBandWidth = function () {
if (this.screenSharingStatus) { // 正在屏幕共享
  return BlinkConstant.BandWidth_ScreenShare_1280_720;
}
return this.bandWidth;
}
/** ----- offer ----- */
/** ----- getStatsReport ----- */
/**
* getStatsReport
*
*/
BlinkEngine.prototype.getStatsReport = function () {
  var pcClient = this.peerConnections[this.userId];
  if (pcClient != null) {
      var pc = pcClient['pc'];
      var blinkEngine = this;
    //   pc.getStats(null, function (report) {
    //       blinkEngine.blinkConnectionStatsReport.parseStatsReport(report);
    //       // 上报丢包率信息，返回本地数据流的丢包率
    //       if (blinkEngine.isSendLostReport) {
    //         var packetSendLossRate = blinkEngine.blinkConnectionStatsReport.packetSendLossRate;
    //           console.debug(new Date(), "onNetworkSentLost=" + packetSendLossRate);
    //           blinkEngine.blinkEngineEventHandle.call('onNetworkSentLost', {
    //               packetSendLossRate: packetSendLossRate
    //           });
    //       }
    //       // 上报音频输入电平
    //       var audioInputLevel = blinkEngine.blinkConnectionStatsReport.audioInputLevel;
    //       if (!blinkEngine.localAudioEnable) { // 本地静音
    //         audioInputLevel = 0;
    //       }
    //       console.debug(new Date(), "audioInputLevel=" + audioInputLevel);
    //       blinkEngine.blinkEngineEventHandle.call('onAudioInputLevel', {
    //   audioInputLevel : audioInputLevel
    // });
    // // 上报音频接收电平
    // var audioReceivedLevel = blinkEngine.blinkConnectionStatsReport.audioReceivedLevel;
    // console.debug(new Date(), "audioReceivedLevel=" + audioReceivedLevel);
    // blinkEngine.blinkEngineEventHandle.call('onAudioReceivedLevel', {
    //   audioReceivedLevel : audioReceivedLevel
    // });
    //   }, function (error) {
    //       console.error(new Date(), "getStatsReport error: ", error);
    //   });
  }
}
/**
* 开始getStatsReport
*
*/
BlinkEngine.prototype.startScheduleGetStatsReport = function () {
  this.exitScheduleGetStatsReport();

  this.blinkConnectionStatsReport = new BlinkConnectionStatsReport(this);
  var blinkEngine = this;
  blinkEngine.getStatsReportInterval = setInterval(function () {
      blinkEngine.getStatsReport();
  }, BlinkConstant.GETSTATSREPORT_INTERVAL);
}
/**
* 停止getStatsReport
*
*/
BlinkEngine.prototype.exitScheduleGetStatsReport = function () {
  if (this.getStatsReportInterval != null) {
      clearInterval(this.getStatsReportInterval);
      this.getStatsReportInterval = null;
  }
  this.blinkConnectionStatsReport = null;
}
/** ----- getStatsReport ----- */
/** ----- screenShare ----- */
/**
* 绑定插件监听事件
* 
*/
BlinkEngine.prototype.addEventListener = function () {
  if (this.isBindEvent) { // 已经绑定过事件
      return;
  }
  var blinkEngine = this;
  window.addEventListener("message", function (msg) {
      var messageHandler = {
          onResponseReqSouId: function (msg) {
            blinkEngine.screenShareWithSource(msg.data.sourceId);
          },
          testMessage: function (msg) {
              blinkEngine.isScreenSharePluginInstalled = true;
          },
          other: function (msg) {
              console.debug(new Date(), msg);
          }
      }
      var handle = messageHandler[msg.data.type] || messageHandler.other;
      handle(msg);
  }, false);
  this.isBindEvent = true;
}
/**
* 检查是否支持屏幕共享
* 
*/
BlinkEngine.prototype.checkScreenShareSupport = function () {
  // 检测浏览器是否支持
  var supportBrowser = ['Chrome'];
  var mb = BlinkUtil.myBrowser();
  if (supportBrowser.indexOf(mb) < 0) { // 浏览器不支持
      return BlinkConstant.ScreenShareSupportCode.BrowserNotSupport;
  }
  // 检测是否安装了插件
  if (!this.isScreenSharePluginInstalled) { // 未安装插件
      return BlinkConstant.ScreenShareSupportCode.NoPlugin;
  }
  return BlinkConstant.ScreenShareSupportCode.Support;
}
/**
* 向插件发起屏幕共享请求
* 
*/
BlinkEngine.prototype.requestScreenShare = function () {
  window.postMessage('requestScreenSourceId', '*');
}
/**
* 屏幕共享，有source
* 
*/
BlinkEngine.prototype.screenShareWithSource = function (sourceId) {
var blinkEngine = this;
var screenMediaConfig = this.getScreenMediaConfig(sourceId);
BlinkUtil.getMedia(screenMediaConfig).then(function (stream) {
  blinkEngine.screenShareWithStream(stream);
  }).catch(function (error) {
      console.error(new Date(), "startScreenShare getMedia error: " + error);
      blinkEngine.blinkEngineEventHandle.call('onStartScreenShareComplete', {
          'isSuccess': false
      });
  });
}
/**
* 屏幕共享，有screenStream
* 
*/
BlinkEngine.prototype.screenShareWithStream = function (screenStream) {
//	var blinkEngine = this;
//	var screenVideoTrack = screenStream.getVideoTracks()[0];
//	screenVideoTrack.onended = function () {
//  	// 关闭屏幕共享
//      blinkEngine.stopScreenShare();
//  };
//  if (this.isScreenStreamSeparate) { // 屏幕共享流分离
//  	this.localScreenStream = screenStream;
//  } else {
//    	// 移除视频流videoTrack
// 		var oldVideoTrack = this.localStream.getVideoTracks()[0];
// 		oldVideoTrack.stop();
// 		this.localStream.removeTrack(oldVideoTrack);
// 		// 将屏幕共享流videoTrack加入到流中
// 		this.localStream.addTrack(screenVideoTrack);
//    	// // 刷新本地视频窗口的流
//    	// BlinkUtil.setMediaStream(this.userId, this.localStream);
//  }
//  this._startScreenShare();
var blinkEngine = this;
this.localScreenVideoTrack = screenStream.getVideoTracks()[0];
this.localScreenVideoTrack.onended = function () {
      // 关闭屏幕共享
      blinkEngine.stopScreenShare();
  };
  if (this.isScreenStreamSeparate) { // 屏幕共享流分离
    this.localScreenStream = screenStream;
  } else {
    if (this.isSubscribeVersion() && this.isStartStopLocalTrack) { // 订阅分发版本且是start/stop track
      if (this.localVideoEnable) { // 原视频是enable的
        this.stopLocalTrack(BlinkConstant.DeviceType.Camera);
      }
    }
    // 移除视频流videoTrack
  if (this.localVideoTrack) {
    this.localStream.removeTrack(this.localVideoTrack);
  }
    // 将屏幕共享流videoTrack加入到流中
    this.localStream.addTrack(this.localScreenVideoTrack);
    // // 刷新本地视频窗口的流
    // BlinkUtil.setMediaStream(this.userId, this.localStream);
  }
  this._startScreenShare();
}
/**
* 开启屏幕共享
* 
*/
BlinkEngine.prototype._startScreenShare = function () {
this.screenSharingStatus = true;
if (this.isSubscribeVersion()) { // 订阅分发版本
  var resource = this.convertResource(this.resource, BlinkConstant.DeviceType.ScreenShare, BlinkConstant.OperationType.OPEN);
  // 变更resource
  this.changeResource(this.userId, resource);
  // 发信令
  this.update_resource(resource);
} else {
  // 发开启屏幕共享信令
  // this.screenSharing(BlinkConstant.OperationType.OPEN);
}
  this.blinkEngineEventHandle.call('onStartScreenShareComplete', {
      'isSuccess': true
  });
  
  // offer
  var pcClient = this.peerConnections[this.userId];
if (pcClient != null) { // 只有一人时，值为null，在订阅分发版本中，只有一人时也有peerConnection
  var pc = pcClient['pc'];
  if (this.isScreenStreamSeparate && this.localScreenStream) { // 屏幕共享流分离
    pc.addStream(this.localScreenStream);
  }
  console.warn(new Date(), "startScreenShare createOffer");
  this.createOffer(pc, this.userId, false);
}
}
/**
* 关闭屏幕共享
* 
*/
BlinkEngine.prototype._stopScreenShare = function () {
this.screenSharingStatus = false;
if (this.isSubscribeVersion()) { // 订阅分发版本
  var resource = this.convertResource(this.resource, BlinkConstant.DeviceType.ScreenShare, BlinkConstant.OperationType.CLOSE);
  // 变更resource
  this.changeResource(this.userId, resource);
  // 发信令
  this.update_resource(resource);
} else {
  // 发关闭屏幕共享信令
  // this.screenSharing(BlinkConstant.OperationType.CLOSE);
}
this.blinkEngineEventHandle.call('onStopScreenShareComplete', {
    'isSuccess': true
});

// offer
var pcClient = this.peerConnections[this.userId];
if (pcClient != null) { // 只有一人时，值为null，在订阅分发版本中，只有一人时也有peerConnection
  var pc = pcClient['pc'];
  if (this.isScreenStreamSeparate && this.localScreenStream) { // 屏幕共享流分离
    pc.removeStream(this.localScreenStream);
    this.localScreenStream = null;
  }
  console.warn(new Date(), "stopScreenShare createOffer");
  this.createOffer(pc, this.userId, false);
} else {
  if (this.isScreenStreamSeparate && this.localScreenStream) { // 屏幕共享流分离
    this.localScreenStream = null;
  }
}
}
/** ----- screenShare ----- */
/** ----- 会控 ----- */
/**
* 变更为观察者
* 
*/
BlinkEngine.prototype.change2Observer = function (userId) {
// 变更userType
this.changeUserType(userId, BlinkConstant.UserType.OBSERVER);
if (userId == this.userId) {
  if (this.isSubscribeVersion()) { // 订阅分发版本
    if (this.isStartStopLocalTrack) { // start/stop track
      this.stopLocalTrack(BlinkConstant.DeviceType.CameraAndMicrophone);
    }
    // 变更Track绑定
    this.updateLocalTrackBind(this.resource);
  }
  // 关闭屏幕共享
  if (this.screenSharingStatus) { // 开启了屏幕共享
    if (this.localScreenVideoTrack) {
      // 移除screenVideoTrack
      if (this.isScreenStreamSeparate) { // 屏幕共享流分离
        this.localScreenStream.removeTrack(this.localScreenVideoTrack);
      } else {
        this.localStream.removeTrack(this.localScreenVideoTrack);
      }
      // stop后会关闭弹出的屏幕共享工具条
      this.localScreenVideoTrack.stop();
      this.localScreenVideoTrack = null;
    }
  }
  // offer
  var pcClient = this.peerConnections[this.userId];
  if (pcClient != null) { // 只有一人时，值为null，在订阅分发版本中，只有一人时也有peerConnection
    var pc = pcClient['pc'];
    pc.removeStream(this.localStream);
    if (this.isScreenStreamSeparate && this.localScreenStream && this.screenSharingStatus) { // 屏幕共享流分离且开启了屏幕共享
      pc.removeStream(this.localScreenStream);
      this.localScreenStream = null;
    }
    console.warn(new Date(), "change2Observer createOffer");
    this.createOffer(pc, this.userId, false);
  } else {
    if (this.isScreenStreamSeparate && this.localScreenStream && this.screenSharingStatus) { // 屏幕共享流分离且开启了屏幕共享
      this.localScreenStream = null;
    }
  }
}
}
/**
* 变更为普通与会人员
* 
*/
BlinkEngine.prototype.change2Normal = function (userId) {
// 变更userType
this.changeUserType(userId, BlinkConstant.UserType.NORMAL);

if (userId == this.userId) {
  var createOffer = function(blinkEngine) {
    // offer
    var pcClient = blinkEngine.peerConnections[blinkEngine.userId];
    if (pcClient != null) { // 只有一人时，值为null，在订阅分发版本中，只有一人时也有peerConnection
      var pc = pcClient['pc'];
      pc.addStream(blinkEngine.localStream);
      console.warn(new Date(), "change2Normal createOffer");
      blinkEngine.createOffer(pc, blinkEngine.userId, false);
    }
    };
  if (this.isSubscribeVersion()) { // 订阅分发版本
    if (this.isStartStopLocalTrack) { // start/stop track
      this.startLocalTrack(BlinkConstant.DeviceType.CameraAndMicrophone, createOffer);
      return;
    }
    // 变更Track绑定
    this.updateLocalTrackBind(this.resource);
  }
  if (this.localStream == null || this.localStream.getTracks().length == 0) {
    var blinkEngine = this;
    var mediaConfig = this.getMediaConfig(true, true);
    BlinkUtil.getMedia(mediaConfig).then(function (stream) {
        console.info(new Date(), "change2Normal navigator.getUserMedia success");
          blinkEngine.setLocalStream(stream);
          // 刷新本地视频窗口的流
        BlinkUtil.setMediaStream(blinkEngine.userId, blinkEngine.localStream);
        // offer
        createOffer(blinkEngine);
      }).catch(function (error) {
        console.error(new Date(), "change2Normal navigator.getUserMedia error: ", error);
      });
  } else {
    // offer
    createOffer(this);
  }
}
}
/**
* 变更为主持人
* 
*/
BlinkEngine.prototype.change2Host = function (userId) {
// 变更userType
this.changeUserType(userId, BlinkConstant.UserType.HOST);
}
/**
* 变更userType
* 
*/
BlinkEngine.prototype.changeUserType = function(userId, userType) {
if (userType == BlinkConstant.UserType.HOST) { // 变更为主持人
  // 原主持人变更为普通与会人员
  var resetUserArr = [];
  this.joinedUsers.getEntrys().forEach(function(userEntry) {
    var user = userEntry.value;
    if (user.userType == BlinkConstant.UserType.HOST) {
          user.userType = BlinkConstant.UserType.NORMAL;
          resetUserArr.push(user);
    }
  });
    var blinkEngine = this;
    resetUserArr.forEach(function (user) {
      blinkEngine.joinedUsers.put(user.userId, user);
    });
    // 其他人获取主持人，若此时自己是主持人，自己变成普通与会人员
    if (this.userId != userId && this.userType == BlinkConstant.UserType.HOST) {
      this.userType = BlinkConstant.UserType.NORMAL;
    }
}

if (userId == this.userId) {
  this.userType = userType;
}
var user = this.joinedUsers.get(userId);
if (user != null) {
  user.userType = userType;
  this.joinedUsers.put(userId, user);
}

if (this.isSubscribeVersion()) { // 订阅分发版本
  // 变更resource
  if (userType == BlinkConstant.UserType.NORMAL) { // 变更为普通与会人员
    this.changeResource(userId, BlinkConstant.ResourceType.AudioAndVideo);
  } else if (userType == BlinkConstant.UserType.OBSERVER) { // 变更为观察者
    this.changeResource(userId, BlinkConstant.ResourceType.None);
  } else if (userType == BlinkConstant.UserType.HOST) { // 变更为主持人
    // 无变化
  }
} else {
  // 变更talkType
  if (userType == BlinkConstant.UserType.NORMAL) { // 变更为普通与会人员
    this.changeTalkType(userId, BlinkConstant.DeviceType.CameraAndMicrophone, true);
  } else if (userType == BlinkConstant.UserType.OBSERVER) { // 变更为观察者
    this.changeTalkType(userId, BlinkConstant.DeviceType.CameraAndMicrophone, false);
  } else if (userType == BlinkConstant.UserType.HOST) { // 变更为主持人
    // 无变化
  }
}
}
/**
* 变更talkType
* 
*/
BlinkEngine.prototype.changeTalkType = function (userId, deviceType, isOpen) {
// change talkType
var operationType = isOpen ? BlinkConstant.OperationType.OPEN : BlinkConstant.OperationType.CLOSE;
if (userId == this.userId) {
  var oldTalkType = this.talkType;
  var newTalkType = this.convertTalkType(oldTalkType, deviceType, operationType);
  this.talkType = newTalkType;
}
var user = this.joinedUsers.get(userId);
if (user != null) {
  var oldTalkType = user.talkType;
  var newTalkType = this.convertTalkType(oldTalkType, deviceType, operationType);
  user.talkType = newTalkType;
  this.joinedUsers.put(userId, user);
}
if (userId == this.userId) {
  // change carema/microphone track
  this.enableLocalTrack(deviceType, isOpen);
}
// 远端
if (isOpen && deviceType == BlinkConstant.DeviceType.Camera) { // 打开摄像头
    var remoteStream = this.getRemoteStream(userId);
    if (remoteStream && remoteStream.getVideoTracks()) {
      remoteStream.getVideoTracks().forEach(function (track) {
        track.enabled = true;
      })
    }
  }
}
/**
* 转换talktype
* 
*/
BlinkEngine.prototype.convertTalkType = function (oldTalkType, deviceType, operationType) {
var videoEnable = true;
var audioEnable = true;
if (oldTalkType == BlinkConstant.TalkType.OnlyAudio || oldTalkType == BlinkConstant.TalkType.None) { // 无视频
  videoEnable = false;
}
if (oldTalkType == BlinkConstant.TalkType.OnlyVideo || oldTalkType == BlinkConstant.TalkType.None) { // 无音频
  audioEnable = false;
}

if (operationType == BlinkConstant.OperationType.OPEN) { // 打开
  if (deviceType == BlinkConstant.DeviceType.Camera) {
    videoEnable = true;
  } else if (deviceType == BlinkConstant.DeviceType.Microphone) {
    audioEnable = true;
  } else if (deviceType == BlinkConstant.DeviceType.CameraAndMicrophone) {
    videoEnable = true;
    audioEnable = true;
  }
} else if (operationType == BlinkConstant.OperationType.CLOSE) { // 关闭
  if (deviceType == BlinkConstant.DeviceType.Camera) {
    videoEnable = false;
  } else if (deviceType == BlinkConstant.DeviceType.Microphone) {
    audioEnable = false;
  } else if (deviceType == BlinkConstant.DeviceType.CameraAndMicrophone) {
    videoEnable = false;
    audioEnable = false;
  }
}

var newTalkType = oldTalkType;
if (videoEnable && audioEnable) {
  newTalkType = BlinkConstant.TalkType.All;
} else if (videoEnable && !audioEnable) {
  newTalkType = BlinkConstant.TalkType.OnlyVideo;
} else if (!videoEnable && audioEnable) {
  newTalkType = BlinkConstant.TalkType.OnlyAudio;
} else if (!videoEnable && !audioEnable) {
  newTalkType = BlinkConstant.TalkType.None;
}
return newTalkType;
}
/** ----- 会控 ----- */
/** ----- 订阅分发 ----- */
/**
* 是否订阅分发版本
* 
*/
BlinkEngine.prototype.isSubscribeVersion = function() {
if (this.logonVersion == BlinkConstant.LogonVersion.SUBSCRIBE) { // 订阅分发版本
  return true;
}
return false;
}
/**
* 变更资源
* 
*/
BlinkEngine.prototype._updateResource = function(resource) {
var oldResource = this.resource;
// 变更resource
this.changeResource(this.userId, resource);
var createOffer = function(blinkEngine) {
  // offer
  var pcClient = blinkEngine.peerConnections[blinkEngine.userId];
  if (pcClient != null) { // 只有一人时，值为null，在订阅分发版本中，只有一人时也有peerConnection
    var pc = pcClient['pc'];
    console.warn(new Date(), "_updateResource createOffer");
    blinkEngine.createOffer(pc, blinkEngine.userId, false);
  }
};
if (this.isStartStopLocalTrack) { // start/stop track
  // 转换operation
  var operation = this.convertOperation(oldResource, resource);
  var deviceType = operation.deviceType;
  var operationType = operation.operationType;
  if (operationType == BlinkConstant.OperationType.OPEN) { // 打开
    this.startLocalTrack(deviceType, createOffer);
    return;
  }
  this.stopLocalTrack(deviceType);
}
// 变更Track绑定
this.updateLocalTrackBind(this.resource);
// offer
createOffer(this);
}
/**
* 变更resource
* 
*/
BlinkEngine.prototype.changeResource = function(userId, resource) {
// change resource
var oldResource;
if (userId == this.userId) {
  oldResource = this.resource;
  this.resource = resource;
}
var user = this.joinedUsers.get(userId);
if (user != null) {
  oldResource = user.resource;
  user.resource = resource;
  this.joinedUsers.put(userId, user);
}
// 转换operation
var operation = this.convertOperation(oldResource, resource);
var deviceType = operation.deviceType;
var operationType = operation.operationType;
var isOpen = operationType == BlinkConstant.OperationType.OPEN ? true : false;
// 变更talkType
this.changeTalkType(userId, deviceType, isOpen);
}
/**
* 转换resource
* 
*/
BlinkEngine.prototype.convertResource = function (oldResource, deviceType, operationType) {
var enableType = operationType == BlinkConstant.OperationType.OPEN ? BlinkConstant.EnableType.Enable : BlinkConstant.EnableType.Disable;
// 转换成二进制后反转，第一位是麦克风，第二位是摄像头，第三位是屏幕共享
var oldBinaryArr = oldResource.toString(2).split("").reverse();
var binaryArr = oldBinaryArr;
if (deviceType == BlinkConstant.DeviceType.Microphone) { // 麦克风
  binaryArr[0] = enableType;
} else if (deviceType == BlinkConstant.DeviceType.Camera) { // 摄像头
  binaryArr[1] = enableType;
} else if (deviceType == BlinkConstant.DeviceType.CameraAndMicrophone) { // 麦克风+摄像头
  binaryArr[0] = enableType;
  binaryArr[1] = enableType;
} else if (deviceType == BlinkConstant.DeviceType.ScreenShare) { // 屏幕共享
  binaryArr[2] = enableType;
}
// 补0
if (binaryArr[0] == null) {
  binaryArr[0] = 0;
}
if (binaryArr[1] == null) {
  binaryArr[1] = 0;
}
if (binaryArr[2] == null) {
  binaryArr[2] = 0;
}
// 反转后转换成十进制
var resource = parseInt(binaryArr.reverse().join(""), 2);
return resource;
}
/**
* 转换operation
* 
*/
BlinkEngine.prototype.convertOperation = function (oldResource, resource) {
var operation = {};
// 转换成二进制后反转，第一位是麦克风，第二位是摄像头，第三位是屏幕共享
var oldBinaryArr = oldResource.toString(2).split("").reverse();
var binaryArr = resource.toString(2).split("").reverse();
// 补0
if (oldBinaryArr[0] == null) {
  oldBinaryArr[0] = 0;
}
if (oldBinaryArr[1] == null) {
  oldBinaryArr[1] = 0;
}
if (oldBinaryArr[2] == null) {
  oldBinaryArr[2] = 0;
}
if (binaryArr[0] == null) {
  binaryArr[0] = 0;
}
if (binaryArr[1] == null) {
  binaryArr[1] = 0;
}
if (binaryArr[2] == null) {
  binaryArr[2] = 0;
}
if (binaryArr[2] > oldBinaryArr[2]) { // 开启了屏幕共享
  operation.deviceType = BlinkConstant.DeviceType.ScreenShare,
  operation.operationType = BlinkConstant.OperationType.OPEN;
} else if (binaryArr[2] < oldBinaryArr[2]) { // 关闭了屏幕共享
  operation.deviceType = BlinkConstant.DeviceType.ScreenShare,
  operation.operationType = BlinkConstant.OperationType.CLOSE;
} else {
  if (binaryArr[1] > oldBinaryArr[1] && binaryArr[0] > oldBinaryArr[0]) { // 开启了摄像头+麦克风
    operation.deviceType = BlinkConstant.DeviceType.CameraAndMicrophone,
    operation.operationType = BlinkConstant.OperationType.OPEN;
  } else if (binaryArr[1] < oldBinaryArr[1] && binaryArr[0] < oldBinaryArr[0]) { // 关闭了摄像头+麦克风
    operation.deviceType = BlinkConstant.DeviceType.CameraAndMicrophone,
    operation.operationType = BlinkConstant.OperationType.CLOSE;
  } else {
    if (binaryArr[1] > oldBinaryArr[1]) { // 开启了摄像头
      operation.deviceType = BlinkConstant.DeviceType.Camera,
      operation.operationType = BlinkConstant.OperationType.OPEN;
    } else if (binaryArr[1] < oldBinaryArr[1]) { // 关闭了摄像头
      operation.deviceType = BlinkConstant.DeviceType.Camera,
      operation.operationType = BlinkConstant.OperationType.CLOSE;
    }
    if (binaryArr[0] > oldBinaryArr[0]) { // 开启了麦克风
      operation.deviceType = BlinkConstant.DeviceType.Microphone,
      operation.operationType = BlinkConstant.OperationType.OPEN;
    } else if (binaryArr[0] < oldBinaryArr[0]) { // 关闭了麦克风
      operation.deviceType = BlinkConstant.DeviceType.Microphone,
      operation.operationType = BlinkConstant.OperationType.CLOSE;
    }
  }
}
return operation;

}
/**
* resourceType转talkType
* 
*/
BlinkEngine.prototype.convertResourceType2TalkType = function (resourceType) {
if (resourceType == BlinkConstant.ResourceType.AudioOnly || 
    resourceType == BlinkConstant.ResourceType.AudioAndScreenSharing) { // 只音频
  return BlinkConstant.TalkType.OnlyAudio;
}
if (resourceType == BlinkConstant.ResourceType.VideoOnly || 
    resourceType == BlinkConstant.ResourceType.VideoAndScreenSharing) { // 只视频
  return BlinkConstant.TalkType.OnlyVideo;
}
if (resourceType == BlinkConstant.ResourceType.ScreenSharing) { // 屏幕共享
  if (this.isScreenStreamSeparate) { // 屏幕共享流分离
    return BlinkConstant.TalkType.None;
  }
  return BlinkConstant.TalkType.OnlyVideo;
}
if (resourceType == BlinkConstant.ResourceType.AudioAndVideo || 
    resourceType == BlinkConstant.ResourceType.AudioAndVideoAndScreenSharing) { // 音视频
  return BlinkConstant.TalkType.All;
}
if (resourceType == BlinkConstant.ResourceType.None) { // 无音视频
  return BlinkConstant.TalkType.None;
}
return null;
}
/**
* talkType转resourceType
* 
*/
BlinkEngine.prototype.convertTalkType2ResourceType = function (talkType, screenSharingStatus) {
if (talkType == BlinkConstant.TalkType.OnlyAudio) { // 只音频
  if (screenSharingStatus) {
    return BlinkConstant.ResourceType.AudioAndScreenSharing;
  }
  return BlinkConstant.ResourceType.AudioOnly;
}
if (talkType == BlinkConstant.TalkType.OnlyVideo) { // 只视频
  if (screenSharingStatus) {
    return BlinkConstant.ResourceType.VideoAndScreenSharing;
  }
  return BlinkConstant.ResourceType.VideoOnly;
}
if (talkType == BlinkConstant.TalkType.All) { // 音视频
  if (screenSharingStatus) {
    return BlinkConstant.ResourceType.AudioAndVideoAndScreenSharing;
  }
  return BlinkConstant.ResourceType.AudioAndVideo;
}
if (talkType == BlinkConstant.TalkType.None) { // 无音视频
  if (screenSharingStatus) {
    return BlinkConstant.ResourceType.ScreenSharing;
  }
  return BlinkConstant.ResourceType.None;
}
return null;
}
/**
* stop本地音频track
* 
*/
BlinkEngine.prototype.stopLocalAudioTrack = function () {
if (this.localAudioTrack) {
    this.localAudioTrack.stop();
  }
if (this.localStream && this.localStream.getAudioTracks()) {
  this.localStream.getAudioTracks().forEach(function (track) {
    track.stop();
  });
}
}
/**
* stop本地视频track
* 
*/
BlinkEngine.prototype.stopLocalVideoTrack = function () {
if (this.localVideoTrack) {
  this.localVideoTrack.stop();
}
if (this.localStream && this.localStream.getVideoTracks()) {
  this.localStream.getVideoTracks().forEach(function (track) {
    track.stop();
  });
}
}
/**
* stop本地track
* 
*/
BlinkEngine.prototype.stopLocalTrack = function (deviceType) {
if (deviceType == BlinkConstant.DeviceType.Camera) {
  this.stopLocalVideoTrack();
} else if (deviceType == BlinkConstant.DeviceType.Microphone) {
  this.stopLocalAudioTrack();
} else if (deviceType == BlinkConstant.DeviceType.CameraAndMicrophone) {
  this.stopLocalVideoTrack();
  this.stopLocalAudioTrack();
}
}
/**
* start本地track
* 
*/
BlinkEngine.prototype.startLocalTrack = function (deviceType, callback) {
var localVideoEnable = false;
var localAudioEnable = false;
var isNeedStart = true;
if (deviceType == BlinkConstant.DeviceType.Camera) {
  localVideoEnable = true;
} else if (deviceType == BlinkConstant.DeviceType.Microphone) {
  localAudioEnable = true;
} else if (deviceType == BlinkConstant.DeviceType.CameraAndMicrophone) {
  localVideoEnable = true;
  localAudioEnable = true;
} else {
  isNeedStart = false;
}
if (isNeedStart) {
  var blinkEngine = this;
  var mediaConfig = this.getMediaConfig(localVideoEnable, localAudioEnable);
  BlinkUtil.getMedia(mediaConfig).then(function (stream) {
    console.info(new Date(), "startLocalTrack navigator.getUserMedia success");
    blinkEngine.setLocalStream(stream);
    // 刷新本地视频窗口的流
      BlinkUtil.setMediaStream(blinkEngine.userId, blinkEngine.localStream);
    callback(blinkEngine);
  }).catch(function (error) {
    console.error(new Date(), "startLocalTrack navigator.getUserMedia error: ", error);
  });
}
}
/**
* 变更本地Track绑定
* 
*/
BlinkEngine.prototype.updateLocalTrackBind = function(resource) {
if (resource == BlinkConstant.ResourceType.None 
    || resource == BlinkConstant.ResourceType.ScreenSharing) { // 无音视频
  if (this.localAudioTrack) {
    this.localStream.removeTrack(this.localAudioTrack);
  }
  if (this.localVideoTrack) {
    this.localStream.removeTrack(this.localVideoTrack);
  }
  } else if (resource == BlinkConstant.ResourceType.AudioOnly 
      || resource == BlinkConstant.ResourceType.AudioAndScreenSharing) { // 只音频
    if (this.localAudioTrack) {
    this.localStream.addTrack(this.localAudioTrack);
  }
  if (this.localVideoTrack) {
    this.localStream.removeTrack(this.localVideoTrack);
  }
  } else if (resource == BlinkConstant.ResourceType.VideoOnly 
      || resource == BlinkConstant.ResourceType.VideoAndScreenSharing) { // 只视频
    if (this.localAudioTrack) {
    this.localStream.removeTrack(this.localAudioTrack);
  }
  if (this.localVideoTrack) {
    this.localStream.addTrack(this.localVideoTrack);
  }
  } else if (resource == BlinkConstant.ResourceType.AudioAndVideo 
      || resource == BlinkConstant.ResourceType.AudioAndVideoAndScreenSharing) { // 音视频
    if (this.localAudioTrack) {
    this.localStream.addTrack(this.localAudioTrack);
  }
  if (this.localVideoTrack) {
    this.localStream.addTrack(this.localVideoTrack);
  }
  }
}
/** ----- 订阅分发 ----- */
/** ----- 请求信令 ----- */
// /**
// * 请求logon信令
// *
// */
// BlinkEngine.prototype.logon = function() {
// this.sendMsg(BlinkConstant.SignalType.LOGON, this.token, {
// 'version' : BlinkConstant.LOGON_VERSION
// });
// }
// /**
// * 请求join信令
// *
// */
// BlinkEngine.prototype.join = function() {
// this.sendMsg(BlinkConstant.SignalType.JOIN, null, {
// 'key' : this.channelId,
// 'type' : this.userType
// });
// }
/**
* 请求logonAndJoin信令
*
*/
BlinkEngine.prototype.logonAndJoin = function (status) {
  this.logonAndJoinStatus = (status == null || status == undefined ? 0 : status);
  this.offerStatus = null;
  if (this.isSubscribeVersion()) { // 订阅分发版本
    this.sendMsg(BlinkConstant.SignalType.LOGONANDJOIN, this.token, {
          'key': this.channelId,
          'type': this.userType,
          'status': this.logonAndJoinStatus,
          'version': this.logonVersion,
          'userName': this.userName,
          'clientType': BlinkConstant.CLIENT_TYPE,
          'carelist': this.care,
          'resourcelist': this.resource
      });
  } else {
    this.sendMsg(BlinkConstant.SignalType.LOGONANDJOIN, this.token, {
      'key': this.channelId,
      'type': this.userType,
      'index': this.talkType,
      'status': this.logonAndJoinStatus,
      'version': this.logonVersion,
      'userName': this.userName,
      'clientType': BlinkConstant.CLIENT_TYPE
      // , 'mediaid': this.userId // 只在融云RCE环境下开启
  });
  }
}
/**
* 请求channelPing信令
*
*/
BlinkEngine.prototype.channelPing = function () {
  this.sendMsg(BlinkConstant.SignalType.CHANNEL_PING, null, {
      'key': this.channelId
  });
}
/**
* 请求leave信令
*
*/
BlinkEngine.prototype.leave = function () {
  this.sendMsg(BlinkConstant.SignalType.LEAVE, null, {
      'key': this.channelId
  });
}
/**
* 请求updateTalkType信令
* @Deprecated
*/
BlinkEngine.prototype.updateTalkType = function () {
  this.sendMsg(BlinkConstant.SignalType.UPDATETALKTYPE, null, {
      'key': this.channelId,
      'index': this.localVideoEnable ? BlinkConstant.TalkType.All : BlinkConstant.TalkType.OnlyAudio
  });
}
/**
* 请求turnTalkType信令
* 
*/
BlinkEngine.prototype.turnTalkType = function (type, index) {
  this.sendMsg(BlinkConstant.SignalType.TURNTALKTYPE, null, {
      'key': this.channelId,
      'type': type,
      'index': index
  });
}
/**
* 请求screenSharing信令
* 
*/
BlinkEngine.prototype.screenSharing = function (index) {
  this.sendMsg(BlinkConstant.SignalType.SCREENSHARING, null, {
      'key': this.channelId,
      'index': index
  });
}
/**
* 请求offer信令
*
*/
BlinkEngine.prototype.offer = function (content, from, bodys) {
  this.sendMsg(BlinkConstant.SignalType.EXCHANGE, content, {
      'key': this.channelId,
      'type': BlinkConstant.ExchangeType.OFFER,
      'to': from
  }, bodys);
}
/**
* 请求answer信令
*
*/
BlinkEngine.prototype.answer = function (desc, from) {
  this.sendMsg(BlinkConstant.SignalType.EXCHANGE, desc, {
      'key': this.channelId,
      'type': BlinkConstant.ExchangeType.ANSWER,
      'to': from
  });
}
/**
* 请求candidate信令
*
*/
BlinkEngine.prototype.candidate = function (candidate, userId) {
  this.sendMsg(BlinkConstant.SignalType.EXCHANGE, candidate, {
      'key': this.channelId,
      'type': BlinkConstant.ExchangeType.CANDIDATE,
      'to': userId
  });
}
/**
* 请求白板信令
*
*/
BlinkEngine.prototype.ewbCreate = function () {
  this.sendMsg(BlinkConstant.SignalType.EWBCREATE, null, {
      'key': this.channelId
  });
}
/**
* 查询白板信令
*
*/
BlinkEngine.prototype.ewbQuery = function () {
  this.sendMsg(BlinkConstant.SignalType.EWBQUERY, null, {
      'key': this.channelId
  });
}
/** ----- 会控请求 ----- */
/**
* 与会人员能力管理
* 
*/
BlinkEngine.prototype.roleChange = function(userId, index) {
this.sendMsg(BlinkConstant.SignalType.ROLECHANGE, null, {
      'key': this.channelId,
      'to': userId,
      'index': index
  });
}
/**
* 申请管理
* 
*/
BlinkEngine.prototype.apply = function(index) {
  this.sendMsg(BlinkConstant.SignalType.APPLY, null, {
      'key': this.channelId,
      'index': index
  });
}
/**
* 与会人员设备管理
* 
*/
BlinkEngine.prototype.manageAction = function(userId, type, index) {
this.sendMsg(BlinkConstant.SignalType.MANAGEACTION, null, {
      'key': this.channelId,
      'to': userId,
      'index': index,
      'type': type
  });
}
/**
* 会控应答
* 
*/
BlinkEngine.prototype.channelAnswer = function(userId, index, type, status) {
var parameters = {
      'key': this.channelId,
      'to': userId,
      'index': index,
      'status': status
  }
if (type != null && type != '') {
  parameters.type = type;
}
this.sendMsg(BlinkConstant.SignalType.CHANNELANSWER, null, parameters);	
}
/** ----- 会控请求 ----- */
/** ----- 大小流请求 ----- */
/**
* 大小流订阅
* 
*/
BlinkEngine.prototype.flowSubscribe = function (flowSubscribes) {
  this.sendMsg(BlinkConstant.SignalType.FLOWSUBSCRIBE, flowSubscribes, {
      'key': this.channelId
  });
}
/** ----- 大小流请求 ----- */
/** ----- 订阅分发请求 ----- */
/**
* 请求update_resource信令
* 
*/
BlinkEngine.prototype.update_resource = function(resource) {
var content = {
  'userId': this.userId,
  'resource': resource
};
content = JSON.stringify(content);
this.sendMsg(BlinkConstant.SignalType.UPDATE_RESOURCE, content, {
      'key': this.channelId
  });
}
/**
* 请求update_subscribe信令
* 
*/
BlinkEngine.prototype.update_subscribe = function(defaultSub, specialSubs) {
var content = {
  'userId': this.userId,
  'defaultSub': defaultSub,
  'specialSub': specialSubs
}
content = JSON.stringify(content);
this.sendMsg(BlinkConstant.SignalType.UPDATE_SUBSCRIBE, content, {
      'key': this.channelId
  });
}
/**
* 请求manage_update_resource_subscribe信令
* 
*/
BlinkEngine.prototype.manage_update_resource_subscribe = function(index, subscribeInfos) {
var content = JSON.stringify(subscribeInfos);
this.sendMsg(BlinkConstant.SignalType.MANAGE_UPDATE_RESOURCE_SUBSCRIBE, content, {
      'key': this.channelId,
      'index': index 
  });
}
/**
* 请求manage_answer_update_resource信令
* 
*/
BlinkEngine.prototype.manage_answer_update_resource = function(index, userId, status, subscribeInfo) {
var content = JSON.stringify(subscribeInfo);
this.sendMsg(BlinkConstant.SignalType.MANAGE_ANSWER_UPDATE_RESOURCE, content, {
      'key': this.channelId,
      'index': index,
      'to': userId,
      'status': status
  });
}
/**
* 请求manage_answer_update_subscribe信令
* 
*/
BlinkEngine.prototype.manage_answer_update_subscribe = function(index, userId, status, subscribeInfo) {
var content = JSON.stringify(subscribeInfo);
this.sendMsg(BlinkConstant.SignalType.MANAGE_ANSWER_UPDATE_SUBSCRIBE, content, {
      'key': this.channelId,
      'index': index,
      'to': userId,
      'status': status
  });
}
/** ----- 订阅分发请求 ----- */
/** ----- 请求信令 ----- */
/** ----- 处理应答信令 ----- */
/**
* 处理join_result应答信令
*
*/
BlinkEngine.prototype.logonAndJoin_result = function (data) {
  var statusCode = data.parameters['statusCode'];
  var isJoined = statusCode == 'OK' ? true : false;
  if (isJoined) {
    var content = data.content; // 返回的结果是包含自己的
      if (this.isSubscribeVersion()) { // 订阅分发版本
        var memberArr = JSON.parse(content);
        for (var i in memberArr) {
              var userId = memberArr[i].userId;
              if (!this.joinedUsers.contains(userId)) {
                  var userType = memberArr[i].userType;
                  var userName = memberArr[i].userName;
                  var resource = memberArr[i].resource;
                  var talkType = this.convertResourceType2TalkType(resource);
                  var defaultSub = memberArr[i].defaultSub;
                var specialSubs = memberArr[i].specialSub;
                  var joinedUser = {
                    'userId': userId,
                    'userType': userType,
                    'talkType': talkType,
                    'userName': userName,
                  'resource': resource,
                  'defaultSub': defaultSub,
                  'specialSubs': specialSubs
                  };
                  this.joinedUsers.put(userId, joinedUser);
                  if (userId != this.userId) {
                      this.blinkEngineEventHandle.call('onUserJoined', {
                          'userId': userId,
                          'userType': userType,
                          'talkType': talkType,
                        'userName': userName,
                      'resource': resource,
                      'defaultSub': defaultSub,
                      'specialSubs': specialSubs
                      });
                  } else {
                    this.userType = userType;
                    this.talkType = talkType;
                  }
              }
          }
      } else {
        var contentArr = content.split("],");
        var member = contentArr.length > 1 ? contentArr[1] : contentArr[0];
        var memberArr = JSON.parse(member);
        for (var i in memberArr) {
              var userId = memberArr[i].userId;
              if (!this.joinedUsers.contains(userId)) {
                  var userType = memberArr[i].type;
                  var talkType = memberArr[i].talktype;
                  var userName = memberArr[i].userName;
                  var screenSharingStatus = memberArr[i].screenSharingStatus;
                  var joinedUser = {
                    'userId': userId,
                    'userType': userType,
                    'talkType': talkType,
                    'userName': userName,
                    'screenSharingStatus': screenSharingStatus
                  };
                  this.joinedUsers.put(userId, joinedUser);
                  if (userId != this.userId) {
                      this.blinkEngineEventHandle.call('onUserJoined', {
                          'userId': userId,
                          'userType': userType,
                          'talkType': talkType,
                          'userName': userName,
                        'screenSharingStatus': screenSharingStatus
                      });
                  } else {
                    this.userType = userType;
                    this.talkType = talkType;
                  }
              }
          }
      }
      // 开始keepAlive
      this.startScheduleKeepAlive();
      if (this.logonAndJoinStatus == BlinkConstant.LogonAndJoinStatus.RECONNECT) { // 断线重连，主动发offer
          var pcClient = this.peerConnections[this.userId];
          if (pcClient != null) { // 只有一人时，值为null，在订阅分发版本中，只有一人时也有peerConnection
              var pc = pcClient['pc'];
              console.warn(new Date(), "reLogonAndJoin createOffer");
              this.createOffer(pc, this.userId, true);
          }
      }
  }
  if (this.logonAndJoinStatus == BlinkConstant.LogonAndJoinStatus.CONNECT // 正常加入
      || (this.logonAndJoinStatus == BlinkConstant.LogonAndJoinStatus.RECONNECT && !isJoined) // 重连加入且加入失败
      || !this.onJoinComplete
  ) {
      this.blinkEngineEventHandle.call('onJoinComplete', {
          'isJoined': isJoined,
          'userType': this.userType
      });
      this.onJoinComplete = true;
  }
}
/**
* 处理channelPing_result应答信令
*
*/
BlinkEngine.prototype.channelPing_result = function (data) {
  // 收到result，停止计时
  this.exitScheduleKeepAliveTimer();

  var statusCode = data.parameters['statusCode'];
  var isOK = statusCode == 'OK' ? true : false;
  if (!isOK) {
      this.keepAliveFailed();
  } else {
      // 重置keepAliveFailedTimes
      this.keepAliveFailedTimes = 0;
  }
}
/**
* 处理leave_result应答信令
*
*/
BlinkEngine.prototype.leave_result = function (data) {
  var statusCode = data.parameters['statusCode'];
  var isLeft = statusCode == 'OK' ? true : false;
  if (isLeft) {
      this.clear();
  }
  this.blinkEngineEventHandle.call('onLeaveComplete', {
      'isLeft': isLeft
  });
}
/**
* 处理turnTalkType_result应答信令
* 
*/
BlinkEngine.prototype.turnTalkType_result = function (data) {
  var statusCode = data.parameters['statusCode'];
  var isSuccess = statusCode == 'OK' ? true : false;
  this.blinkEngineEventHandle.call('onControlAudioVideoDevice', {
    'isSuccess': isSuccess
  });
}
/**
* 处理ewb_create_result应答信令
*
*/
BlinkEngine.prototype.ewbCreate_result = function (data) {
  var statusCode = data.parameters['statusCode'];
  var isSuccess = statusCode == 'OK' ? true : false;
  var url = '';
  if (isSuccess && data.content) {
      url = data.content;
  }
  this.ewbUrl = url; // 观察者模式url返回为空
  this.blinkEngineEventHandle.call('onWhiteBoardURL', {
      'isSuccess': isSuccess,
      'url': this.ewbUrl
  });
}
/**
* 处理ewb_query_result应答信令
*
*/
BlinkEngine.prototype.ewbQuery_result = function (data) {
  var statusCode = data.parameters['statusCode'];
  var isSuccess = statusCode == 'OK' ? true : false;
  var url = '';
  if (isSuccess && data.content) {
      url = data.content;
  }
  this.ewbUrl = url; // 当前会议没有白板url返回为空
  this.blinkEngineEventHandle.call('onWhiteBoardQuery', {
      'isSuccess': isSuccess,
      'url': this.ewbUrl
  });
}
/** ----- 会控应答 ----- */
/**
* 处理roleChange应答信令
*
*/
BlinkEngine.prototype.roleChange_result = function (data) {
var statusCode = data.parameters['statusCode'];
var isSuccess = statusCode == 'OK' ? true : false;
var index = data.parameters['index'];
var to = data.parameters['to'];
  if (index == BlinkConstant.MeetingActionType.RoleChange.DegradeToObserver) { // 将与会人降级为观察者
    this.blinkEngineEventHandle.call('onDegradeNormalUserToObserver', {
          'isSuccess': isSuccess,
          'userId': to
      });
  } else if (index == BlinkConstant.MeetingActionType.RoleChange.UpgradeToNormal) { // 邀请观察者发言
    this.blinkEngineEventHandle.call('onDegradeNormalUserToObserver', {
          'isSuccess': isSuccess,
          'userId': to
      });
  } else if (index == BlinkConstant.MeetingActionType.RoleChange.RemoveUser) { // 移除与会人员
    this.blinkEngineEventHandle.call('onRemoveUser', {
          'isSuccess': isSuccess,
          'userId': to
      });
  }
};
/**
* 处理pply应答信令
*
*/
BlinkEngine.prototype.apply_result = function (data) {
var statusCode = data.parameters['statusCode'];
var isSuccess = statusCode == 'OK' ? true : false;
var index = data.parameters['index'];
  if (index == BlinkConstant.MeetingActionType.Apply.RequestUpgradeToNormal) { // 观察者主动要求发言
    this.blinkEngineEventHandle.call('onObserverRequestBecomeNormalUser', {
          'isSuccess': isSuccess,
      });
  } else if (index == BlinkConstant.MeetingActionType.Apply.GetHostAuthority) { // 获取主持人权限
    if (isSuccess) {
      // 变更为主持人
      this.change2Host(this.userId);
    }
    this.blinkEngineEventHandle.call('onNormalUserRequestHostAuthority', {
          'isSuccess': isSuccess,
      });
  } else if (index == BlinkConstant.MeetingActionType.Apply.GetInviteUrl) { // 生成邀请链接
    var inviteUrl = '';
    if (isSuccess && data.content) {
      inviteUrl = data.content;
    }
    this.blinkEngineEventHandle.call('onGetInviteURL', {
          'isSuccess': isSuccess,
          'url': inviteUrl
      });
  }
};
/**
* 处理manageAction应答信令
*
*/
BlinkEngine.prototype.manageAction_result = function (data) {
var statusCode = data.parameters['statusCode'];
  var isSuccess = statusCode == 'OK' ? true : false;
  var type = data.parameters['type'];
  var index = data.parameters['index'];
  var to = data.parameters['to'];
this.blinkEngineEventHandle.call('onHostControlUserDevice', {
      'isSuccess': isSuccess,
      'userId': to,
      'deviceType': type,
      'isOpen': index == BlinkConstant.OperationType.OPEN ? true : false
  });
};
/**
* 处理channelAnswer应答信令
*
*/
BlinkEngine.prototype.channelAnswer_result = function (data) {
var statusCode = data.parameters['statusCode'];
  var isSuccess = statusCode == 'OK' ? true : false;
  var index = data.parameters['index'];
  var type = data.parameters['type'];
  var to = data.parameters['to'];
  var status = data.parameters['status'];
  var isAccept = status == BlinkConstant.MeetingAnswerType.Accept ? true : false;
  if (index == BlinkConstant.MeetingActionType.ChannelAnswer.UpgradeToNormal) { // 邀请观察者发言
    if (isSuccess && isAccept) {
      // 变更为普通与会人员
        this.change2Normal(this.userId);
    }
    this.blinkEngineEventHandle.call("onAnswerUpgradeObserverToNormalUser", {
      'isSuccess': isSuccess,
      'isAccept': isAccept
      });
  } else if (index == BlinkConstant.MeetingActionType.ChannelAnswer.RequestUpgradeToNormal) { // 观察者主动要求发言
    if (isSuccess && isAccept) {
      // 变更为普通与会人员
      this.change2Normal(to);
    }
      this.blinkEngineEventHandle.call("onAnswerObserverRequestBecomeNormalUser", {
        'isSuccess': isSuccess,
      'isAccept': isAccept
      });
  } else if (index == BlinkConstant.MeetingActionType.ChannelAnswer.DegradeToObserver) { // 将与会人降级为观察者
    if (isSuccess && isAccept) {
      // 变更为观察者
        this.change2Observer(this.userId);
    }
      this.blinkEngineEventHandle.call("onAnswerDegradeNormalUserToObserver", {
        'isSuccess': isSuccess,
      'isAccept': isAccept
      });
  } else if (index == BlinkConstant.MeetingActionType.ChannelAnswer.InviteToOpen || index == BlinkConstant.MeetingActionType.ChannelAnswer.InviteToClose) { // 邀请打开/关闭设备
    var isOpen = index == BlinkConstant.MeetingActionType.ChannelAnswer.InviteToOpen ? true : false;
    if (isSuccess && isAccept) {
      // 变更talkType
      this.changeTalkType(this.userId, type, isOpen);
    }
    this.blinkEngineEventHandle.call("onAnswerHostControlUserDevice", {
      'isSuccess': isSuccess,
          'deviceType': type,
          'isOpen': isOpen,
      'isAccept': isAccept
      });
  }
};
/** ----- 会控应答 ----- */
/** ----- 订阅分发应答 ----- */
/**
* 处理update_resource应答信令
* 
*/
BlinkEngine.prototype.update_resource_result = function(data) {

}
/**
* 处理update_subscribe应答信令
* 
*/
BlinkEngine.prototype.update_subscribe_result = function(data) {

}
/**
* 处理manage_update_resource_subscribe应答信令
* 
*/
BlinkEngine.prototype.manage_update_resource_subscribe_result = function(data) {

}
/**
* 处理manage_answer_update_resource应答信令
* 
*/
BlinkEngine.prototype.manage_answer_update_resource_result = function(data) {
var statusCode = data.parameters['statusCode'];
var isSuccess = statusCode == 'OK' ? true : false;
var index = data.parameters['index'];
var to = data.parameters['to'];
  var status = data.parameters['status'];
  var isAccept = status == BlinkConstant.MeetingAnswerType.Accept ? true : false;
var subscribeInfo = JSON.parse(data.content.replace(new RegExp('\'', 'g'), '"'));
var userId = subscribeInfo.userId;
var userType = subscribeInfo.userType;
var resource = subscribeInfo.resource;

if (resource != null && userType == null) { // 邀请打开/关闭设备
  var oldResource = this.resource;
  var operation = this.convertOperation(oldResource, resource);
  var deviceType = operation.deviceType;
  var operationType = operation.operationType;
  var isOpen = operationType == BlinkConstant.OperationType.OPEN ? true : false;
  if (isSuccess && isAccept) {
    // 变更资源
    this._updateResource(resource);
  }
    this.blinkEngineEventHandle.call("onAnswerHostControlUserDevice", {
      'isSuccess': isSuccess,
          'deviceType': deviceType,
          'isOpen': isOpen,
      'isAccept': isAccept,
        'subscribeInfo': subscribeInfo
      });
} else if (userType != null) { // 升降级
  if (index == BlinkConstant.ManageType.Manage) {
    var oldUserType = this.userType;
    if (oldUserType == BlinkConstant.UserType.NORMAL && userType == BlinkConstant.UserType.OBSERVER) { // 将与会人降级为观察者
      if (isSuccess && isAccept) {
          // 变更为观察者
            this.change2Observer(this.userId);
        }
          this.blinkEngineEventHandle.call("onAnswerDegradeNormalUserToObserver", {
            'isSuccess': isSuccess,
          'isAccept': isAccept,
            'subscribeInfo': subscribeInfo
          });
    } else if (oldUserType == BlinkConstant.UserType.OBSERVER && userType == BlinkConstant.UserType.NORMAL) { // 邀请观察者发言
      if (isSuccess && isAccept) {
          // 变更为普通与会人员
            this.change2Normal(this.userId);
        }
        this.blinkEngineEventHandle.call("onAnswerUpgradeObserverToNormalUser", {
          'isSuccess': isSuccess,
          'isAccept': isAccept,
            'subscribeInfo': subscribeInfo
          });
    }
  } else if (index == BlinkConstant.ManageType.Apply) { // 观察者主动要求发言
    if (isSuccess && isAccept) {
        // 变更为普通与会人员
        this.change2Normal(to);
      }
        this.blinkEngineEventHandle.call("onAnswerObserverRequestBecomeNormalUser", {
          'isSuccess': isSuccess,
        'isAccept': isAccept,
          'subscribeInfo': subscribeInfo
        });
  }
}
}
/**
* 处理manage_answer_update_subscribe应答信令
* 
*/
BlinkEngine.prototype.manage_answer_update_subscribe_result = function(data) {

}
/** ----- 订阅分发应答 ----- */
/** ----- 处理应答信令 ----- */
/** ----- 处理通知信令 ----- */
/**
* 处理joined通知信令
*
*/
BlinkEngine.prototype.joined = function (data) {
if (this.isSubscribeVersion()) { // 订阅分发版本
  var content = data.content;
  var member = JSON.parse(content);
  var userId = member.userId;
    var userType = member.userType;
    var userName = member.userName;
    var resource = member.resource;
    var talkType = this.convertResourceType2TalkType(resource);
    var defaultSub = member.defaultSub;
    var specialSubs = member.specialSub;
  if (!this.joinedUsers.contains(userId)) {
      var joinedUser = {
          'userId': userId,
          'userType': userType,
          'talkType': talkType,
          'userName': userName,
          'resource': resource,
          'defaultSub': defaultSub,
          'specialSubs': specialSubs
        };
        this.joinedUsers.put(userId, joinedUser);
    }
//	    if (userType == BlinkConstant.UserType.OBSERVER) { // 观察者
    this.blinkEngineEventHandle.call('onUserJoined', {
        'userId': userId,
        'userType': userType,
        'talkType': talkType,
        'userName': userName,
        'resource': resource,
        'defaultSub': defaultSub,
        'specialSubs': specialSubs
    });
//	    }
} else {
  var userId = data.parameters['serverData'];
    var userType = data.parameters['type'];
    var talkType = data.parameters['index'];
    var userName = data.parameters['userName'];
    if (!this.joinedUsers.contains(userId)) {
      var joinedUser = {
          'userId': userId,
          'userType': userType,
          'talkType': talkType,
          'userName': userName
        };
        this.joinedUsers.put(userId, joinedUser);
    }
//	    if (userType == BlinkConstant.UserType.OBSERVER) { // 观察者
    this.blinkEngineEventHandle.call('onUserJoined', {
        'userId': userId,
        'userType': userType,
        'talkType': talkType,
        'userName': userName
    });
//	    }
}
}
/**
* 处理update_talktype通知信令
* @Deprecated
*/
BlinkEngine.prototype.updateTalktype_notify = function (data) {
  var userId = data.parameters['serverData'];
  var userType = data.parameters['type'];
  var talkType = data.parameters['index'];
  this.blinkEngineEventHandle.call('onUserUpdatedTalkType', {
      'userId': userId,
      'userType': userType,
      'talkType': talkType
  });
};
/**
* 处理turn_talktype通知信令
* 
*/
BlinkEngine.prototype.turnTalktype_notify = function (data) {
var userId = data.parameters['serverData'];
  var type = data.parameters['type'];
  var index = data.parameters['index'];
  var isOpen = index == BlinkConstant.OperationType.OPEN ? true : false;
  // 变更talkType
  this.changeTalkType(userId, type, isOpen);
  // @Deprecated
  this.blinkEngineEventHandle.call('onTurnTalkType', {
      'userId': userId,
      'deviceType': type,
      'isOpen': isOpen
  });
  this.blinkEngineEventHandle.call('onNotifyControlAudioVideoDevice', {
      'userId': userId,
      'deviceType': type,
      'isOpen': isOpen
  });
}
/**
* 处理screen_sharing通知信令
* 
*/
BlinkEngine.prototype.screenSharing_notify = function (data) {
var userId = data.parameters['serverData'];
  var index = data.parameters['index'];
  var isOpen = index == BlinkConstant.OperationType.OPEN ? true : false;
  this.blinkEngineEventHandle.call('onNotifySharingScreen', {
      'userId': userId,
      'isOpen': isOpen
  });
}
/**
* 处理left通知信令
*
*/
BlinkEngine.prototype.left = function (data) {
  var userId = data.parameters['serverData'];
  var userType = data.parameters['type'];
  var user = this.joinedUsers.get(userId);
  this.joinedUsers.remove(userId);
  this.remoteStreams.remove(userId);
  this.remoteScreenStreams.remove(userId);
  this.remoteCnameMap.remove(userId);
  this.remoteSdpMap.remove(userId);
  // 移除trackId和userId的对应关系
  var removeTrackIdArr = [];
  this.remoteTrackIdMap.getEntrys().forEach(function (trackIdEntry) {
    if (userId == trackIdEntry.value) {
      removeTrackIdArr.push(trackIdEntry.key);
    }
  });
  var blinkEngine = this;
  removeTrackIdArr.forEach(function (trackId) {
    blinkEngine.remoteTrackIdMap.remove(trackId);
  });
  if (this.isSubscribeVersion()) { // 订阅分发版本
    // 不关闭连接
  } else {
    if (this.joinedUsers.size() == 1) { // 当没有其它用户在会议时
      // 重置offerStatus状态
      this.offerStatus = null;
      // 关闭连接
      this.closePeerConnection(this.userId);
    }
  }
  this.blinkEngineEventHandle.call('onUserLeft', {
    'userId': userId,
    'userType': userType
  });
}

/**
* 处理OfferRequest通知信令
*
*/
BlinkEngine.prototype.offerRequest = function (data) {
  var from = data.parameters['serverData'];

  var pcClient = this.preparePeerConnection(from);
  var pc = pcClient['pc'];
  if (this.userType != BlinkConstant.UserType.OBSERVER && this.localStream) { // 本地视频流
      pc.addStream(this.localStream);
  }
  if (this.userType != BlinkConstant.UserType.OBSERVER && this.isScreenStreamSeparate && this.localScreenStream && this.screenSharingStatus) { // 屏幕共享流分离且开启了屏幕共享
    pc.addStream(this.localScreenStream);
  }
  var type = data.parameters['type'];
  if (type == '2' && this.userType != BlinkConstant.UserType.OBSERVER && this.isEnableMinStream && this.localMinStream) { // 小流
      pc.addStream(this.localMinStream);
  }
  console.warn(new Date(), "offerRequest createOffer");
  var subscribeInfo;
  if (this.isSubscribeVersion()) { // 订阅分发版本
    subscribeInfo = {
    'userId': this.userId,
    'defaultSub': this.defaultSub,
    'specialSub': this.specialSubs
    }
  }
  this.createOffer(pc, from, false, subscribeInfo);
};
/**
* 处理exchange通知信令
*
*/
BlinkEngine.prototype.exchange = function (data) {
  var type = data.parameters['type'];
  if (type == BlinkConstant.ExchangeType.OFFER) {
      this.handleOffer(data);
  } else if (type == BlinkConstant.ExchangeType.ANSWER) {
      this.handleAnswer(data);
  } else if (type == BlinkConstant.ExchangeType.CANDIDATE) {
      this.handleCandidate(data);
  }
};
/**
* 处理ewb_create_notify通知信令
* 
*/
BlinkEngine.prototype.ewbCreate_notify = function (data) {
var userId = data.parameters['serverData'];
  this.blinkEngineEventHandle.call('onNotifyCreateWhiteBoard', {
      'userId': userId,
  });
};
/** ----- 会控通知 ----- */
/**
* 处理roleChange通知信令
* 
*/
BlinkEngine.prototype.roleChange_notify = function (data) {
  var index = data.parameters['index'];
  var from = data.parameters['from'];
  if (index == BlinkConstant.MeetingActionType.RoleChange.DegradeToObserver) { // 将与会人降级为观察者
    this.blinkEngineEventHandle.call("onNotifyDegradeNormalUserToObserver", {
          'hostId': from
      });
  } else if (index == BlinkConstant.MeetingActionType.RoleChange.UpgradeToNormal) { // 邀请观察者发言
      this.blinkEngineEventHandle.call("onNotifyUpgradeObserverToNormalUser", {
          'hostId': from
      });
  } else if (index == BlinkConstant.MeetingActionType.RoleChange.RemoveUser) { // 移除与会人员
      this.blinkEngineEventHandle.call("onNotifyRemoveUser", {
          'hostId': from
      });
  }
};
/**
* 处理apply通知信令
* 
*/
BlinkEngine.prototype.apply_notify = function (data) {
  var index = data.parameters['index'];
  var from = data.parameters['from'];
  if (index == BlinkConstant.MeetingActionType.Apply.RequestUpgradeToNormal) { // 观察者主动要求发言
    this.blinkEngineEventHandle.call("onNotifyObserverRequestBecomeNormalUser", {
          'userId': from
      });
  } else if (index == BlinkConstant.MeetingActionType.Apply.GetHostAuthority) { // 获取主持人权限
    // 变更为主持人
    this.change2Host(from);
      this.blinkEngineEventHandle.call("onNotifyNormalUserRequestHostAuthority", {
          'userId': from
      });
  }
};
/**
* 处理manageAction通知信令
* 
*/
BlinkEngine.prototype.manageAction_notify = function (data) {
  var from = data.parameters['from'];
  var type = data.parameters['type'];
  var index = data.parameters['index'];
this.blinkEngineEventHandle.call("onNotifyHostControlUserDevice", {
      'hostId': from,
      'deviceType': type,
      'isOpen': index == BlinkConstant.OperationType.OPEN ? true : false
  });
};
/**
* 处理channelAnswer通知信令
* 
*/
BlinkEngine.prototype.channelAnswer_notify = function (data) {
var index = data.parameters['index'];
// 发起者的uid
  var from = data.parameters['from'];
  // 原操作发起者的uid
  var serverData = data.parameters['serverData'];
  var type = data.parameters['type'];
  var status = data.parameters['status'];
  var isAccept = status == BlinkConstant.MeetingAnswerType.Accept ? true : false;
  if (index == BlinkConstant.MeetingActionType.ChannelAnswer.UpgradeToNormal) { // 邀请观察者发言
    if (isAccept) {
      // 变更为普通与会人员
      this.change2Normal(from);
    }
    this.blinkEngineEventHandle.call("onNotifyAnswerUpgradeObserverToNormalUser", {
          'userId': from,
          'isAccept': isAccept
      });
  } else if (index == BlinkConstant.MeetingActionType.ChannelAnswer.RequestUpgradeToNormal) { // 观察者主动要求发言
    if (isAccept) {
      // 变更为普通与会人员
      this.change2Normal(serverData);
    }
      this.blinkEngineEventHandle.call("onNotifyAnswerObserverRequestBecomeNormalUser", {
          'userId': serverData,
          'isAccept': isAccept
      });
  } else if (index == BlinkConstant.MeetingActionType.ChannelAnswer.DegradeToObserver) { // 将与会人降级为观察者
    if (isAccept) {
      // 变更为观察者
      this.change2Observer(from);
    }
      this.blinkEngineEventHandle.call("onNotifyAnswerDegradeNormalUserToObserver", {
          'userId': from,
          'isAccept': isAccept
      });
  } else if (index == BlinkConstant.MeetingActionType.ChannelAnswer.InviteToOpen || index == BlinkConstant.MeetingActionType.ChannelAnswer.InviteToClose) { // 邀请打开/关闭设备
      var isOpen = index == BlinkConstant.MeetingActionType.ChannelAnswer.InviteToOpen ? true : false;
      if (isAccept) {
        // 变更talkType
        this.changeTalkType(from, type, isOpen);
      }
    this.blinkEngineEventHandle.call("onNotifyAnswerHostControlUserDevice", {
          'userId': from,
          'deviceType': type,
          'isOpen': isOpen,
          'isAccept': isAccept
      });
  }
};
/** ----- 会控通知 ----- */
/** ----- 订阅分发通知 ----- */
/**
* 处理update_resource通知信令
* 
*/
BlinkEngine.prototype.update_resource_notify = function (data) {
var subscribeInfo = JSON.parse(data.content);
var userId = subscribeInfo.userId;
var resource = subscribeInfo.resource;
this.blinkEngineEventHandle.call('onNotifyResourceUpdated', {
      'userId': userId,
      'resource': resource
  });

var user = this.joinedUsers.get(userId);
var oldResource = user.resource;
// 变更resource
this.changeResource(userId, resource);
// 转换operation
var operation = this.convertOperation(oldResource, resource);
// 通知
var deviceType = operation.deviceType;
var operationType = operation.operationType;
if (deviceType != null && operationType != null) {
  var isOpen = operationType == BlinkConstant.OperationType.OPEN ? true : false;
  if (deviceType == BlinkConstant.DeviceType.ScreenShare) { // 屏幕共享
//			this.blinkEngineEventHandle.call('onNotifySharingScreen', {
//				'userId': userId,
//				'isOpen': isOpen
//		    });
  } else {
    // 摄像头或麦克风
    // @Deprecated
    this.blinkEngineEventHandle.call('onTurnTalkType', {
      'userId': userId,
      'deviceType': deviceType,
      'isOpen': isOpen
    });
    this.blinkEngineEventHandle.call('onNotifyControlAudioVideoDevice', {
      'userId': userId,
      'deviceType': deviceType,
      'isOpen': isOpen
    });
  }
}
}
/**
* 处理update_subscribe通知信令
* 
*/
BlinkEngine.prototype.update_subscribe_notify = function (data) {
var subscribeInfo = JSON.parse(data.content);
var userId = subscribeInfo.userId;
var defaultSub = subscribeInfo.defaultSub;
var specialSubs = subscribeInfo.specialSub;
this.blinkEngineEventHandle.call('onNotifySubscribeUpdated', {
      'userId': userId,
      'defaultSub': defaultSub,
      'specialSubs': specialSubs
  });
}
/**
* 处理manage_update_resource_subscribe通知信令
* 
*/
BlinkEngine.prototype.manage_update_resource_notify = function (data) {
var index = data.parameters['index'];
var from = data.parameters['from'];
var subscribeInfo = JSON.parse(data.content);
var userId = subscribeInfo.userId;
var userType = subscribeInfo.userType;
var resource = subscribeInfo.resource;

if (resource != null && userType == null) { // 邀请打开/关闭设备
  var oldResource = this.resource;
  var operation = this.convertOperation(oldResource, resource);
  var deviceType = operation.deviceType;
  var operationType = operation.operationType;
  var isOpen = operationType == BlinkConstant.OperationType.OPEN ? true : false;
  this.blinkEngineEventHandle.call("onNotifyHostControlUserDevice", {
        'hostId': from,
        'deviceType': deviceType,
        'isOpen': isOpen,
        'subscribeInfo': subscribeInfo
    });
} else if (userType != null) { // 升降级
  if (index == BlinkConstant.ManageType.Manage) {
    var oldUserType = this.userType;
    if (oldUserType == BlinkConstant.UserType.NORMAL && userType == BlinkConstant.UserType.OBSERVER) { // 将与会人降级为观察者
      this.blinkEngineEventHandle.call("onNotifyDegradeNormalUserToObserver", {
              'hostId': from,
            'subscribeInfo': subscribeInfo
          });
    } else if (oldUserType == BlinkConstant.UserType.OBSERVER && userType == BlinkConstant.UserType.NORMAL) { // 邀请观察者发言
      this.blinkEngineEventHandle.call("onNotifyUpgradeObserverToNormalUser", {
              'hostId': from,
            'subscribeInfo': subscribeInfo
          });
    }
  } else if (index == BlinkConstant.ManageType.Apply) { // 观察者主动要求发言
    this.blinkEngineEventHandle.call("onNotifyObserverRequestBecomeNormalUser", {
            'userId': from,
          'subscribeInfo': subscribeInfo
        });
  }
}
}
/**
* 处理manage_update_subscribe_subscribe通知信令
* 
*/
BlinkEngine.prototype.manage_update_subscribe_notify = function (data) {
// onNotifySubscribeManaged
}
/**
* 处理manage_answer_update_resource通知信令
* 
*/
BlinkEngine.prototype.manage_answer_update_resource_notify = function (data) {
var index = data.parameters['index'];
  var from = data.parameters['from'];
  var serverData = data.parameters['serverData'];
  var status = data.parameters['status'];
  var isAccept = status == BlinkConstant.MeetingAnswerType.Accept ? true : false;
  var subscribeInfo = JSON.parse(data.content.replace(new RegExp('\'', 'g'), '"'));
var userId = subscribeInfo.userId;
var userType = subscribeInfo.userType;
var resource = subscribeInfo.resource;

if (resource != null && userType == null) { // 邀请打开/关闭设备
  var user = this.joinedUsers.get(from);
  if (user != null) {
    var oldResource = user.resource;
    var operation = this.convertOperation(oldResource, resource);
    var deviceType = operation.deviceType;
    var operationType = operation.operationType;
    var isOpen = operationType == BlinkConstant.OperationType.OPEN ? true : false;
    if (isAccept) {
      // 变更resource
          this.changeResource(from, resource);
    }
    this.blinkEngineEventHandle.call("onNotifyAnswerHostControlUserDevice", {
            'userId': from,
            'deviceType': deviceType,
            'isOpen': isOpen,
            'isAccept': isAccept,
          'subscribeInfo': subscribeInfo
        });
  }
} else if (userType != null) { // 升降级
  if (index == BlinkConstant.ManageType.Manage) {
    var user = this.joinedUsers.get(from);
    if (user != null) {
      var oldUserType = user.userType;
      if (oldUserType == BlinkConstant.UserType.NORMAL && userType == BlinkConstant.UserType.OBSERVER) { // 将与会人降级为观察者
        if (isAccept) {
            // 变更为观察者
            this.change2Observer(from);
          }
            this.blinkEngineEventHandle.call("onNotifyAnswerDegradeNormalUserToObserver", {
                'userId': from,
                'isAccept': isAccept,
              'subscribeInfo': subscribeInfo
            });
      } else if (oldUserType == BlinkConstant.UserType.OBSERVER && userType == BlinkConstant.UserType.NORMAL) { // 邀请观察者发言
        if (isAccept) {
            // 变更为普通与会人员
            this.change2Normal(from);
          }
          this.blinkEngineEventHandle.call("onNotifyAnswerUpgradeObserverToNormalUser", {
                'userId': from,
                'isAccept': isAccept,
              'subscribeInfo': subscribeInfo
            });
      }
    }
  } else if (index == BlinkConstant.ManageType.Apply) { // 观察者主动要求发言
    if (isAccept) {
        // 变更为普通与会人员
        this.change2Normal(serverData);
      }
        this.blinkEngineEventHandle.call("onNotifyAnswerObserverRequestBecomeNormalUser", {
            'userId': serverData,
            'isAccept': isAccept,
          'subscribeInfo': subscribeInfo
        });
  }
}
}
/**
* 处理manage_answer_update_subscribe通知信令
* 
*/
BlinkEngine.prototype.manage_answer_update_subscribe_notify = function (data) {

}
/** ----- 订阅分发通知 ----- */
/** ----- 处理通知信令 ----- */
//
// return BlinkEngine;
// });
/** ----- BlinkEngine ----- */

/** ----- BlinkEngineEventHandle ----- */
// var BlinkEngineEventHandle = (function() {
/**
* 构造函数
*
*/
var BlinkEngineEventHandle = function (config) {
  /** 事件集合 */
  this.eventHandles = {};
  return this;
}
/**
* 绑定事件
*
*/
BlinkEngineEventHandle.prototype.on = function (eventName, event) {
  this.eventHandles[eventName] = event;
};
/**
* 调用事件
*
*/
BlinkEngineEventHandle.prototype.call = function (eventName, data) {
  for (var eventHandle in this.eventHandles) {
      if (eventName === eventHandle) {
          return this.eventHandles[eventName](data);
      }
  }
  console.info(new Date(), 'EventHandle ' + eventName + ' do not have defined function');
};
//
// return BlinkEngineEventHandle;
// });
/** ----- BlinkEngineEventHandle ----- */

/** ----- BlinkConnectionStatsReport ----- */
var BlinkConnectionStatsReport = function (blinkEngine) {
this.blinkEngine = blinkEngine;

  this.statsReportSend = {};
  this.statsReportRecv = {};

  // 本地丢包率
  this.packetSendLossRate = 0;
  // 音频输入电平
  this.audioInputLevel = 0;
  // 音频接收电平
this.audioReceivedLevel = [];
this.currentLevel = [0, 1, 2, 3, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9];
}
/**
* parse statsReport
*
*/
BlinkConnectionStatsReport.prototype.parseStatsReport = function (report) {
var statsReportSend = {};
  var recvVideoMap = new BlinkMap();
  var recvAudioMap = new BlinkMap();
  var statsReportRecv = {};

  for (var i in report) {
      var now = report[i];
      if (now.type == 'ssrc') {
          if (now.id.indexOf("recv") != -1) {
            if (now.mediaType == 'video') {
              var recvVideo = {};
              recvVideo.googTrackId = now.googTrackId;
              recvVideo.googCodecName = now.googCodecName
              recvVideo.googCurrentDelayMs = now.googCurrentDelayMs;
              recvVideo.googDecodeMs = now.googDecodeMs;
              recvVideo.googFrameHeightReceived = now.googFrameHeightReceived;
              recvVideo.googFrameRateDecoded = now.googFrameRateDecoded;
              recvVideo.googFrameRateOutput = now.googFrameRateOutput;
              recvVideo.googFrameRateReceived = now.googFrameRateReceived;
              recvVideo.googFrameWidthReceived = now.googFrameWidthReceived;
              recvVideo.packetsLost = now.packetsLost;
              recvVideo.packetsReceived = now.packetsReceived;
              recvVideoMap.put(recvVideo.googTrackId, recvVideo);
            } else if (now.mediaType == 'audio') {
              var recvAudio = {};
              recvAudio.googTrackId = now.googTrackId;
              recvAudio.audioOutputLevel = now.audioOutputLevel;
              recvAudioMap.put(recvAudio.googTrackId, recvAudio);
            }
          } else if (now.id.indexOf("send") != -1) {
            if (now.mediaType == 'video') {
              var sendVideo = {};
              sendVideo.googCodecName = now.googCodecName;
              sendVideo.googAvgEncodeMs = now.googAvgEncodeMs;
              sendVideo.googFrameHeightInput = now.googFrameHeightInput;
              sendVideo.googFrameHeightSent = now.googFrameHeightSent;
              sendVideo.googFrameRateSent = now.googFrameRateSent;
              sendVideo.googFrameWidthInput = now.googFrameWidthInput;
              sendVideo.googFrameWidthSent = now.googFrameWidthSent;
              sendVideo.googFrameRateInput = now.googFrameRateInput;
              sendVideo.packetsLost = now.packetsLost;
              sendVideo.packetsSent = now.packetsSent;
              statsReportSend.video = sendVideo;
            } else if (now.mediaType == 'audio') {
              var sendAudio = {};
              sendAudio.audioInputLevel = now.audioInputLevel;
              statsReportSend.audio = sendAudio;
            }
    }
  }
}
  statsReportRecv.video = recvVideoMap;
  statsReportRecv.audio = recvAudioMap;
  
  var preStatsReportSend = this.statsReportSend;
this.statsReportSend = statsReportSend;
this.statsReportRecv = statsReportRecv;
// 本地丢包率
var packetSendLossRate = 0;
packetSendLossRate = this.calculateLossRate(statsReportSend.video, preStatsReportSend.video);
this.packetSendLossRate = packetSendLossRate;
// 输入音平
var audioInputLevel = 0;
audioInputLevel = statsReportSend.audio == null ? 0 : statsReportSend.audio.audioInputLevel;
audioInputLevel = this.calculateAudioLevel(audioInputLevel);
this.audioInputLevel = audioInputLevel;
// 接收音平
var audioReceivedLevel = [];
var blinkConnectionStatsReport = this;
recvAudioMap.getEntrys().forEach(function(recvAudioEntry) {
  var trackId = recvAudioEntry.key;
  var userId = blinkConnectionStatsReport.blinkEngine.remoteTrackIdMap.get(trackId);
  if (userId != null) { // userId已退出
    var audioOutputLevel = recvAudioEntry.value.audioOutputLevel;
      audioOutputLevel = blinkConnectionStatsReport.calculateAudioLevel(audioOutputLevel);
      audioReceivedLevel.push({
        'userId': userId,
        'trackId': trackId,
        'audioOutputLevel': audioOutputLevel
      });
  }
  });
  this.audioReceivedLevel = audioReceivedLevel;
}
/**
* 计算丢包率
* 
*/
BlinkConnectionStatsReport.prototype.calculateLossRate = function (nowStats, preStats) {
var prePacketsSent = (preStats == null || preStats.packetsSent == null || preStats.packetsSent == "") ? 0 : preStats.packetsSent;
  var prePacketsLost = (preStats == null || preStats.packetsLost == null || preStats.packetsLost == "") ? 0 : preStats.packetsLost;
  
  var nowPacketsSent = (nowStats == null || nowStats.packetsSent == null || nowStats.packetsSent == "") ? 0 : nowStats.packetsSent;
  var nowPacketsLost = (nowStats == null || nowStats.packetsLost == null || nowStats.packetsLost == "") ? 0 : nowStats.packetsLost;
  
if (nowPacketsSent == 0) { // 还未发数据
  return 0;
}
if ((nowPacketsSent - prePacketsSent) == 0) { // 发出的包数量为0，则表示全部丢失，丢包率为100%
  return 100;
}
var packetSendLossRate = (nowPacketsLost - prePacketsLost) * 100 / ((nowPacketsSent - prePacketsSent) + (nowPacketsLost - prePacketsLost)); 
return parseInt(packetSendLossRate);
}
/**
* 计算音平
* 
*/
BlinkConnectionStatsReport.prototype.calculateAudioLevel = function (audioLevel) {
var pos = (audioLevel == null || audioLevel == "") ? 0 : parseInt(audioLevel / 1000);
return this.currentLevel[pos];
}
/** ----- BlinkConnectionStatsReport ----- */

/** ----- BlinkVideoView ----- */
var BlinkVideoView = function () {

}

/** ----- BlinkUtil ----- */
var BlinkUtil = {
  /**
   * 获取websocket地址列表
   *
   */
  getWsUrlList: function (wsNavUrl, callback) {
      var wsUrlList;
      BlinkAjax({
          type: "GET",
          url: wsNavUrl,
          async: true,
          data: {
              rand: Math.random()
          },
          dataType: "JSON",
          success: function (data) {
              callback(data);
          },
          error: function (error) {
              console.error(new Date(), "request nav error: ", error);
              throw error;
          }
      });
  },
  /**
 * 获取媒体信息
 * 
 */
  getMedia: function (mediaConfig) {
      return new Promise(function (resolve, reject) {
          navigator.getUserMedia(mediaConfig, resolve, reject);
      })
  },
  /**
   * SDP设置带宽
   *
   * @param sdp
   * @param bandWidthParam
   * @returns
   */
  setBandWidth: function (sdp, bandWidthParam) {
    var currentBandWidth = JSON.parse(JSON.stringify(bandWidthParam));
    var startBandWidth;
    if (BlinkGlobal.bandWidthCount == 0) {
      startBandWidth = (currentBandWidth.min + currentBandWidth.max) / 2;
    }
      // 给带宽设置增加计数器，使每次设置的最小码率不同，防止码率一样WebRTC将码率重置成默认最小值
      BlinkGlobal.bandWidthCount++;
      if (BlinkGlobal.bandWidthCount % 2 == 0) {
          currentBandWidth.min = currentBandWidth.min + 1;
      }

      // set BAS
      sdp = sdp.replace(/a=mid:video\n/g, 'a=mid:video\nb=AS:'
          + currentBandWidth.max + '\n');

      // 查找最优先用的视频代码
      var sep1 = "\n";
      var findStr1 = "m=video";

      var sdpArr = sdp.split(sep1);
      // 查找findStr1
      var findIndex1 = BlinkUtil.findLine(sdpArr, findStr1);
      if (findIndex1 == null) {
          return sdp;
      }

      var sep2 = " ";

      var videoDescArr1 = sdpArr[findIndex1].split(sep2);
      // m=video 9 UDP/TLS/RTP/SAVPF
      var firstVideoCode = videoDescArr1[3];
      var findStr2 = "a=rtpmap:" + firstVideoCode;
      // 查找findStr2
      var findIndex2 = BlinkUtil.findLine(sdpArr, findStr2);
      if (findIndex2 == null) {
          return sdp;
      }

      var appendStr = 'a=fmtp:' + firstVideoCode + ' x-google-min-bitrate=' + currentBandWidth.min
        + '; x-google-max-bitrate=' + currentBandWidth.max;
      if (startBandWidth != null) {
        appendStr += '; x-google-start-bitrate=' + startBandWidth;
      }
      sdpArr[findIndex2] = sdpArr[findIndex2].concat(sep1 + appendStr);

      return sdpArr.join(sep1);
  },
  /**
   * SDP修改stream id
   *
   * @param sdp
   * @param oldId
   * @param newId
   * @returns
   */
  changeStreamId: function (sdp, oldId, newId) {
      sdp = sdp.replace(new RegExp(oldId, 'g'), newId);
      return sdp;
  },
  /**
   * SDP修改track id
   *
   * @param sdp
   * @param oldId
   * @param newId
   * @returns
   */
  changeTrackId: function (sdp, oldId, newId) {
      sdp = sdp.replace(new RegExp(oldId, 'g'), newId);
      return sdp;
  },
  /**
   * SDP修改video兼容参数
   *
   * @param sdp
   * @returns
   */
  changeVideoDesc: function (sdp) {
//		var videoDesc1 = "m=video 9 RTP/AVPF 98 96 100 127 125 97 99 101";
//		var videoDesc2 = "a=rtpmap:96 VP8/90000\r\na=rtcp-fb:96 ccm fir\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\na=rtcp-fb:96 goog-remb\r\na=rtcp-fb:96 transport-cc\r\na=rtpmap:98 H264/90000\r\na=rtcp-fb:98 ccm fir\r\na=rtcp-fb:98 nack\r\na=rtcp-fb:98 nack pli\r\na=rtcp-fb:98 goog-remb\r\na=rtcp-fb:98 transport-cc\r\na=fmtp:98 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\r\na=rtpmap:100 red/90000\r\na=rtpmap:127 ulpfec/90000\r\na=rtpmap:125 flexfec-03/90000\r\na=rtcp-fb:125 transport-cc\r\na=rtcp-fb:125 goog-remb\r\na=fmtp:125 repair-window=10000000\r\na=rtpmap:97 rtx/90000\r\na=fmtp:97 apt=96\r\na=rtpmap:99 rtx/90000\r\na=fmtp:99 apt=98\r\na=rtpmap:101 rtx/90000\r\na=fmtp:101 apt=100";
//
//		var findStr1 = "m=video";
//		var findStr2 = "a=rtcp-rsize";
//		var findStr3 = "a=ssrc-group";
//
//		var sdpArr = sdp.split('\r\n');
//		// 查找videoDesc1
//		var findIndex1 = BlinkUtil.findLine(sdpArr, findStr1);
//		// 替换videoDesc1
//		sdpArr[findIndex1] = videoDesc1;
//		// 查找videoDesc2
//		var findIndex2 = BlinkUtil.findLine(sdpArr, findStr2);
//		var findIndex3 = BlinkUtil.findLine(sdpArr, findStr3);
//		// 删除中间的元素
//		sdpArr.splice(findIndex2 + 1, findIndex3 - findIndex2 - 1);
//		// 替换videoDesc2
//		sdpArr[findIndex2] = sdpArr[findIndex2].concat('\r\n' + videoDesc2);
//		return sdpArr.join('\r\n');

      var sep1 = "\r\n";
      var findStr1 = "m=video";

      var sdpArr = sdp.split(sep1);
      // 查找videoDesc1
      var findIndex1 = BlinkUtil.findLine(sdpArr, findStr1);
      if (findIndex1 == null) {
          return sdp;
      }

      var h264_code = "98";
      var vp8_code = "96";
      var red_code = "100"
      var ulpfec_code = "127";
      var flexfec_code = "125";
      var h264_rtx_code = "99";
      var vp8_rtx_code = "97";
      var red_rtx_code = "101"

      var h264_search = "H264/90000";
      var vp8_search = "VP8/90000";
      var red_search = "red/90000";
      var ulpfec_search = "ulpfec/90000";
      var flexfec_search = "flexfec-03/90000";

      var h264_replace = "a=rtpmap:98 H264/90000\r\na=rtcp-fb:98 ccm fir\r\na=rtcp-fb:98 nack\r\na=rtcp-fb:98 nack pli\r\na=rtcp-fb:98 goog-remb\r\na=rtcp-fb:98 transport-cc\r\na=fmtp:98 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\r\na=rtpmap:99 rtx/90000\r\na=fmtp:99 apt=98";
      var vp8_replace = "a=rtpmap:96 VP8/90000\r\na=rtcp-fb:96 ccm fir\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\na=rtcp-fb:96 goog-remb\r\na=rtcp-fb:96 transport-cc\r\na=rtpmap:97 rtx/90000\r\na=fmtp:97 apt=96";
      var red_replace = "a=rtpmap:100 red/90000\r\na=rtpmap:101 rtx/90000\r\na=fmtp:101 apt=100";
      var ulpfec_replace = "a=rtpmap:127 ulpfec/90000";
      var flexfec_replace = "a=rtpmap:125 flexfec-03/90000\r\na=rtcp-fb:125 transport-cc\r\na=rtcp-fb:125 goog-remb\r\na=fmtp:125 repair-window=10000000";

      var sep2 = " ";
      var findStr2 = "a=rtpmap";
      var findStr3 = "a=ssrc-group";

      var videoDescArr1 = sdpArr[findIndex1].split(sep2);
      // m=video 9 UDP/TLS/RTP/SAVPF
      var videoReplace1 = videoDescArr1[0] + sep2 + videoDescArr1[1] + sep2
          + videoDescArr1[2];
      // 查找videoDesc2
      var findIndex2 = BlinkUtil.findLineInRange(sdpArr, findStr2, findIndex1 + 1, sdpArr.length - 1);
      var findIndex3 = BlinkUtil.findLineInRange(sdpArr, findStr3, findIndex2 + 1, sdpArr.length - 1);
      if (findIndex3 == null) { // 观察者模式没有findStr3相关信息
          findIndex3 = sdpArr.length - 1;
      }
      // 删除中间的元素
      var removeArr = sdpArr.splice(findIndex2, findIndex3 - findIndex2);

      // 查找H264
      var h264_index = BlinkUtil.findLine(removeArr, h264_search);
      // 查找VP8
      var vp8_index = BlinkUtil.findLine(removeArr, vp8_search);
      // 查找red
      var red_index = BlinkUtil.findLine(removeArr, red_search);
      // 查找ulpfec
      var ulpfec_index = BlinkUtil.findLine(removeArr, ulpfec_search);
      // 查找flexfec
      var flexfec_index = BlinkUtil.findLine(removeArr, flexfec_search);

      var videoReplace2 = "";
      if (h264_index != null) {
          videoReplace1 += sep2 + h264_code;
          videoReplace2 += sep1 + h264_replace;
      }
      if (vp8_index != null) {
          videoReplace1 += sep2 + vp8_code;
          videoReplace2 += sep1 + vp8_replace;
      }
      if (red_index != null) {
          videoReplace1 += sep2 + red_code;
          videoReplace2 += sep1 + red_replace;
      }
      if (ulpfec_index != null) {
          videoReplace1 += sep2 + ulpfec_code;
          videoReplace2 += sep1 + ulpfec_replace;
      }
      if (flexfec_index != null) {
          videoReplace1 += sep2 + flexfec_code;
          videoReplace2 += sep1 + flexfec_replace;
      }
      if (h264_index != null) {
          videoReplace1 += sep2 + h264_rtx_code;
      }
      if (vp8_index != null) {
          videoReplace1 += sep2 + vp8_rtx_code;
      }
      if (red_index != null) {
          videoReplace1 += sep2 + red_rtx_code;
      }

      // 替换videoDesc1
      sdpArr[findIndex1] = videoReplace1;
      // 替换videoDesc2
      sdpArr[findIndex2 - 1] = sdpArr[findIndex2 - 1].concat(videoReplace2);

      return sdpArr.join(sep1);
  },
  /**
   * get cname
   *
   * @param userId
   */
  getCname: function (sdp, userId) {
      var sep1 = "\n";
      var sep2 = " ";
      var sdpArr = sdp.split(sep1);

      // a=ssrc:702269835 msid:A9532881-B4CA-4B23-B219-9837CE93AA70 4716df1f-046f-4b96-a260-2593048d7e9e
      var msid_search = "msid:" + userId;
      var msid_index = BlinkUtil.findLine(sdpArr, msid_search);
      if (msid_index == null) {
          return null;
      }
      var ssrc = sdpArr[msid_index].split(sep2)[0];

      // a=ssrc:702269835 cname:wRow2WLrs18ZB3Dg
      var cname_search = ssrc + " cname:";
      var cname_index = BlinkUtil.findLine(sdpArr, cname_search);
      var cname = sdpArr[cname_index].split("cname:")[1];
      return cname;
  },
  /**
   * check cname
   *
   * @param userId
   */
  isHasCname: function (sdp, cname) {
      var sep1 = "\n";
      var sdpArr = sdp.split(sep1);

      // a=ssrc:702269835 cname:wRow2WLrs18ZB3Dg
      var cname_search = "cname:" + cname;
      var cname_index = BlinkUtil.findLine(sdpArr, cname_search);
      return cname_index != null;
  },
  getSsrc: function (sdp, userId, cname) { // ssrc变化则为屏幕共享
      var sdpArr = sdp.split('\n');
      var videoLine = sdpArr.map(function (line, index) {
          if (line.indexOf('mid:video') > -1)
              return index;
      }).filter(function (item) {
          return item;
      })
      sdpArr = sdpArr.slice(videoLine[0])
      var ssrc = sdpArr.filter(function (line) {
          return line.indexOf('a=ssrc:') > -1;
      })
      var cnameLine = ssrc.map(function (line, index) {
          if (line.indexOf('cname:' + cname) > -1)
              return index;
      }).filter(function (item) {
          return item;
      })
      var ts = ssrc.slice(cnameLine[0] + 1, cnameLine[0] + 2);
      if (ts[0] == null) {
        return null;
      }
      return ts[0].split(" ")[2];

  },
  /**
   * 数组中查找
   *
   * @param arr
   * @param substr
   * @returns
   */
  findLine: function (arr, substr) {
      for (var i = 0; i < arr.length; i++) {
          if (arr[i].indexOf(substr) != -1) {
              return i;
          }
      }
      return null;
  },
  /**
   * 数组中查找
   *
   * @param arr
   * @param substr
   * @param startIndex
   * @param endIndex
   * @returns
   */
  findLineInRange: function (arr, substr, startIndex, endIndex) {
      var start = (startIndex == null || startIndex == '' || startIndex < 0) ? 0
          : startIndex;
      var end = (endIndex == null || endIndex == '' || endIndex < 0 || endIndex > arr.length - 1) ? arr.length - 1
          : endIndex;
      start = start > end ? end : start;
      for (var i = start; i <= end; i++) {
          if (arr[i].indexOf(substr) != -1) {
              return i;
          }
      }
      return null;
  },
  /**
   * 随机打乱数组内排序
   *
   * @param input
   * @returns
   */
  shuffle: function (input) {
      for (var i = input.length - 1; i >= 0; i--) {
          var randomIndex = Math.floor(Math.random() * (i + 1));
          var itemAtIndex = input[randomIndex];
          input[randomIndex] = input[i];
          input[i] = itemAtIndex;
      }
      return input;
  },
  /**
   * 刷新VideoView的视频流
   *
   * @param userId
   */
  refreshMediaStream: function (userId) {
      var videoView = document.getElementById(userId);
      if (videoView != null) {
          videoView.srcObject = videoView.srcObject;
      }
  },
  /**
   * 设置VideoView的视频流为指定流
   *
   * @param userId
   */
  setMediaStream: function (userId, stream) {
      var videoView = document.getElementById(userId);
      if (videoView != null) {
          videoView.srcObject = stream;
      }
  },
  /**
   * 当前浏览器
   */
  myBrowser: function () {
      var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
      if (userAgent.indexOf("Opera") > -1) { // 判断是否Opera浏览器
          return "Opera"
      }
      if (userAgent.indexOf("Firefox") > -1) { // 判断是否Firefox浏览器
          return "FF";
      }
      if (userAgent.indexOf("Chrome") > -1) { // 判断是否Chrome浏览器
          return "Chrome";
      }
      if (userAgent.indexOf("Safari") > -1) { // 判断是否Safari浏览器
          return "Safari";
      }
      if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) { // 判断是否IE浏览器
          return "IE";
      }
      return "";
  }
}

/** ----- BlinkAjax ----- */
var BlinkAjax = function (opt) {
  opt.type = opt.type.toUpperCase() || 'POST';
  if (opt.type === 'POST') {
      post(opt);
  } else {
      get(opt);
  }

  // 初始化数据
  function init(opt) {
      var optAdapter = {
          url: '',
          type: 'GET',
          data: {},
          async: true,
          dataType: 'JSON',
          success: function () {
          },
          error: function (s) {
              // alert('status:' + s + 'error!');
          }
      }
      opt.url = opt.url || optAdapter.url;
      opt.type = opt.type.toUpperCase() || optAdapter.method;
      opt.data = params(opt.data) || params(optAdapter.data);
      opt.dataType = opt.dataType.toUpperCase() || optAdapter.dataType;
      // opt.async = opt.async || optAdapter.async;
      opt.success = opt.success || optAdapter.success;
      opt.error = opt.error || optAdapter.error;
      return opt;
  }

  // 创建XMLHttpRequest对象
  function createXHR() {
      if (window.XMLHttpRequest) { // IE7+、Firefox、Opera、Chrome、Safari
          return new XMLHttpRequest();
      } else if (window.ActiveXObject) { // IE6 及以下
          var versions = ['MSXML2.XMLHttp', 'Microsoft.XMLHTTP'];
          for (var i = 0, len = versions.length; i < len; i++) {
              try {
                  return new ActiveXObject(version[i]);
                  break;
              } catch (e) {
                  // 跳过
              }
          }
      } else {
          throw new Error('浏览器不支持XHR对象！');
      }
  }

  function params(data) {
      var arr = [];
      for (var i in data) {
          // 特殊字符传参产生的问题可以使用encodeURIComponent()进行编码处理
          arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
      }
      return arr.join('&');
  }

  function callback(opt, xhr) {
      if (xhr.readyState == 4 && xhr.status == 200) { // 判断http的交互是否成功，200表示成功
          var returnValue;
          switch (opt.dataType) {
              case "XML":
                  returnValue = xhr.responseXML;
                  break;
              case "JSON":
                  var jsonText = xhr.responseText;
                  if (jsonText) {
                      returnValue = JSON.parse(jsonText);
                  }
                  break;
              default:
                  returnValue = xhr.responseText;
                  break;
          }
          if (returnValue) {
              opt.success(returnValue);
          }
      } else {
          // alert('获取数据错误！错误代号：' + xhr.status + '，错误信息：' +
          // xhr.statusText);
          opt.error(xhr);
      }

  }

  // post方法
  function post(opt) {
      var xhr = createXHR(); // 创建XHR对象
      var opt = init(opt);
      opt.type = 'post';
      if (opt.async === true) { // true表示异步，false表示同步
          // 使用异步调用的时候，需要触发readystatechange 事件
          xhr.onreadystatechange = function () {
              if (xhr.readyState == 4) { // 判断对象的状态是否交互完成
                  callback(opt, xhr); // 回调
              }
          };
      }
      // 在使用XHR对象时，必须先调用open()方法，
      // 它接受三个参数：请求类型(get、post)、请求的URL和表示是否异步。
      xhr.open(opt.type, opt.url, opt.async);
      // post方式需要自己设置http的请求头，来模仿表单提交。
      // 放在open方法之后，send方法之前。
      xhr.setRequestHeader('Content-Type',
          'application/x-www-form-urlencoded;charset=utf-8');
      xhr.send(opt.data); // post方式将数据放在send()方法里
      if (opt.async === false) { // 同步
          callback(opt, xhr); // 回调
      }
  }

  // get方法
  function get(opt) {
      var xhr = createXHR(); // 创建XHR对象
      var opt = init(opt);
      opt.type = 'get';
      if (opt.async === true) { // true表示异步，false表示同步
          // 使用异步调用的时候，需要触发readystatechange 事件
          xhr.onreadystatechange = function () {
              if (xhr.readyState == 4) { // 判断对象的状态是否交互完成
                  callback(opt, xhr); // 回调
              }
          };
      }
      // 若是GET请求，则将数据加到url后面
      opt.url += opt.url.indexOf('?') == -1 ? '?' + opt.data : '&' + opt.data;
      // 在使用XHR对象时，必须先调用open()方法，
      // 它接受三个参数：请求类型(get、post)、请求的URL和表示是否异步。
      xhr.open(opt.type, opt.url, opt.async);
      xhr.send(null); // get方式则填null
      if (opt.async === false) { // 同步
          callback(opt, xhr); // 回调
      }
  }
}

/** ----- BlinkMap ----- */
var BlinkMap = function () {
  this._entrys = new Array();

  this.put = function (key, value) {
      if (key == null || key == undefined) {
          return;
      }
      var index = this._getIndex(key);
      if (index == -1) {
          var entry = new Object();
          entry.key = key;
          entry.value = value;
          this._entrys[this._entrys.length] = entry;
      } else {
          this._entrys[index].value = value;
      }
  };
  this.get = function (key) {
      var index = this._getIndex(key);
      return (index != -1) ? this._entrys[index].value : null;
  };
  this.remove = function (key) {
      var index = this._getIndex(key);
      if (index != -1) {
          this._entrys.splice(index, 1);
      }
  };
  this.clear = function () {
      this._entrys.length = 0;
  };
  this.contains = function (key) {
      var index = this._getIndex(key);
      return (index != -1) ? true : false;
  };
  this.size = function () {
      return this._entrys.length;
  };
  this.getEntrys = function () {
      return this._entrys;
  };
  this._getIndex = function (key) {
      if (key == null || key == undefined) {
          return -1;
      }
      var _length = this._entrys.length;
      for (var i = 0; i < _length; i++) {
          var entry = this._entrys[i];
          if (entry == null || entry == undefined) {
              continue;
          }
          if (entry.key === key) {// equal
              return i;
          }
      }
      return -1;
  };
}
export const RTC = BlinkEngine;
export const EventHandler = BlinkEngineEventHandle;