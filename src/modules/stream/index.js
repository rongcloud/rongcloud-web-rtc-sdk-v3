import Video from './video';
import Audio from './audio';

export default function Stream(rtc) {
  let $video = Video(rtc);
  let $audio = Audio(rtc);
  let get = (user) => { 
    return rtc.getStream(user);
  };
  return {
    $video,
    $audio,
    get
  };
}