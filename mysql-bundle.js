exports = module.exports = {};

var Client = require('./lib/client');
exports.obtain = function (configName) {
	return new Client(configName);
};

try {
	var ClientCo = require('./lib/client-co');
	exports.obtainCo = function (configName) {
		return new ClientCo(configName);
	};
} catch (e) {
	console.log(e);
}