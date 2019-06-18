import { CommonEvent } from './events';
import utils from '../../utils';
import { STAT_FREQUENCY, STAT_TPL, STAT_NONE, STAT_SEPARATOR } from '../../enum';

function Stat(im, option) {
  let statTimer = 0;
  let stat = option.stat || {};
  let frequency = stat.frequency || STAT_FREQUENCY;

  let StatCacheName = {
    LATEST_RATE_SENT: 'latest_rate_sent',
    LATEST_RATE_RECEIVE: 'latest_rate_receive',
    TOTAL_PACAKS_LOST: 'total_packs_lost'
  };
  let StatCache = utils.Cache();
  /* 
    data = {
      content: ''
    }
    or
    data = [{
      content: ''
    }]
  */
  let send = () => {
  };
  // let getR1 = (content) => {
  //   return utils.tplEngine(STAT_TPL.R1, content);
  // };
  // let getR2 = (content) => {
  //   return utils.tplEngine(STAT_TPL.R2, content);
  // };
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

  let getR5 = (content) => {
    return utils.tplEngine(STAT_TPL.R5, content);
  };
  /* 封装日志格式 */
  let format = (stats) => {
    let getResolution = (stat) => {
      let { googFrameWidthInput, googFrameHeightInput, googFrameWidthSent, googFrameHeightSent } = stat;
      let tpl = '{width}x{height}';
      let send = utils.tplEngine(tpl, {
        height: googFrameHeightSent,
        width: googFrameWidthSent
      });
      send = utils.isInclude(send, 'height') ? STAT_NONE : send;
      let receive = utils.tplEngine(tpl, {
        height: googFrameHeightInput,
        width: googFrameWidthInput
      });
      receive = utils.isInclude(receive, 'height') ? STAT_NONE : receive;

      return {
        send,
        receive
      }
    };
    let getTrack = (stat) => {
      let track = {};
      let audioLevel = stat['audioOutputLevel'] || stat['audioInputLevel'] || STAT_NONE;
      let frameRate = stat['googFrameRateInput'] || stat['googFrameRateSent'] || STAT_NONE;
      let samplingRate = STAT_NONE, transferRate = STAT_NONE;
      let { id } = stat;
      let ratio = getResolution(stat);

      let isSender = utils.isInclude(id, 'send');
      let resolution = ratio.receive;
      if (isSender) {
        resolution = ratio.receive;
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
        'googRenderDelayMs'
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
    let getLatestRate = () => {
      let send = StatCache.get(StatCacheName.LATEST_RATE_SENT) || 0;
      let receive = StatCache.get(StatCacheName.LATEST_RATE_RECEIVE) || 0;
      return {
        send,
        receive
      };
    };
    let getPair = (pair) => {
      let { bytesReceived, bytesSent, googLocalAddress } = pair;
      let latestRate = getLatestRate();
      // 发送、接收总码率为空，直接返回，下次有合法值再行计算
      let { send, receive } = latestRate;
      if (utils.isEmpty(send) && utils.isEmpty(receive)) {
        StatCache.set(StatCacheName.LATEST_RATE_SENT, bytesSent);
        StatCache.set(StatCacheName.LATEST_RATE_RECEIVE, bytesReceived);
        return latestRate;
      }
      let getTotal = (current, latest) => {
        let rate = (current - latest) * 8 / 1024 / frequency;
        return rate;
      };
      let totalSend = getTotal(bytesSent, send);
      let totalReceive = getTotal(bytesReceived, receive);
      return {
        totalSend,
        totalReceive,
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

    if (utils.isEmpty(totalSend) && utils.isEmpty(totalReceive)) {
      return;
    }
    let totalPacketsLost = 0;
    utils.forEach(ssrcs, (ssrc) => {
      let { packetsLost } = ssrc;
      if (!utils.isEqual(packetsLost, STAT_NONE)) {
        totalPacketsLost += packetsLost;
      }
    });

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
    let R3 = getR3({
      totalRate: totalSend,
      tracks: sendTracks.join(STAT_SEPARATOR)
    });
    let R4 = getR4({
      totalRate: totalReceive,
      tracks: receiveTracks.join(STAT_SEPARATOR)
    });
    let R5 = getR5(R5Data);
    return {
      R3,
      R4,
      R5
    }
  };
  /* 根据条件调用 Send 方法 */
  let sendReport = () => {
  };
  let take = (pc) => {
    statTimer = setInterval(() => {
      pc.getStats((stats) => {
        let report = format(stats);
        sendReport(report);
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
  im.on(CommonEvent.SEND_REPORT, (error, data) => {
    if (!utils.isUndefined(error)) {
      send(data);
    }
  });
}
export default Stat;