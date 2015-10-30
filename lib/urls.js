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

var urlTypes = {
  'https://github.com': GithubURL
};

function PageURL(url) {
  var PageURL = function () {
    var base = BaseURL(url);

    // set base properties
    extend(this, base);

    if (base.origin in urlTypes) {
      urlType = urlTypes[base.origin]();
      extend(this, urlType);
      this.init();
    }
  };

  return new PageURL();
};

module.exports = {
  'PageURL': PageURL,
  'GithubURL': GithubURL
};
