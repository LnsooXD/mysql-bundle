"use strict";
/**
 * Created with IntelliJ IDEA
 * <p/>
 * Project: LookscreenManager
 * Author: zsl(www.iooly.com)
 * Date:   16-1-19
 * Time:   上午1:03
 * Email:  app@iooly.com
 */
var base = require('./base');
var proxy = require('./connection-proxy');

exports = module.exports = base.clientClass();

exports.fn.getConnection = function (cb) {
	this.namespace.getConnection(function (err, connection) {
		if (err) {
			cb(err);
		} else {
			cb(null, new proxy(connection));
		}
	});
};

exports.fn.beginTransaction = function (cb) {
	this.getConnection(function (err, conn) {
		if (err) {
			cb(err);
		} else {
			conn.beginTransaction(function (err) {
				if (err) {
					conn.release();
					cb(err);
				} else {
					cb(null, conn);
				}
			});
		}
	});
};

exports.fn.endTransaction = function (conn, err, cb) {
	base.endTransaction.call(conn, err, cb);
};

exports.fn.query = function (sql, values, cb) {
	var query = base.createQuery(sql, values, cb);
	query._callSite = new Error;
	this.getConnection(function (err, conn) {
		if (err) {
			query.on('error', function () {
			});
			query.end(err);
			return;
		}

		// Release connection based off event
		query.once('end', function () {
			conn.release();
		});

		conn.query(query);
	});
	return query;
};

exports.fn.queryTemplate = function (tempName, values, cb) {
	this.query(base.template(tempName), values, cb);
};


