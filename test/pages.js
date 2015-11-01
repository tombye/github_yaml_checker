var chai = require('chai'),
    path = require('path'),
    assert = chai.assert,
    expect = chai.expect;

var BasePage = require(path.normalize(__dirname + '/../lib/pages/base'));

describe('BasePage', function() {
  var page,
      url;

  it('should make the right parts of the url available as properties', function () {
    url = 'http://www.google.co.uk';
    page = BasePage(url);
    expect(page).to.have.all.keys(['protocol', 'origin', 'pathname']);
  });

  it('should set the correct properties for a http/https URL', function () {
    url = 'http://www.bbc.co.uk/news/uk';
    page = BasePage(url);
    assert.equal(page.protocol, 'http://');
    assert.equal(page.origin, 'http://www.bbc.co.uk');
    assert.equal(page.pathname, 'news/uk');

    url = 'https://www.bbc.co.uk/news/uk';
    page = BasePage(url);
    assert.equal(page.protocol, 'https://');
    assert.equal(page.origin, 'https://www.bbc.co.uk');
    assert.equal(page.pathname, 'news/uk');
  });
});
