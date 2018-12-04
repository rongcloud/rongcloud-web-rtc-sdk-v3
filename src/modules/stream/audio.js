export default function Audio(rtc){
  return {
    mute: (user) => {
      return rtc.exec('mute', user);
    },
    unmute: (user) => {
      return rtc.exec('unmute', user);
    }
  };
}