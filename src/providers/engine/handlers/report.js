import { UpEvent, DownEvent } from '../../../event-name';
import { CommonEvent } from '../events';
import utils from '../../../utils';
import { AUDIO_LEVEL, REPORT_FREQUENCY } from '../../../enum';
function ReportHandler(im) {
  let pc = null, reportTimer = 0;

  let TrackCache = utils.Cache();
  let TrackStateCache = utils.Cache();
  let setTrackCache = (stream, user) => {
    let tracks = stream.getTracks();
    let { id, stream: { tag } } = user;
    utils.forEach(tracks, ({ id: trackId }) => {
      TrackCache.set(trackId, {
        id,
        stream: { tag }
      });
    });
  };
  let getAudioLevel = (level) => {
    level = level || 0;
    let index = Math.floor(level / 1000);
    if (index >= AUDIO_LEVEL.length) {
      index = 0;
    }
    return AUDIO_LEVEL[index];
  };
  let resourceHandler = (stat) => {
    let { googTrackId: trackId, mediaType } = stat;
    if (utils.isEqual(mediaType, 'audio')) {
      // 不区分 Input、Output 最终对应用层按 user 暴露
      let audioLevel = stat['audioOutputLevel'] || stat['audioInputLevel'];
      audioLevel = getAudioLevel(audioLevel);
      let latestLevel = TrackStateCache.get(trackId);
      if (!utils.isEqual(latestLevel, audioLevel)) {
        let user = TrackCache.get(trackId);
        utils.extend(user.stream, {
          audioLevel
        });
        TrackStateCache.set(trackId, audioLevel);
        im.emit(DownEvent.REPORT_SPOKE, user);
      }
    }
  };
  let statsHandler = (stats) => {
    utils.forEach(stats, (stat) => {
      let { type } = stat;
      if (utils.isInclude(type, 'ssrc')) {
        resourceHandler(stat);
      }
    });
  };
  let clear = () => {
    clearInterval(reportTimer)
  };
  im.on(CommonEvent.PEERCONN_CREATED, (error, _pc) => {
    if (error) {
      throw error;
    }
    pc = _pc;
  });
  im.on(CommonEvent.LEFT, () => {
    TrackCache.clear();
    TrackStateCache.clear();
    clear();
  });
  im.on(CommonEvent.PUBLISHED_STREAM, (error, data) => {
    if (error) {
      throw error;
    }
    let { mediaStream, user } = data;
    setTrackCache(mediaStream, user);
  });

  let start = (_option) => {
    let option = {
      frequency: REPORT_FREQUENCY
    };
    if(utils.isObject(_option)){
      utils.extend(option, _option)
    }
    if (reportTimer) {
      clear();
    }
    reportTimer = setInterval(() => {
      if (!pc) {
        return clear();
      }
      pc.getStats((stats) => {
        statsHandler(stats);
      });
    }, option.frequency);
    return utils.Defer.resolve();
  };
  let stop = () => {
    clear();
    return utils.Defer.resolve();
  };
  let dispatch = (event, args) => {
    switch (event) {
      case UpEvent.REPORT_START:
        return start(...args);
      case UpEvent.REPORT_STOP:
        return stop(...args);
    }
  };
  return {
    dispatch
  };
}

export default ReportHandler;