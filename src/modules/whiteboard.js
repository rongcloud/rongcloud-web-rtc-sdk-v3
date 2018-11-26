export default function WhiteBoard(rtc) {
  return {
    create: () => {
      return rtc.createWhiteBoard();
    },
    getList: () => {
      return rtc.getWhiteBoardList();
    }
  };
}