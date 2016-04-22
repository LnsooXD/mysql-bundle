"use strict";
const CTRL_NORMAL = 100;
const CTRL_CONTINUE = 101;
const CTRL_BREAK = 102;

const mysql = require('../');
const util = require('../lib/util');
const co = require('co');

const alpha0 = mysql.obtainCo('alpha0');
const alpha1 = mysql.obtainCo('alpha1');
const beta0 = mysql.obtainCo('beta0');
const beta1 = mysql.obtainCo('beta1');

const clients = [alpha0, alpha1, beta0, beta1];


const userDataMap = {
	username: 'TDSam',
	nickname: 'Sam',
	gender: "male",
	age: 18
};

const userDataArray = [
	'Allen123', // username
	'Allen', // nickname
	'female',// gender
	21 // age
];

const updateNicknameData = {
	where: 'id',
	whereValue: 1,
	nickname: 'New Name'
};

co(function*() {
	yield every(clients, function*(i, client) {
		yield dropAndCreate(client);
	});

	let rows = yield alpha0.queryTemplate('insert_new_user_map', userDataMap);
	console.log('insert user result [rows] ', rows);

	rows = yield alpha1.queryTemplate('insert_new_user_array', userDataArray);
	console.log('insert user result: [rows] ', rows);

	rows = yield beta0.queryTemplate('insert_new_user_map_1', userDataMap);
	console.log('insert user result:[rows] ', rows);

	rows = yield beta0.queryTemplate('sub.update_user_name', updateNicknameData);
	console.log('update user result [rows] ', rows);

}).catch(function (e) {
	console.log(e.stack);
	throw  e;
});

function *dropAndCreate(client) {
	let rows = yield client.queryTemplate('drop_user_table');
	console.log('drop result: ', rows);
	rows = yield client.queryTemplate('create_user_table');
	console.log('create result: ', rows);
}

function *every(obj, eachCb) {
	for (let k in obj) {
		if (obj.hasOwnProperty(k)) {
			let res = yield eachCb(k, obj[k]);
			if (res === CTRL_BREAK) {
				break;
			}
		}
	}
}