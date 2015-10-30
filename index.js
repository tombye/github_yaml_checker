(function (window) {
  var yaml = require('js-yaml'),
      pageURL = require('./lib/url.js');

  function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
  }

  document.addEventListener('DOMContentLoaded', function() {
    var callback = function (urlStr) {
      var str = "key: >\n  'it's a thing'",
          url = pageURL(urlStr),
          result;
      
      console.log('url');
      console.log(url);
      renderStatus('Validating...');
      try {
        result = yaml.safeLoad(str, {
          'onWarning': function () {
            console.log(arguments);
          }
        });
        renderStatus(result);
        console.log(result);
      }
      catch (e) {
        console.log('bah, YAML error!');
        console.log(e);
      }
    };

    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      var tab = tabs[0];
      var url = tab.url;

      callback(url);
    });
  });
})(window);
