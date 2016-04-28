"use strict";
/*!
 * mysql-bundle - lib/connection-proxy-co.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
var it = require('ctrl-it');
const base = require('./base');
const thunk = require('thunkify');
const common_apis = [
	'release',
	'destroy',
	'pause',
	'resume',
	'escape',
	'escapeId',
	'format'
];

const thunk_apis = [
	'connect',
	'changeUser',
	'commit',
	'rollback',
	'query',
	'ping',
	'statistics',
	'end'
];

var proxy = exports = module.exports = base.proxyClass();

const fn = proxy.fn;

// proxy common apis
it.each(common_apis, function (i, funcName) {
	fn[funcName] = function () {
		let conn = this.connection;
		return conn[funcName].apply(conn, arguments);
	}
});

// proxy thunk apis
it.each(thunk_apis, function (i, funcName) {
	fn[funcName] = function*() {
		let conn = this.connection;
		let thunkify = thunk(conn[funcName]).bind(conn);
		return yield thunkify.apply(thunkify, arguments);
	};
});

fn.beginTransaction = function*() {
	let conn = this.connection;
	try {
		let thunkify = thunk(conn.beginTransaction).bind(conn);
		return yield thunkify.apply(thunkify, arguments);
	} catch (e) {
		this.release();
		throw e;
	}
};

fn.endTransaction = function *(err) {
	if (err) {
		yield this.rollback();
	} else {
		yield this.commit();
	}
	this.release();
};

fn.queryTemplate = function *(tempName, values) {
	return yield this.query(base.template(tempName), values);
};
