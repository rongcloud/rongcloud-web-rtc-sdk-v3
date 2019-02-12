import utils from '../../utils';
import EventEmitter from '../../event-emitter';
import { PeerConnectionEvent } from './events';
import { StreamSize } from '../../enum';
import Logger from '../../logger';

export default class PeerConnection extends EventEmitter {
  constructor() {
    super();
    let context = this;
    let pc = new RTCPeerConnection();
    let events = {
      onaddstream: function (event) {
        let { stream } = event;
        context.emit(PeerConnectionEvent.ADDED, stream);
      },
      onremovestream: function () {
        let { stream } = event;
        context.emit(PeerConnectionEvent.REMOVED, stream);
      },
      ondatachannel: function (event) {
        //TODO: 具体返回参数
        context.emit(PeerConnectionEvent.RECEIVED, event);
      },
      oniceconnectionstatechange: function (event) {
        Logger.log(event);
      }
    };
    utils.forEach(events, (event, name) => {
      pc[name] = event;
    });
    utils.extend(context, {
      pc
    });
  }

  addStream(user) {
    let context = this;
    let { pc } = context;
    let { stream } = user;
    if (!utils.isArray(stream)) {
      stream = [stream];
    }
    utils.forEach(stream, ({ mediaStream }) => {
      pc.addStream(mediaStream);
    });
    return context.createOffer(user);
  }

  removeStream(user) {
    let context = this;
    let { pc } = context;
    let { stream } = user;
    if (!utils.isArray(stream)) {
      stream = [stream];
    }
    utils.forEach(stream, ({ mediaStream }) => {
      pc.removeStream(mediaStream);
    });
    return context.createOffer(user);
  }

  setOffer(desc) {
    let context = this;
    let { pc } = context;
    return pc.setLocalDescription(desc);
  }

  setAnwser(sdp) {
    let context = this;
    let { pc } = context;
    return pc.setRemoteDescription(new RTCSessionDescription(sdp));
  }

  close() {
    let context = this;
    let { pc } = context;
    pc.close();
  }

  getOption() {
    return {
      // iceRestart: true,
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    };
  }

  createOffer(user) {
    let context = this;
    let { pc } = context;
    let { stream } = user;
    if (!utils.isArray(stream)) {
      stream = [stream];
    }
    let option = context.getOption();
    return pc.createOffer(option).then(desc => {
      utils.forEach(stream, ({ mediaStream, size }) => {
        let newStreamId = context.getStreamId(user, size);
        let { id: streamId } = mediaStream;
        let { sdp } = desc;
        sdp = context.renameStream(sdp, {
          name: streamId,
          newName: newStreamId
        });
        utils.extend(desc, {
          sdp
        });
      })
      desc = context.renameCodec(desc);
      utils.extend(context, {
        desc
      });
      return desc;
    });
  }

  getOffer(callback) {
    let context = this;
    let { pc } = context;
    let option = context.getOption();
    pc.createOffer(option).then(desc => {
      callback(context.renameCodec(desc));
    });
  }

  renameStream(sdp, data) {
    let { name, newName } = data;
    return sdp.replace(new RegExp(name, 'g'), newName);
  }

  renameCodec(offer) {
    let { sdp } = offer;
    sdp = sdp.replace(new RegExp('a=group:BUNDLE 0 1', 'g'), 'a=group:BUNDLE audio video')
    let codecs = [{
      name: 'H264/90000',
      code: 98,
      rtx: 99,
      value: 'a=rtpmap:98 H264/90000\r\na=rtcp-fb:98 ccm fir\r\na=rtcp-fb:98 nack\r\na=rtcp-fb:98 nack pli\r\na=rtcp-fb:98 goog-remb\r\na=rtcp-fb:98 transport-cc\r\na=fmtp:98 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\r\na=rtpmap:99 rtx/90000\r\na=fmtp:99 apt=98'
    }, {
      name: 'VP8/90000',
      code: 96,
      rtx: 97,
      value: 'a=rtpmap:96 VP8/90000\r\na=rtcp-fb:96 ccm fir\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\na=rtcp-fb:96 goog-remb\r\na=rtcp-fb:96 transport-cc\r\na=rtpmap:97 rtx/90000\r\na=fmtp:97 apt=96'
    }, {
      name: 'red/90000',
      rtx: '101',
      code: 100,
      value: 'a=rtpmap:100 red/90000\r\na=rtpmap:101 rtx/90000\r\na=fmtp:101 apt=100'
    }, {
      name: 'ulpfec/90000',
      code: 127,
      value: 'a=rtpmap:127 ulpfec/90000'
    }, {
      name: 'flexfec-03/90000',
      code: 125,
      value: 'a=rtpmap:125 flexfec-03/90000\r\na=rtcp-fb:125 transport-cc\r\na=rtcp-fb:125 goog-remb\r\na=fmtp:125 repair-window=10000000'
    }];
    let separator = '\r\n';
    let getVideoCodecs = (len) => {
      let matches = sdp.match(/m=video\s+[\w\s/]+/);
      let videoDesc = matches[0];
      let codecs = videoDesc.split(' ');
      // m=video 55382 UDP/TLS/RTP/SAVPF 98....
      codecs.length = len;
      return codecs;
    };
    // 获取 m=video 编码表的前三位
    let videoCodecs = getVideoCodecs(3);

    // 得到 Video 描述信息列表
    let videoTotalIndex = sdp.indexOf('m=video');
    let ssrcIndex = sdp.indexOf('a=ssrc-group');
    if (utils.isEqual(ssrcIndex, -1)) {
      ssrcIndex = sdp.length;
    }
    let videoBody = sdp.substring(videoTotalIndex, ssrcIndex);
    let videoDescs = videoBody.split(separator);
    let supportCodecs = {};
    utils.forEach(codecs, (codec) => {
      let { name } = codec;
      utils.forEach(videoDescs, (desc) => {
        if (utils.isInclude(desc, name)) {
          supportCodecs[name] = codec;
        }
      });
    });
    let sdpBody = '';
    utils.forEach(supportCodecs, (codec) => {
      let { code, value, rtx } = codec;
      sdpBody += value + separator;
      videoCodecs.push(code, rtx);
    });
    // 新 SDP = m=video + 所有 a=rtpmap + sdpFooter
    videoBody = videoBody.split(separator);
    videoBody.shift();
    videoBody = videoBody.join(separator);
    let headerIndex = videoBody.indexOf('a=rtpmap');
    let sdpHeader = sdp.substring(0, videoTotalIndex);
    let videoHeader = videoBody.substring(0, headerIndex);
    // 包含 ssrc 信息
    let sdpFooter = sdp.substring(ssrcIndex, sdp.length);
    sdp = sdpHeader + videoCodecs.join(' ') + '\r\n' + videoHeader + sdpBody + sdpFooter;
    utils.extend(offer, {
      sdp
    });
    return offer;
  }

  getStreamId(user, size) {
    let tpl = '{userId}_{tag}';
    let { id: userId, stream } = user;
    if (!utils.isArray(stream)) {
      stream = [stream];
    }
    let [{ tag }] = stream;
    if (utils.isEqual(size, StreamSize.MIN)) {
      tpl = '{userId}_{tag}_tiny';
    }
    return utils.tplEngine(tpl, {
      userId,
      tag
    });
  }
}