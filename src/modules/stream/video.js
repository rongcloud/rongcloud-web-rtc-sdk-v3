export default function Video(rtc){
  return {
    disable: (user) => {
      return rtc.disableVideo(user);
    },
    enable: (user) => {
      return rtc.enableVideo(user);
    }
  };
}