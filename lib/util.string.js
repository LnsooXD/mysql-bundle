exports = module.exports = String;
var is = require('is-type-of');
var fn = exports.prototype;

if (is.undefined(fn.endsWith)) {
	fn.endsWith = function (str) {
		if (str && str.length > 0) {
			var len = str.length;
			if (this.length < len) {
				return false;
			}
			return str == this.substr(this.length - len)
		}
		return false;
	};
}

if (is.undefined(fn.startsWith)) {
	fn.startsWith = function (str) {
		if (str && str.length > 0) {
			var len = str.length;
			if (this.length < len) {
				return false;
			}
			return str == this.substr(0, len);
		}
		return false;
	};
}

if (is.undefined(fn.contains)) {
	fn.contains = function (str) {
		return this.indexOf(str) >= 0;
	};
}
