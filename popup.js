(function (window) {
  var yaml = require('js-yaml'),
      Page = require('./lib/pages');

  function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
  }

  function parseYAML(pageYaml) {
    try {
      result = yaml.safeLoad(pageYaml, {
        'onWarning': function () {
          renderStatus('YAML warning');
          console.log(arguments);
        }
      });
      renderStatus('YAML is valid');
      console.log(result);
    }
    catch (e) {
      renderStatus('YAML error: ' + e.message);
    }
  }
  
  function callback (tabs) {
    var result,
        page;
    
    renderStatus('Starting...');

    try {
      page = Page(tabs[0].url);
    }
    catch (e) {
      renderStatus(e.message);
      return;
    }

    // send request for YAML to content script
    chrome.tabs.sendMessage(tabs[0].id, { message: "SEND_EDITOR_YAML" }, function(response) {
      // parse received YAML
      parseYAML(response.text);
    });
  };

  document.addEventListener('DOMContentLoaded', function (event) {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      callback(tabs);
    });
  }, false);

})(window);
