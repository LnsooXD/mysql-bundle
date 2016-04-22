/*!
 * mysql-bundle - lib/util.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
var CTRL_NORMAL = 100;
var CTRL_CONTINUE = 101;
var CTRL_BREAK = 102;

var is = require('is-type-of');

exports = module.exports = {};
exports.class = _class;
exports.each = each;

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
		each(_extends, function (k, v) {
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

function each(obj, eachCb) {
	for (var k in obj) {
		if (obj.hasOwnProperty(k)) {
			var res = eachCb(k, obj[k]);
			if (res === CTRL_BREAK) {
				break;
			}
		}
	}
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
	sub.prototype._extends = each(_extends);
	if (len > 0) {
		// just instanceof first _extends or will broke _extends's construct
		sub.prototype.__proto__ = _extends[0].prototype;
	}
	sub.prototype.instanceof = function (clazz) {
		var res = false;
		each(_extends, function (k, v) {
			if (is.function(v.prototype.instanceof)) {
				if (v.prototype.instanceof(clazz)) {
					res = true;
					return CTRL_BREAK;
				}
			} else {
				if (v === clazz) {
					res = true;
					return CTRL_BREAK;
				}
			}
			return CTRL_NORMAL;
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