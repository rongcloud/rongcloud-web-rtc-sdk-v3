/* 
  信令命名规则: 
    上行: 动词、动词短语
    下行: 动词、动词短语后增加 Ack
    Server 直发: Push 开头
*/
export const DownEventFlag = ['Push', 'Ack', 'Pong'];

export const SignalEvent = {
  /** start 信令服务器交互信令 */
  Connect: 'connect',
  ConnectAck: 'connect_result',

  Join: 'logonAndJoin',
  JoinAck: 'logonAndJoin_result',

  Ping: 'channelPing',
  Pong: 'channelPing_result',

  // 自己主动离开
  Leave: 'leave',
  LeaveAck: 'leave_result',

  Exchange: 'exchange',
  ExchangeAck: 'exchange_result',

  GetWhiteBoardList: 'ewb_query',
  GetWhiteBoardListAck: 'ewb_query_result',

  // 删除白板
  CreateWhiteBoard: 'ewb_create_multi',
  CreateWhiteBoardAck: 'ewb_create_multi_result',

  // 删除白板
  DeleteWhiteBoard: 'ewb_delete',
  DeleteWhiteBoardAck: 'delete_result',

  // 订阅大小流
  FlowStreamSize: 'flowSubscribe',

  // 成员加入
  PushJoin: 'joined',

  // 成员离开
  PushLeave: 'left',

  // 请求 Offer
  PushOfferRequest: 'offerRequest',

  // 成员发布资源改变
  PushResource: 'update_resource_notify',

  // 成员订阅关系改变
  PushSubscribe: 'update_subscribe_notify',

  // 修改当前用户资源类型
  UpdateResource: 'update_resource',
  UpdateResourceAck: 'update_resource_result',

  // 修改当前用户订阅关系
  UpdateSubscribe: 'update_subscribe',
  UpdateSubscribeAck: 'update_subscribe_result',

  /** end 信令服务器交互信令 */

  /** start 本地信令 */

  SetProfile: 'set_profile',
  SetProfileAck: 'set_profile_result',

  GetStream: 'get_stream',
  GetStreamAck: 'get_stream_result',

  Mute: 'mute',
  MuteAck: 'mute_result',

  UnMute: 'unmute',
  UnMuteAck: 'unmute_result',

  DisableVideo: 'disable_video',
  DisableVideoAck: 'disbale_video_result',

  EnableVideo: 'enable_video',
  EnableVideoAck: 'enable_video_result',

  StartScreenShare: 'start_screen_share',
  StartScreenShareAck: 'start_screen_share_result',

  StopScreenShare: 'stop_screen_share',
  StopScreenShareAck: 'stop_screen_share_result',

  SetDevice: 'set_device',
  SetDeviceAck: 'set_device_result',

  CheckDevice: 'set_device',
  CheckDeviceAck: 'set_device_result',

  GetDeviceList: 'get_device_list',
  GetDeviceListAck: 'get_device_list_result'

  /** end 本地信令 */
};

export const PeerConnectionEvent = {
  ADDED: 'add',
  REMOVED: 'remove',
  ICE_STATE_CHANGE: 'iceconnectionstatechange'
};