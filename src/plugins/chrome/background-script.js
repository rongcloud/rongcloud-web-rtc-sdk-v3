var Keys = {
  GET: 'rong-share-get',
  GET_RESPONSE: 'rong-share-get-response'
};

var sendToContentScript = function (msg) {
  var opt = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(opt, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, msg);
  });
};

var listenContentMsg = function (callback) {
  chrome.runtime.onMessage.addListener(callback);
};

var getScreenShare = function (sender) {
  var sourceType = ['screen', 'window'];
  return new Promise(function (resolve, reject) {
    chrome.desktopCapture.chooseDesktopMedia(sourceType, sender.tab, function (sourceId) {
      resolve(sourceId);
    });
  });
};

listenContentMsg(function (data, sender) {
  var type = data.type;
  if (type === Keys.GET) {
    getScreenShare(sender).then(function (sourceId) {
      var content = {
        type: Keys.GET_RESPONSE,
        sourceId: sourceId
      };
      sendToContentScript(content);
    });
  }
});