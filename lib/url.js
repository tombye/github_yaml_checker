var extend = require('extend');

function BaseURL(url) {
  var BaseURL = function () {
    this.protocol = url.match(/^[a-z]+\:\/\//)[0],
    this.origin = url.match(RegExp('^' + this.protocol + '[^\/]+'))[0],
    this.pathName = url.replace(RegExp('^' + this.origin), '');
  };

  return new BaseURL();
};

function GithubURL() {
  var GithubURL = function () {};

  GithubURL.prototype.init = function () {
    var pathComponents;

    pathComponents = this.pathName.split('/');
    pathComponents.shift();
    this.user = pathComponents[0];
    this.repo = pathComponents[1];
    this.type = pathComponents[2];
    this.branch = pathComponents[3];
  };

  return new GithubURL();
};

var pages = {
  'https://github.com': GithubURL
};

function URL(url) {
  var URL = function () {
    var base = BaseURL(url);

    // set base properties
    extend(this, base);

    if (base.origin in pages) {
      pageType = pages[base.origin]();
      extend(this, pageType);
      this.init();
    }
  };

  return new URL();
};

module.exports = URL;
