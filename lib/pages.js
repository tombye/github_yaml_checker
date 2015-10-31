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
  var EditorText = function () {
    var EditorText = function () {
      this.EOL = '\n';
      this.textLayerElm = document.querySelectorAll('.ace_editor .ace_content .ace_text-layer');
      this.linesElms = this.textLayerElm[0].getElementsByClassName('ace_line');
      this.linesData = this.getLinesData();
    }

    EditorText.prototype.getLinesData = function () {
      var linesData = [],
          a, b;

      var getLineData = function (lineElm) {
        var lineData = [],
            childNodes = lineElm.childNodes,
            numberOfChildren = childNodes.length,
            childText,
            i;

        if (numberOfChildren > 0) {
          for (i = 0; i < numberOfChildren; i++) {
            if (childNodes[i].nodeType === 3) {
              childText = childNodes[i].nodeValue
            }
            else {
              childText = childNodes[i].childNodes[0].nodeValue;
            }
            lineData.push(childText);
          }
        }

        return lineData;
      };

      for (a = 0, b = this.linesElms.length; a < b; a++) {
        linesData.push(getLineData(this.linesElms[a]));      
      }

      return linesData;
    };

    EditorText.prototype.toString = function () {
      var str = "",
          a, b;

      for (a = 0, b = this.linesData.length; a < b; a++) {
        lineData = this.linesData[a];
        for (i = 0, j = lineData.length; i < j; i++) {
          str += lineData[i];
        }
        str += this.EOL;
      }

      return str;
    };

    return new EditorText;
  };

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

  GithubPage.prototype.EditorText = EditorText;

  GithubPage.prototype.getYaml = function () {
    var text = EditorText();

    return text.toString();
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
