/*!
 * mysql-bundle - mysql-bundle.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */

exports = module.exports = {};

var util = require('./lib/util');
var Client = require('./lib/client');
var base = require('./lib/base');

exports.obtain = function (configName) {
  return new Client(configName);
};

if (util.isGeneratable()) {
  var ClientCo = require('./lib/client-co');
  exports.obtainCo = function (configName) {
    return new ClientCo(configName);
  };
}

exports.destroy = base.destroy;
exports.destroyCo = function destroyGen() {
  return function destroy(done) {
    base.destroy(function (err) {
      done(err);
    });
  }
};