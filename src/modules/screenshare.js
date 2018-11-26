export default function ScreenShare(rtc){
  let start = () => {
    return rtc.startScreenShare();
  };
  let stop = () => {
    return rtc.stopScreenShare();
  };
  return {
    start,
    stop
  }
}