/*!
 * mysql-bundle - lib/util.fs.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
exports = module.exports = require('fs.extra');

var exists = exports.existsSync;
var statSync = exports.statSync;

exports.isDirectorySync = isDirectorySync;

function isDirectorySync(path) {
	return exists(path) && statSync(path).isDirectory();
}

