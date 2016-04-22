require('./util.string');

var util = require('./util');
var fs = require('./util.fs');
var path = require('path');
var mysql = require('mysql');
var config = require('config').get('mysql-bundle');
var is = require('is-type-of');
var not = require('not-type-of');
var thunk = require('thunkify');


var SQL_TEMPLATES = {};
var mainConfig = getMainConfig();

var poolCluster = mysql.createPoolCluster(mainConfig);

initAllSqlTemplates();
initClusters();

exports = module.exports = {
	template: function template(name) {
		return SQL_TEMPLATES[name];
	},
	endTransaction: function (err, cb) {
		if (err) {
			this.rollback(function () {
				this.release();
				cb(err);
			}.bind(this));
		} else {
			this.commit(function (err) {
				this.release();
				cb(err);
			}.bind(this));
		}
	},
	createQuery: mysql.createQuery,
	clientClass: function () {
		return util.class({
			selector: null,
			namespace: null,
			init: function (selector) {
				this.selector = selector;
				this.namespace = namespace(selector);
				return this;
			}
		});
	},
	proxyClass: function () {
		return util.class({
			connection: null,
			init: function (conn) {
				conn.config.stringifyObjects = false;
				checkAndAddFunc(conn.config, conn, 'queryFormat', queryFormat);
				this.connection = conn;
			}
		});
	}
};

function checkAndAddFunc(obj, context, funcName, func) {
	var cfg = obj['__iooly_add_func_config__'];
	if (is.undefined(cfg)) {
		cfg = {};
		obj['__iooly_add_func_config__'] = cfg;
	}
	if (is.undefined(cfg[funcName])) {
		obj[funcName] = function () {
			return func.apply(context, arguments);
		};
		cfg[funcName] = {
			name: funcName,
			context: context,
			func: obj[funcName]
		}
	}
}

function queryFormat(sql, values) {
	if (!values) {
		return sql;
	}

	console.log(values);

	var stringifyObjects = this.config.stringifyObjects;
	var timezone = this.config.timezone;
	sql = mysql.format(sql, values, stringifyObjects, timezone);
	sql = sql.replace(/(\:\:?)(\w+)/g, function (text, prefix, key) {
		if (values.hasOwnProperty(key)) {
			text = prefix === '::'
				? mysql.escapeId(values[key])
				: mysql.escape(values[key], stringifyObjects, timezone);
		}
		return text;
	}.bind(this));
	return sql;
}

function namespace(selector) {
	var namespace = poolCluster.of(selector);
	namespace.getConnectionCo = thunk(namespace.getConnection).bind(namespace);
	return namespace
}

function initAllSqlTemplates() {
	initSqlTemplatesDir(mainConfig.templateDir, '');
}

function initClusters() {
	var clusters = config['cluster'];
	util.each(clusters, function (name, config) {
		poolCluster.add(name, config);
	});
}

function initSqlTemplatesDir(sqlDir, prefix) {
	if (!fs.isDirectorySync(sqlDir)) {
		return;
	}
	var files = fs.readdirSync(sqlDir);
	var fileName;
	var filepath;

	util.each(files, function (i, file) {
		fileName = file.toString();
		if (fileName.endsWith(".sql")) {
			var key = prefix + fileName.substr(0, fileName.length - 4);
			SQL_TEMPLATES[key] = fs.readFileSync(path.join(sqlDir, fileName), 'utf-8');
		} else if (fs.isDirectorySync(filepath = path.join(sqlDir, fileName))) {
			initSqlTemplatesDir(filepath, prefix + fileName + '.');
		}
	});
}


function getMainConfig() {
	var defaultConfig = {
		canRetry: true,
		restoreNodeTimeout: 10000,
		defaultSelector: 'RANDOM',
		templateDir: 'mysql-bundle/sql'
	};
	var mainConfig = config['config'] || {};
	util.each(defaultConfig, function (k, v) {
		if (!mainConfig.hasOwnProperty(k)) {
			mainConfig[k] = v;
		}
	});

	mainConfig.templateDir = path.join(process.cwd(), mainConfig.templateDir);

	return mainConfig;
}