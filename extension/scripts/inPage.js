(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (window) {
  var Page = require('./lib/pages');

  var page = Page(window.location.href),
      yaml;

  chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.message == "SEND_EDITOR_YAML")
      try {
        yaml = page.getYaml();
        sendResponse({text: yaml});
      }
      catch (e) {
        sendResponse({error: e.message});
      }
  });
})(window);

},{"./lib/pages":2}],2:[function(require,module,exports){
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
    else {
      throw new Error('Pages from ' + this.origin + ' are not supported');
    }
  };

  return new Page();
};

module.exports = Page;

},{"./pages/base":3,"./pages/github":4,"extend":5}],3:[function(require,module,exports){
function BasePage(url) {
  var BasePage = function () {
    this.protocol = url.match(/^[a-z]+\:\/\//)[0],
    this.origin = url.match(RegExp('^' + this.protocol + '[^\/]+'))[0],
    this.pathName = url.replace(RegExp('^' + this.origin), '');
  };

  return new BasePage();
};

module.exports = BasePage;

},{}],4:[function(require,module,exports){
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

    // disable this page reader if the page has no editor
    if (this.type !== 'edit') {
      throw new Error('This page has no text editor to check for YAML');
    }
  };

  GithubPage.prototype.EditorText = EditorText;

  GithubPage.prototype.getYaml = function () {
    var text = EditorText();

    return text.toString();
  };

  return new GithubPage();
};

module.exports = GithubPage;

},{}],5:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}]},{},[1]);
