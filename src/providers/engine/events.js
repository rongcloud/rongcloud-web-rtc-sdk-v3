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
  CONSUME_FINISHED: 'common_consume_finished'
};

export const CommandEvent = {
  EXCHANGE: 'command_exchange'
};