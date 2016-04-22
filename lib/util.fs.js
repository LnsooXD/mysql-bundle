exports = module.exports = require('fs.extra');

var exists = exports.existsSync;
var statSync = exports.statSync;

exports.isDirectorySync = isDirectorySync;

function isDirectorySync(path) {
	return exists(path) && statSync(path).isDirectory();
}

