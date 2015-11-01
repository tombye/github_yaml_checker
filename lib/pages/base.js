function BasePage(url) {
  var BasePage = function () {
    this.protocol = url.match(/^[a-z]+\:\/\//)[0],
    this.origin = url.match(RegExp('^' + this.protocol + '[^\/]+'))[0],
    this.pathname = url.replace(RegExp('^' + this.origin), '');
  };

  return new BasePage();
};

module.exports = BasePage;
