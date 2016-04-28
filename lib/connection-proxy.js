"use strict";
/*!
 * mysql-bundle - lib/connection-proxy.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
var it = require('ctrl-it');
var base = require('./base');
var is = require('is-type-of');
var base_apis = [
	'connect',
	'release',
	'changeUser',
	'beginTransaction',
	'commit',
	'rollback',
	'query',
	'ping',
	'statistics',
	'end',
	'destroy',
	'pause',
	'resume',
	'escape',
	'escapeId',
	'format'
];

var proxy = exports = module.exports = base.proxyClass();
var fn = proxy.fn;

// proxy common apis
it.each(base_apis, function (i, funcName) {
	fn[funcName] = function () {
		var conn = this.connection;
		return conn[funcName].apply(conn, arguments);
	};
});

fn.endTransaction = base.endTransaction;

fn.queryTemplate = function (tempName, values, cb) {
	this.query(base.template(tempName), values, cb);
};
