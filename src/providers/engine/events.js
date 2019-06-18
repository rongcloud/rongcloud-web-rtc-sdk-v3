export const PeerConnectionEvent = {
  ADDED: 'p_stream_added',
  REMOVED: 'p_stream_removed',
  RECEIVED: 'p_stream_received',
  CHANGED: 'p_ice_changed'
};

export const ICEEvent = {
  FAILED: 'failed',
  DISCONNECTED: 'disconnected'
};

export const CommonEvent = {
  JOINED: 'common_joined',
  LEFT: 'common_left',
  ERROR: 'common_error',
  CONSUME: 'common_consume',
  REQUEST_CONSUME: 'common_request_consume',
  CONNECTED: 'common_connected',
  PEERCONN_CREATED: 'common_peerconn_created',
  PUBLISHED_STREAM: 'common_published_stream',
  SEND_REPORT: 'common_send_report'
};

export const CommandEvent = {
  EXCHANGE: 'command_exchange'
};