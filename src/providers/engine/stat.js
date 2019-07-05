import { CommonEvent } from './events';
import utils from '../../utils';
import { LogTag, STAT_FREQUENCY, STAT_TPL, STAT_NONE, STAT_SEPARATOR, STAT_NAME, TRACK_STATE } from '../../enum';
import * as common from '../../common';
import { UpEvent } from '../../event-name';
import Logger from '../../logger';

function Stat(im, option) {
  let statTimer = 0;
  let stat = option.stat || {};
  let frequency = stat.frequency || STAT_FREQUENCY;

  let StatCacheName = {
    TOTAL_PACAKS_LOST: 'total_packs_lost',
    IS_FIRST: 'is_first'
  };
  let StatCache = utils.Cache();
  let TrackStateCache = utils.Cache();

  im.on(CommonEvent.TRACK_MODIFY, (error, track) => {
    if (error) {
      return;
    }
    let { id, isEnable } = track;
    TrackStateCache.set(id, isEnable);
  });
  /* 
    data = {
      content: ''
    }
    or
    data = [{
      content: ''
    }]
  */
  let send = (report) => {
    im.setRTCState(report);
    Logger.log(LogTag.STAT, report);
  };
  let getR1 = (content) => {
    return utils.tplEngine(STAT_TPL.R1, content);
  };
  let getR2 = (content) => {
    return utils.tplEngine(STAT_TPL.R2, content);
  };
  let getR3Item = (content) => {
    return utils.tplEngine(STAT_TPL.R3_ITEM, content);
  };
  let getR3 = (content) => {
    return utils.tplEngine(STAT_TPL.R3, content);
  };

  let getR4Item = (content) => {
    return utils.tplEngine(STAT_TPL.R4_ITEM, content);
  };
  let getR4 = (content) => {
    return utils.tplEngine(STAT_TPL.R4, content);
  };

  /* 封装日志格式 */
  let format = (stats) => {
    let getResolution = (stat) => {
      let { googFrameWidthSent, googFrameHeightSent,
        googFrameHeightReceived, googFrameWidthReceived } = stat;
      let tpl = '{width}x{height}';
      let send = utils.tplEngine(tpl, {
        height: googFrameHeightSent,
        width: googFrameWidthSent
      });
      send = utils.isInclude(send, 'height') ? STAT_NONE : send;
      let receive = utils.tplEngine(tpl, {
        height: googFrameHeightReceived,
        width: googFrameWidthReceived
      });
      receive = utils.isInclude(receive, 'height') ? STAT_NONE : receive;

      return {
        send,
        receive
      }
    };
    let getRate = (ssrc) => {
      let { bytesSent, bytesReceived } = ssrc;
      let { googTrackId } = ssrc;
      let transferRate = bytesSent ? bytesSent : bytesReceived;
      let lastRate = StatCache.get(googTrackId);
      // 发送、接收总码率为空，直接返回，下次有合法值再行计算
      if (utils.isUndefined(lastRate)) {
        StatCache.set(googTrackId, transferRate);
        return transferRate;
      }

      let getCurrent = (current, latest) => {
        let rate = (current - latest) * 8 / 1024 / (frequency / 1000);
        return rate;
      };
      let rate = getCurrent(transferRate, lastRate);
      return rate;
    };
    let getTrack = (stat) => {
      let track = {};
      let audioLevel = stat['audioOutputLevel'] || stat['audioInputLevel'] || STAT_NONE;
      let frameRate = stat['googFrameRateInput'] || stat['googFrameRateOutput'] || STAT_NONE;
      let samplingRate = STAT_NONE, transferRate = STAT_NONE;
      let { id } = stat;
      let ratio = getResolution(stat);

      let trackId = stat.googTrackId;
      let trackState = TRACK_STATE.DISABLE;
      let trackEnabled = TrackStateCache.get(trackId);
      if (utils.isUndefined(trackEnabled) || trackEnabled) {
        trackState = TRACK_STATE.ENABLE;
      }

      let isSender = utils.isInclude(id, 'send');
      let resolution = ratio.receive;
      if (isSender) {
        resolution = ratio.send;
      }

      let rate = getRate(stat);
      let trackSent = STAT_NONE, trackReceived = STAT_NONE;
      if (isSender) {
        trackSent = rate;
      } else {
        trackReceived = rate;
      }
      let props = [
        'googTrackId',
        'googCodecName',
        'packetsLost',
        'googJitterReceived',
        'googNacksReceived',
        'googPlisReceived',
        'googRtt',
        'googFirsReceived',
        'codecImplementationName',
        'googRenderDelayMs',
        'googJitterSent',
        'googNacksSent',
        'googPlisSent',
        'googFirsSent'
      ]
      utils.forEach(props, (prop) => {
        track[prop] = stat[prop] || STAT_NONE;
      });

      utils.extend(track, {
        audioLevel,
        samplingRate,
        frameRate,
        transferRate,
        resolution,
        trackState,
        trackSent,
        trackReceived,
        isSender
      });
      return track;
    };
    let getProps = (prop, isArray) => {
      let props = utils.filter(stats, (stat) => {
        let { type } = stat;
        return utils.isEqual(type, prop);
      });
      return isArray ? props : props[0];
    };
    let getPair = (pair) => {
      pair = pair || {};
      let { bytesReceived, bytesSent, googLocalAddress } = pair;
      return {
        totalSend: bytesSent,
        totalReceive: bytesReceived,
        localAddress: googLocalAddress
      };
    };
    let ssrcs = getProps('ssrc', true);
    let videoBwe = getProps('VideoBwe');
    let localcandidate = getProps('localcandidate');
    let googCandidatePair = getProps('googCandidatePair');

    ssrcs = utils.map(ssrcs, (ssrc) => {
      let track = getTrack(ssrc);
      return track;
    });
    googCandidatePair = getPair(googCandidatePair);
    let { totalSend, totalReceive, localAddress } = googCandidatePair;

    let totalPacketsLost = 0;
    utils.forEach(ssrcs, (ssrc) => {
      let { packetsLost } = ssrc;
      packetsLost = Number(packetsLost);
      if (!utils.isEqual(packetsLost, STAT_NONE)) {
        totalPacketsLost += packetsLost;
      }
    });
    
    if(utils.isUndefined(localcandidate)){
      return {};
    }
    let { networkType, stunKeepaliveRttTotal: rtt } = localcandidate;
    let { googAvailableReceiveBandwidth: receiveBand, googAvailableSendBandwidth: sendBand } = videoBwe;

    let R5Data = {
      networkType,
      rtt,
      receiveBand,
      localAddress,
      sendBand,
      packetsLost: totalPacketsLost
    }

    let sendTracks = [], receiveTracks = [];
    utils.forEach(ssrcs, (ssrc) => {
      let { isSender } = ssrc;
      if (isSender) {
        let track = getR3Item(ssrc);
        sendTracks.push(track);
      } else {
        let track = getR4Item(ssrc);
        receiveTracks.push(track);
      }
    });
    let R3, R4;
    if (!utils.isEmpty(sendTracks)) {
      let content = {
        totalRate: totalSend,
        tracks: sendTracks.join(STAT_SEPARATOR)
      };
      utils.extend(content, R5Data);
      R3 = getR3(content);
    }
    if (!utils.isEmpty(receiveTracks)) {
      let content = {
        totalRate: totalReceive,
        tracks: receiveTracks.join(STAT_SEPARATOR)
      };
      utils.extend(content, R5Data);
      R4 = getR4(content);
    }
    if (utils.isUndefined(StatCache.get(StatCacheName.IS_FIRST))) {
      StatCache.set(StatCacheName.IS_FIRST, true);
      return {};
    }
    return {
      R3,
      R4
    }
  };
  /* 根据条件调用 Send 方法 */
  let sendReport = (reports) => {
    utils.forEach(reports, (report) => {
      if (report) {
        send({
          report
        });
      }
    });
  };
  let take = (pc) => {
    statTimer = setInterval(() => {
      pc.getStats((stats) => {
        let reports = format(stats);
        sendReport(reports);
      });
    }, frequency);
  };
  im.on(CommonEvent.LEFT, () => {
    clearInterval(statTimer);
  });
  im.on(CommonEvent.PEERCONN_CREATED, (error, pc) => {
    if (error) {
      throw error;
    }
    take(pc);
  });
  let getType = (name) => {
    let type = '', state = '';
    switch (name) {
      case UpEvent.STREAM_PUBLISH:
        type = 'publish';
        state = 'bengin';
        break;
      case UpEvent.STREAM_UNPUBLISH:
        type = 'publish';
        state = 'end';
        break;
      case UpEvent.STREAM_SUBSCRIBE:
        type = 'subscribe';
        state = 'bengin';
        break;
      case UpEvent.STREAM_UNSUBSCRIBE:
        type = 'subscribe';
        state = 'end';
        break;
    }
    return {
      type,
      state
    }
  }
  im.on(CommonEvent.SEND_REPORT, (error, data) => {
    if (utils.isUndefined(error)) {
      let { type, name, content: { streams } } = data;
      let report = '';
      let borwser = utils.getBrowser();
      switch (type) {
        case STAT_NAME.R1:
          report = getR1({
            rtcVersion: common.getVersion(),
            imVersion: im.getIMVersion(),
            platform: 'Web',
            pcName: navigator.platform,
            pcVersion: STAT_NONE,
            browserName: borwser.name,
            browserVersion: borwser.version
          });
          break;
        case STAT_NAME.R2:
          if (!utils.isArray(streams)) {
            streams = [streams];
          }
          {
            let trackIds = [];
            utils.forEach(streams, (stream) => {
              if (utils.isUndefined(stream)) {
                return trackIds.push(STAT_NONE);
              }
              let tracks = stream.getTracks();
              utils.forEach(tracks, (track) => {
                trackIds.push(track.id);
              });
            });
            trackIds = trackIds.join('\t');
            let { type, state } = getType(name);
            report = getR2({
              type,
              state,
              trackIds
            });
          }
          break;
      }
      if (!utils.isEmpty(report)) {
        send({
          report
        });
      }
    }
  });
}
export default Stat;