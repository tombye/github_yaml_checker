var extend = require('extend');
var BasePage = require('./pages/base');

function Page(url) {
  var getPageTypeForOrigin = function (origin) {
    var pageTypes = {
      'https://github.com': require('./pages/github')
    };
    var pageType;

    if (origin in pageTypes) {
      return pageTypes[origin];
    }

    return false;
  };

  var Page = function () {
    var base = BasePage(url);

    // set base properties
    extend(this, base);

    // if a type of page exists for the origin domain, extend the base with it
    pageType = getPageTypeForOrigin(base.origin);

    if (pageType) {
      extend(this, pageType());
      this.init();
    }
  };

  return new Page();
};

module.exports = Page;
