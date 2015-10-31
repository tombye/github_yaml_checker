var extend = require('extend');

function BasePage(url) {
  var BasePage = function () {
    this.protocol = url.match(/^[a-z]+\:\/\//)[0],
    this.origin = url.match(RegExp('^' + this.protocol + '[^\/]+'))[0],
    this.pathName = url.replace(RegExp('^' + this.origin), '');
  };

  return new BasePage();
};

function GithubPage() {
  var GithubPage = function () {};

  GithubPage.prototype.init = function () {
    var pathComponents;

    pathComponents = this.pathName.split('/');
    pathComponents.shift();
    this.user = pathComponents[0];
    this.repo = pathComponents[1];
    this.type = pathComponents[2];
    this.branch = pathComponents[3];
    this.fileName = pathComponents[pathComponents.length - 1];
    this.fileExtension = this.fileName.split('.')[1];
  };

  GithubPage.prototype.getYaml = function () {
    var fileName = this.fileName.split('.')[0].toLowerCase(),
        textarea

    console.log(document.getElementById);
    console.log('blob_contents_' + fileName + '-' + this.fileExtension);
    textarea = document.getElementById('blob_contents_' + fileName + '-' + this.fileExtension);
    return textarea.value;
  };

  return new GithubPage();
};

var pageTypes = {
  'https://github.com': GithubPage
};

function Page(url) {
  var Page = function () {
    var base = BasePage(url);

    // set base properties
    extend(this, base);

    if (base.origin in pageTypes) {
      urlType = pageTypes[base.origin]();
      extend(this, urlType);
      this.init();
    }
  };

  return new Page();
};

module.exports = {
  'Page': Page,
  'GithubPage': GithubPage
};
