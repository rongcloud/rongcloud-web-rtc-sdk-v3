export default function Video(rtc) {
  return {
    disable: (user) => {
      return rtc.exec('disableVideo', user);
    },
    enable: (user) => {
      return rtc.exec('enableVideo', user);
    },
    set: (constraints) => {
      rtc.exec('setProfiles', constraints);
    }
  };
}