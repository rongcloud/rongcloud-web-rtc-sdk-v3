import Video from './video';
import Audio from './audio';

export default function Stream(rtc) {
  let $video = Video(rtc);
  let $audio = Audio(rtc);
  let get = (user) => {
    console.log(user);
  };
  return {
    $video,
    $audio,
    get
  };
}