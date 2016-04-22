var async = require('async');
var mysql = require('../');

var alpha0 = mysql.obtain('alpha0');
var alpha1 = mysql.obtain('alpha1');
var beta0 = mysql.obtain('beta0');
var beta1 = mysql.obtain('beta1');

var clients = [alpha0, alpha1, beta0, beta1];


var userDataMap = {
	username: 'TDSam',
	nickname: 'Sam',
	gender: "male",
	age: 18
};

var userDataArray = [
	'Allen123', // username
	'Allen', // nickname
	'female',// gender
	21 // age
];

var updateNicknameData = {
	where: 'id',
	whereValue: 1,
	nickname: 'New Name'
};

async.each(clients, function (client, cb) {
	dropAndCreate(client, cb);
}, function (err) {
	if (!err) {
		alpha0.queryTemplate('insert_new_user_map', userDataMap, function (err, rows) {
			console.log('insert user result: [err] ', err, ' [rows] ', rows)
		});
		alpha1.queryTemplate('insert_new_user_array', userDataArray, function (err, rows) {
			console.log('insert user result: [err] ', err, ' [rows] ', rows)
		});
		beta0.queryTemplate('insert_new_user_map_1', userDataMap, function (err, rows) {
			console.log('insert user result: [err] ', err, ' [rows] ', rows);
			if (!err) {
				beta0.queryTemplate('sub.update_user_name', updateNicknameData, function (err, rows) {
					console.log('update user result: [err] ', err, ' [rows] ', rows);
				});
			}
		});
	}
});


function dropAndCreate(client, cb) {
	client.queryTemplate('drop_user_table', function (err, rows) {
		if (!err) {
			console.log('drop result: ', rows);
			client.queryTemplate('create_user_table', function (err, rows) {
				if (err) {
					console.log(err);
				} else {
					console.log('create result: ', rows);
				}
				cb(err);
			});
		} else {
			console.log(err);
			cb(err);
		}
	});
}
