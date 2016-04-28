/*!
 * mysql-bundle - lib/util.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
var it = require('ctrl-it');
var is = require('is-type-of');

var isGeneratable = false;
var isGeneratableSetted = false;

exports = module.exports = {};
exports.class = _class;
exports.isGeneratable = isGen;

function _class(prototype /*, _extends */) {
  var _extends = [];

  var argc = arguments.length;
  if (argc > 1) {
    for (var i = 1; i < argc; i++) {
      _extends.push(arguments[i]);
    }
  }

  var clazz = function () {
    var obj = {__proto__: clazz.fn};
    it.each(_extends, function (k, v) {
      v.apply(obj, arguments);
    });
    clazz.fn.init.apply(obj, arguments);
    return obj;
  };

  clazz.fn = clazz.prototype = {};
  inherits(clazz, _extends);

  for (var key in prototype) {
    clazz.fn[key] = prototype[key];
  }

  clazz.fn.constructor = clazz;

  if (!is.function(clazz.fn.init)) {
    clazz.fn.init = function () {
    }
  }
  return clazz;
}

function inherits(sub, _extends) {
  var base;
  var len = _extends.length;
  for (var i = 0; i < len; i++) {
    base = create(_extends[i].prototype);
    for (var attr in base) {
      sub.prototype[attr] = base[attr];
    }
  }
  sub.prototype._extends = copy(_extends);
  if (len > 0) {
    // just instanceof first _extends or will broke _extends's construct
    sub.prototype.__proto__ = _extends[0].prototype;
  }
  sub.prototype.instanceof = function (clazz) {
    var res = false;
    it.each(_extends, function (k, v) {
      if (is.function(v.prototype.instanceof)) {
        if (v.prototype.instanceof(clazz)) {
          res = true;
          return true;
        }
      } else {
        if (v === clazz) {
          res = true;
          return true;
        }
      }
    });
    return res;
  };
}

function create(obj) {
  var _create;
  if (!Object.create) {
    _create = function (obj) {
      function F() {
      }

      F.prototype = obj;
      return new F();
    };
  } else {
    _create = Object.create;
  }
  return _create(obj);
}

function copy(obj) {
  var array = is.array(obj);
  var dst = array ? [] : {};
  if (array) {
    it.each(obj, (k, v)=> {
      dst.push(v);
    });
  } else {
    it.each(obj, (k, v)=> {
      dst[k] = v;
    });
  }
  return dst;
}
function isGen() {
  if (isGeneratableSetted) {
    return isGeneratable;
  }
  try {
    eval('(function*(){})');
    isGeneratable = true;
  } catch (e) {
  }
  isGeneratableSetted = true;
  return isGeneratable;
}
