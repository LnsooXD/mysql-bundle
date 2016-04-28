"use strict";
/*!
 * mysql-bundle - lib/client-co.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
var base = require('./base');
var proxyAsync = require('./connection-proxy');
var proxy = require('./connection-proxy-co');
var is = require('is-type-of');
var co = require('co');

exports = module.exports = base.clientClass();

exports.fn.getConnection = function *() {
	return new proxy(yield this.namespace.getConnectionCo());
};

exports.fn.beginTransaction = function *() {
	let conn = yield this.getConnection();
	yield conn.beginTransaction();
	return conn;
};

exports.fn.endTransaction = function *(conn, err) {
	yield conn.endTransaction(err);
};

exports.fn.query = function (sql, values, querySetup) {
	return new Promise(function (resolve, reject) {
		var query = base.createQuery(sql, values, function (err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});

		query._callSite = new Error;

		this.namespace.getConnection(function (err, conn) {
			if (err) {
				query.on('error', function () {
				});
				query.end(err);
				return;
			}

			conn = new proxyAsync(conn);

			// Release connection based off event
			query.once('end', function () {
				conn.release();
			});

			conn.query(query);
		});
		if (is.generatorFunction(querySetup)) {
			co(querySetup, query).catch(function (e) {
				reject(e);
			});
		} else if (is.function(querySetup)) {
			querySetup(query);
		}
	}.bind(this));
};

exports.fn.queryTemplate = function *(tempName, values) {
	return yield this.query(base.template(tempName), values);
};