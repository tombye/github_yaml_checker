(function (window) {
  var Page = require('./lib/pages');

  var page = Page(window.location.href),
      yaml;

  chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.message == "SEND_EDITOR_YAML")
      yaml = page.getYaml();
      sendResponse({text: yaml});
  });
})(window);
