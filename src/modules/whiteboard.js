export default function WhiteBoard(rtc) {
  return {
    create: () => {
      return rtc.exec('createWhiteBoard');
    },
    getList: () => {
      return rtc.exec('getWhiteBoardList');
    }
  };
}