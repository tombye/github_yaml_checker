var yaml = require('js-yaml');

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  var str = '"key": value',
      result;

  try {
    result = yaml.safeLoad(str);
    console.log(result);
  }
  catch (e) {
    console.log('bah, YAML error!');
  }
});
