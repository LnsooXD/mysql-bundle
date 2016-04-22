"use strict";
/**
 * Created with IntelliJ IDEA
 * <p/>
 * Project: iooly-mysql-client
 * Author: zsl(www.iooly.com)
 * Date:   16-4-15
 * Time:   下午9:29
 * Email:  app@iooly.com
 */
var util = require('./util');
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
util.each(base_apis, function (i, funcName) {
	fn[funcName] = function () {
		var conn = this.connection;
		return conn[funcName].apply(conn, arguments);
	};
});

fn.endTransaction = base.endTransaction;

fn.queryTemplate = function (tempName, values, cb) {
	this.query(base.template(tempName), values, cb);
};
