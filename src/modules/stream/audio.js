export default function Audio(rtc){
  return {
    mute: (user) => {
      return rtc.mute(user);
    },
    unmute: (user) => {
      return rtc.unmute(user);
    }
  };
}