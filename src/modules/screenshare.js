export default function ScreenShare(rtc){
  let start = () => {
    return rtc.exec('startScreenShare')
  };
  let stop = () => {
    return rtc.exec('stopScreenShare');
  };
  return {
    start,
    stop
  }
}